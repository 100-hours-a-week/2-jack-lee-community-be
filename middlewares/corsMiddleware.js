import cors from 'cors';

const corsMiddleware = cors({
    origin: 'http://localhost:3000', // 허용할 도메인 설정
    credentials: true, // 쿠키 및 인증 정보 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
});

export default corsMiddleware;
