const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const formatDateTime = require('../utils/utils');
const crypto = require('crypto');

// JSON 파일 경로 설정 - 사용자 관련 json 파일은 data/users.json에 저장
const userFilePath = path.join(__dirname, '../data/users.json');

// JSON 파일 읽기
const readUserFile = async () => {
    try {
        const userData = fs.readFileSync(userFilePath, 'utf-8'); // 파일 읽기
        if (!userData.trim()) {
            // 파일이 비어 있으면 빈 배열 반환
            return [];
        }
        const parsedData = JSON.parse(userData);
        if (!Array.isArray(parsedData)) {
            throw new Error('Data is not in expected array format');
        }
        return parsedData;
    } catch (error) {
        console.error('Error reading user file:', error);
        return []; // 오류 발생 시 빈 배열 반환
    }
};

// JSON 파일 쓰기
const writeUserFile = async (userData) => {
    try {
        fs.writeFileSync(
            userFilePath,
            JSON.stringify(userData, null, 2),
            'utf-8',
        ); // 동기적으로 파일 쓰기
    } catch (error) {
        console.error('Error writing to user file:', error);
        throw new Error('Failed to write user data to file');
    }
};

// 비밀번호 해싱
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// userModel 객체 리터럴
const userModel = {
    // 인증, 입력받은 email로 사용자를 찾은 다음 비밀번호가 일치하면 비밀번호를 제외한 사용자 정보 반환
    validateUser: async (email, password) => {
        const user = await userModel.getUserByEmail(email);

        if (user && user.password === hashPassword(password)) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }

        return null;
    },
    getAllUsers: async () => await readUserFile(),
    getUserById: async (id) => {
        const users = await readUserFile(); // 파일에서 데이터 읽기

        if (users.length === 0) {
            console.warn('No users found in the file');
            return null; // 배열이 비어 있으면 null 반환
        }

        return users.find((user) => user.id === id) || null; // ID로 검색
    },
    getUserByEmail: async (email) => {
        const users = await readUserFile();
        return users.find((user) => user.email === email);
    },
    addUser: async (newUser) => {
        let users = await readUserFile(); // 파일에서 데이터 읽기
        if (!users) {
            users = [];
        }
        // ID 생성
        newUser.id = uuidv4();
        // 비밀번호 해싱
        newUser.password = hashPassword(newUser.password);
        // 불필요한 필드 제거
        delete newUser.re_password;
        // 새 사용자 추가
        users.push(newUser);
        writeUserFile(users); // 업데이트된 데이터를 파일에 저장

        return newUser; // 추가된 사용자 반환
    },
    updateUser: async (id, updatedUser) => {
        let users = await readUserFile(); // 파일에서 데이터 읽기

        if (users.length === 0) {
            console.warn('No users to update');
            return null; // 업데이트할 데이터가 없음
        }

        const index = users.findIndex((user) => user.id === id);

        if (index === -1) {
            console.warn(`User with ID ${id} not found`);
            return null; // 업데이트 대상 ID가 없음
        }

        const { nickname, profile_image } = updatedUser;
        if (nickname) users[index].nickname = nickname;
        if (profile_image) users[index].profile_image = profile_image;

        writeUserFile(users); // 변경된 데이터를 파일에 저장

        return users[index]; // 업데이트된 사용자 반환
    },
    deleteUser: async (id) => {
        let users = await readUserFile(); // 파일에서 데이터 읽기

        if (users.length === 0) {
            console.warn('No users to delete');
            return false; // 삭제할 데이터가 없음
        }

        const filteredUsers = users.filter((user) => user.id !== id);

        if (users.length === filteredUsers.length) {
            console.warn(`User with ID ${id} not found`);
            return false; // 삭제 대상 ID가 없음
        }

        writeUserFile(filteredUsers); // 변경된 데이터를 파일에 저장

        return true; // 성공적으로 삭제
    },
    changePassword: async (id, newPassword) => {
        const users = await readUserFile();
        const index = users.findIndex((user) => user.id === id);

        if (index !== -1) {
            users[index].password = newPassword; // 비밀번호 업데이트
            await writeUserFile(users);
            return true; // 성공적으로 변경
        }
        return false; // 사용자 ID를 찾을 수 없음
    },
    isEmailDuplicate: async (email) => {
        const users = await readUserFile();
        email = email.trim(); // 공백 제거
        email = email.replace(/\s+/g, ''); // 문자열 내 모든 공백 제거
        email = email.replace(/['"]+/g, ''); // 따옴표 제거
        return users.some((user) => user.email === email); // 중복된 이메일이 있으면 true, 없으면 false
    },
    isNicknameDuplicate: async (nickname) => {
        const users = await readUserFile();
        nickname = nickname.trim(); // 공백 제거
        nickname = nickname.replace(/\s+/g, ''); // 문자열 내 모든 공백 제거
        nickname = nickname.replace(/['"]+/g, ''); // 따옴표 제거
        return users.some((user) => user.nickname === nickname); // 중복된 닉네임이 있으면 true, 없으면 false
    },
    updateProfileImage: async (userId, profileImage) => {
        const users = await readUserFile();
        const user = users.find((user) => user.id === userId);

        if (!user) return null;

        // 자바스크립트의 객체 참조 방식으로 인해, user 값을 변경하면 users 배열의 값도 바뀐다.
        user.profile_image = profileImage;
        await writeUserFile(users);
        return user;
    },
};

module.exports = userModel;
