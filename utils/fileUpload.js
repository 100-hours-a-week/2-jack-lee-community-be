import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 현재 파일 경로와 디렉토리 경로 초기화 (ES 모듈 호환)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 저장 경로를 동적으로 설정하는 함수
const dynamicStorage = (folder) =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, folder);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true }); // 폴더가 없으면 생성
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
                null,
                `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
            );
        },
    });

// 파일 확장자 필터링
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
};

// 게시글 이미지 업로드용 설정
const postImageUpload = multer({
    storage: dynamicStorage('../data/post-images'),
    fileFilter,
});

// 프로필 이미지 업로드용 설정
const profileImageUpload = multer({
    storage: dynamicStorage('../data/profile-images'),
    fileFilter,
});

export { postImageUpload, profileImageUpload };
