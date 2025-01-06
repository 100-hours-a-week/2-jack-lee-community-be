const session = require('express-session');
const cookieParser = require('cookie-parser');

// 세션 및 쿠키 미들웨어 설정
const sessionMiddleware = [
    cookieParser('qwer1234'), // 쿠키 파서 설정
    session({
        secret: 'qwer1234',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // HTTPS가 아닌 경우 false로 설정
            httpOnly: true, // 클라이언트에서 쿠키를 접근하지 못하도록 설정
            sameSite: 'lax', // 크로스-도메인 요청에서 쿠키 허용
            maxAge: 1000 * 60 * 60 * 24, // 1일후 쿠키 만료
        },
    }),
];

module.exports = sessionMiddleware;
