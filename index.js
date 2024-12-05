const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoute');

// JSON 파일 및 디렉토리 초기화
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
const dataFilePath = path.join(dataDir, 'users.json');
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

const app = express();
const PORT = 3000;
// data 폴더에 JSON 파일 저장
const upload = multer({ dest: 'data/' });

app.use(express.json()); // JSON 요청 파싱
app.use(bodyParser.json());
app.use(cors()); // cors 설정

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// 프론트엔드 파일 가져오기
const frontendPath = path.join(__dirname, '../2-jack-lee-community-fe/public');
app.use(express.static(frontendPath)); // 클라이언트에 정적 파일 제공(서빙)

// 정적 파일 서빙 경로 설정
app.use(
    '/profile-images',
    express.static(path.join(__dirname, 'data/profile-images')),
);
app.use(
    '/post-images',
    express.static(path.join(__dirname, 'data/post-images')),
);

// HTML 파일 처리(3000번 포트)
// 회원가입
app.get('/users/register', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/signup.html'));
});

// 로그인
app.get('/users/login', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/login.html'));
});

// 사용자 정보 수정
app.get('/users/:id/edit', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/user-modify.html'));
});

// 사용자 비밀번호 수정
app.get('/users/:id/edit-pw', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/user-pw-modify.html'));
});

// 게시글 목록
app.get('/posts', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/post-list.html'));
});

// 게시글 추가
app.get('/posts/add', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/post-add.html'));
});

// 게시글 상세 조회
app.get('/posts/:post_id', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/post-detail.html'));
});

// 게시글 수정
app.get('/posts/:post_id/edit', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/post-modify.html'));
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT} 에서 서버 실행 중~~~`);
});
