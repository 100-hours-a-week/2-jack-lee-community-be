import cors from 'cors';

const corsMiddleware = cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // OPTIONS 추가
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더 명시
    preflightContinue: false, // 자동 응답 처리
    optionsSuccessStatus: 204, // Preflight 요청 응답 코드
});

export default corsMiddleware;
