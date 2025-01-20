import express from 'express';
import authController from '../controllers/authContoller.js';

const router = express.Router();

// 로그인 라우트
router.post('/login', authController.login);

// 로그아웃 라우트
router.post('/logout', authController.logout);

// 프로필 라우트 (인증된 사용자만)
router.get(
    '/profile',
    authController.isAuthenticated,
    authController.getProfile,
);

// 세션 체크 라우터
// req.session은 현재 요청(Request)에 대한 세션 객체
router.get('/check-session', (req, res) => {
    if (req.session.user) {
        // 로그인 상태일 때
        res.json({
            message: '로그인 상태입니다.',
            user: req.session.user,
        });
    } else {
        // 비로그인 상태일 때
        res.status(401).json({
            message: '로그인 상태가 아닙니다.',
        });
    }
});

// 세션 ID 확인 라우터
// 로그인 상태가 아니더라도 기본적으로 session 객체에 접근하면 id가 생성됨
router.get('/check-session-id', (req, res) => {
    if (req.session.user) {
        res.json({
            message: '로그인 상태입니다.',
            sessionId: req.sessionID,
        });
    } else {
        res.status(401).json({
            message: '로그인 상태가 아닙니다.',
        });
    }
});

export default router;
