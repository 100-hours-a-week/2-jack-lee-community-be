import path from 'path';
import { fileURLToPath } from 'url';

// 현재 파일 경로와 디렉토리 경로 초기화 (ES 모듈 호환)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__filename, __dirname);
