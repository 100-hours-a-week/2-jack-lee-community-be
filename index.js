const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// 라우터
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoute');
const authRoutes = require('./routes/authRoute');

// 미들웨어
const sessionMiddleware = require('./middlewares/sessionMiddleware');
const corsMiddleware = require('./middlewares/corsMiddleware');
//const cryptoMiddleware = require('./middlewares/cryptoMiddleware');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const jsonInit = require('./middlewares/jsonInit');

const app = express();
const PORT = 3000;

// 1. JSON 및 폴더 초기화
jsonInit();

// 2. 글로벌 미들웨어
app.use(bodyParser.json());
app.use(corsMiddleware);
app.use(loggerMiddleware);

// 세션이 필요 없는 라우트(예: 정적 파일 서빙)에서는 비효율적, 세션이 필요한 라우트에서만 적용
app.use(sessionMiddleware);
// 암호화/복호화 기능이 필요한 라우트에서만 적용
// app.use('api/auths', cryptoMiddleware);

// 3. 라우터 설정
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/auths', authRoutes);

// 4. 정적 파일 서빙
const frontendPath = path.join(__dirname, '../2-jack-lee-community-fe/public');
const globalPath = path.join(__dirname, '../2-jack-lee-community-fe');
app.use(express.static(frontendPath));
app.use(express.static(globalPath));

app.use(
    '/profile-images',
    express.static(path.join(__dirname, 'data/profile-images')),
);
app.use(
    '/post-images',
    express.static(path.join(__dirname, 'data/post-images')),
);

// HTML 파일 처리(3000번 포트)
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/login.html'));
});

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
