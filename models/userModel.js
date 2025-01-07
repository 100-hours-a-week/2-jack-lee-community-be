import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// 현재 파일 경로와 디렉토리 경로 초기화 (ES 모듈 호환)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON 파일 경로 설정 - 사용자 관련 json 파일은 data/users.json에 저장
const userFilePath = path.join(__dirname, '../data/users.json');

// JSON 파일 읽기
const readUserFile = async () => {
    try {
        const userData = fs.readFileSync(userFilePath, 'utf-8');
        if (!userData.trim()) {
            return [];
        }
        const parsedData = JSON.parse(userData);
        if (!Array.isArray(parsedData)) {
            throw new Error('Data is not in expected array format');
        }
        return parsedData;
    } catch (error) {
        console.error('Error reading user file:', error);
        return [];
    }
};

// JSON 파일 쓰기
const writeUserFile = async (userData) => {
    try {
        fs.writeFileSync(
            userFilePath,
            JSON.stringify(userData, null, 2),
            'utf-8',
        );
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
    // 사용자 인증
    validateUser: async (email, password) => {
        const user = await userModel.getUserByEmail(email);
        if (user && user.password === hashPassword(password)) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    },

    // 모든 사용자 조회
    getAllUsers: async () => await readUserFile(),

    // ID로 사용자 조회
    getUserById: async (id) => {
        const users = await readUserFile();
        return users.find((user) => user.id === id) || null;
    },

    // 이메일로 사용자 조회
    getUserByEmail: async (email) => {
        const users = await readUserFile();
        return users.find((user) => user.email === email) || null;
    },

    // 새 사용자 추가
    addUser: async (newUser) => {
        const users = await readUserFile();
        newUser.id = uuidv4();
        newUser.password = hashPassword(newUser.password);
        delete newUser.re_password;
        users.push(newUser);
        await writeUserFile(users);
        return newUser;
    },

    // 사용자 업데이트
    updateUser: async (id, updatedUser) => {
        const users = await readUserFile();
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) return null;

        const { nickname, profile_image } = updatedUser;
        if (nickname) users[index].nickname = nickname;
        if (profile_image) users[index].profile_image = profile_image;

        await writeUserFile(users);
        return users[index];
    },

    // 사용자 삭제
    deleteUser: async (id) => {
        const users = await readUserFile();
        const filteredUsers = users.filter((user) => user.id !== id);
        if (users.length === filteredUsers.length) return false;

        await writeUserFile(filteredUsers);
        return true;
    },

    // 비밀번호 변경
    changePassword: async (id, newPassword) => {
        const users = await readUserFile();
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) return false;

        users[index].password = hashPassword(newPassword);
        await writeUserFile(users);
        return true;
    },

    // 이메일 중복 체크
    isEmailDuplicate: async (email) => {
        const users = await readUserFile();
        return users.some(
            (user) =>
                user.email ===
                email.trim().replace(/\s+/g, '').replace(/['"]+/g, ''),
        );
    },

    // 닉네임 중복 체크
    isNicknameDuplicate: async (nickname) => {
        const users = await readUserFile();
        return users.some(
            (user) =>
                user.nickname ===
                nickname.trim().replace(/\s+/g, '').replace(/['"]+/g, ''),
        );
    },

    // 프로필 이미지 업데이트
    updateProfileImage: async (userId, profileImage) => {
        const users = await readUserFile();
        const user = users.find((user) => user.id === userId);
        if (!user) return null;

        user.profile_image = profileImage;
        await writeUserFile(users);
        return user;
    },
};

export default userModel;
