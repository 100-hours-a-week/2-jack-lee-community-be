import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// 라우터
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoute.js';
import authRoutes from './routes/authRoute.js';
import commentRoutes from './routes/commentRoute.js';
import likesRoutes from './routes/likesRoute.js';

// 미들웨어
import sessionMiddleware from './middlewares/sessionMiddleware.js';
import corsMiddleware from './middlewares/corsMiddleware.js';
import loggerMiddleware from './middlewares/loggerMiddleware.js';
import jsonInit from './middlewares/jsonInit.js';
import isAuthenticated from './middlewares/isAuth.js';

// ES 모듈에서 __dirname과 __filename 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// 1. JSON 및 폴더 초기화
jsonInit();

// 2. 글로벌 미들웨어
app.use(bodyParser.json());
app.use(corsMiddleware);
app.use(loggerMiddleware);
app.use(sessionMiddleware); // 세션 미들웨어는 모든 경로에 적용

// 3. 정적 파일 서빙
const frontendPath = path.join(__dirname, '../2-jack-lee-community-fe/public');
const globalPath = path.join(__dirname, '../2-jack-lee-community-fe');
app.use(
    express.static(frontendPath, {
        setHeaders: (res, path) => {
            if (path.endsWith('.js')) {
                res.setHeader('Content-Type', 'text/javascript'); // 올바른 MIME 타입 설정
            }
        },
    }),
);
app.use(express.static(globalPath));

// 정적 이미지 경로
app.use(
    '/profile-images',
    express.static(path.join(__dirname, 'data/profile-images')),
);
app.use(
    '/post-images',
    express.static(path.join(__dirname, 'data/post-images')),
);

// 4. 라우터 설정

// 인증 불필요
app.use('/api/users', userRoutes);
app.use('/api/auths', authRoutes);

// 인증 필요한 API에만 미들웨어 적용
app.use('/api/posts', isAuthenticated, postRoutes);
app.use('/api/comments', isAuthenticated, commentRoutes);
app.use('/api/likes', isAuthenticated, likesRoutes);

// HTML 파일 처리 (비인증 경로)
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/login.html'));
});

app.get('/users/register', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/signup.html'));
});

app.get('/users/login', (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/login.html'));
});

// HTML 파일 처리 (인증 필요)
app.get('/users/:id/edit', isAuthenticated, (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/user-modify.html'));
});

app.get('/users/:id/edit-pw', isAuthenticated, (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/user-pw-modify.html'));
});

app.get('/posts', isAuthenticated, (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/post-list.html'));
});

app.get('/posts/add', isAuthenticated, (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/post-add.html'));
});

app.get('/posts/:post_id', isAuthenticated, (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/post-detail.html'));
});

app.get('/posts/:post_id/edit', isAuthenticated, (req, res) => {
    res.sendFile(path.join(frontendPath, 'html/post-modify.html'));
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT} 에서 서버 실행 중~~~`);
});
