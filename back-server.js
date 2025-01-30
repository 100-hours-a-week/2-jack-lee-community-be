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
import queryLogger from './middlewares/queryLogger.js';
import securityMiddleware from './middlewares/securityMiddleware.js';
import cookieParser from 'cookie-parser';

// ES 모듈에서 __dirname과 __filename 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// JSON 및 폴더 초기화
jsonInit();

// 글로벌 미들웨어
app.use(securityMiddleware); // ✅ 보안 미들웨어 (helmet 등)
app.use(cookieParser('qwer1234')); // ✅ 쿠키 파싱 미들웨어 (세션보다 앞에 있어야 함)
app.use(bodyParser.json()); // ✅ 요청 본문(JSON) 파싱
app.use(sessionMiddleware); // ✅ 세션 미들웨어 (쿠키 파싱 후 실행)
app.use(corsMiddleware); // ✅ CORS 미들웨어 (세션 설정 후 실행)
app.use(loggerMiddleware); // ✅ 요청 로깅
app.use(queryLogger); // ✅ 쿼리 로깅

app.use(
    '/profile-images',
    express.static(path.join(__dirname, 'data/profile-images')),
);
app.use(
    '/post-images',
    express.static(path.join(__dirname, 'data/post-images')),
);

// 라우터 설정
app.use('/api/users', userRoutes);
app.use('/api/auths', authRoutes);

app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likesRoutes);

// 서버 실행
app.listen(PORT, () => {
    console.log(`✅ 백엔드 서버 실행: http://localhost:${PORT}`);
});
