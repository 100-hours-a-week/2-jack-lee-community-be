const fs = require('fs');
const path = require('path');

// JSON 파일과 데이터 폴더 초기화
module.exports = () => {
    const dataDir = path.join(__dirname, '../data'); // 'data' 디렉토리 경로 설정

    // 'data' 폴더가 존재하지 않으면 생성
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    // 초기화할 JSON 파일 목록
    const filesToInitialize = ['users.json', 'posts.json'];

    filesToInitialize.forEach((fileName) => {
        const filePath = path.join(dataDir, fileName);

        // JSON 파일이 존재하지 않으면 빈 배열로 초기화
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }
    });
};
