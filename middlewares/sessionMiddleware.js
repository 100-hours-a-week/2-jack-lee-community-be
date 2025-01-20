import session from 'express-session';
import cookieParser from 'cookie-parser';

// 세션 및 쿠키 미들웨어 설정
const sessionMiddleware = [
    cookieParser('qwer1234'), // 쿠키 파서 설정
    session({
        secret: 'qwer1234', // 세션 암호화 키
        resave: false, // 세션을 항상 저장하지 않음
        saveUninitialized: false, // 초기화되지 않은 세션을 저장하지 않음
        cookie: {
            secure: false, // HTTPS가 아닌 경우 false로 설정
            httpOnly: true, // 클라이언트에서 쿠키를 접근하지 못하도록 설정
            sameSite: 'lax', // 크로스-도메인 요청에서 쿠키 허용
            maxAge: 1000 * 60 * 60 * 24, // 쿠키 만료 시간: 1일
        },
    }),
];

export default sessionMiddleware;
