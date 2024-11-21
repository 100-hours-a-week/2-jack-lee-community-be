const fs = require('fs');
const path = require('path');

// JSON 파일 경로 설정
const dataFilePath = path.join(__dirname, '../data/users.json');

// JSON 파일에서 데이터를 읽는 함수
const readUserData = () => {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify([])); // 파일 없으면 빈 배열 생성
    }
    const rawData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(rawData);
};

// JSON 파일에 데이터를 쓰는 함수
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 4));
};

// 모든 유저 데이터 가져오기
exports.getAllUsers = (req, res) => {
    return readUserData();
    res.status(200).json(users);
};

// 특정 이메일로 유저 찾기
exports.findUserByEmail = (email) => {
    const users = readUserData();
    return users.find((user) => user.email === email);
};

// 유저 저장 (회원가입)
exports.createUser = (newUser) => {
    const users = readData();
    const userId = users.length + 1;
    const userWithId = { ...newUser, userId };
    users.push(userWithId);
    writeData(users);
    return userWithId;
};

// 특정 ID로 유저 찾기
exports.findUserById = (userId) => {
    const users = readData();
    return users.find((user) => user.userId === parseInt(userId, 10));
};

// 유저 정보 업데이트
exports.updateUser = (userId, updatedData) => {
    const users = readData();
    const userIndex = users.findIndex(
        (user) => user.userId === parseInt(userId, 10),
    );

    if (userIndex === -1) {
        return null; // 유저가 없으면 null 반환
    }

    // 기존 유저 데이터를 업데이트
    users[userIndex] = { ...users[userIndex], ...updatedData };
    writeData(users);

    return users[userIndex];
};

// 특정 ID의 유저 삭제
exports.deleteUser = (userId) => {
    const users = readData();
    const updatedUsers = users.filter(
        (user) => user.userId !== parseInt(userId, 10),
    );

    if (users.length === updatedUsers.length) {
        return false; // 삭제된 유저가 없으면 false 반환
    }

    writeData(updatedUsers);
    return true;
};
