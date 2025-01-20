import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 파일 경로와 디렉토리 경로 초기화 (ES 모듈 호환)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON 파일과 데이터 폴더 초기화 함수
const initializeDataDirectory = () => {
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

export default initializeDataDirectory;
