import helmet from 'helmet';

const securityMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'], // 외부 JS 허용
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://fonts.googleapis.com',
            ], // 외부 CSS 허용
            imgSrc: [
                "'self'",
                'data:',
                'https://example.com',
                'https://www.gravatar.com',
            ], // 외부 이미지 허용
            connectSrc: ["'self'", 'https://api.example.com'], // API 요청 허용
            frameSrc: ["'self'", 'https://trusted-site.com'], // 특정 iframe 허용
        },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'sameorigin' }, // 클릭재킹 방지
    xssFilter: true, // XSS 공격 방지
    noSniff: true, // MIME 스니핑 방지
    // https 설정 생략
});

export default securityMiddleware;
