const cors = require('cors');

const corsMiddleware = cors({
    origin: 'http://localhost:3000', // 허용할 도메인 설정
    credentials: true, // 쿠키 및 인증 정보 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

module.exports = corsMiddleware;
