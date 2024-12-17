const express = require('express');
const router = express.Router();
const authController = require('../controllers/authContoller');

// 회원가입 라우트
// router.post('/register', authController.register);

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
// req.session 은 현재 요청(Request)에 대한 세션 객체
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
// 로그인 상태가 아니더라도 기본적으로 session 객체에 접근하면 id가 생성됨.
router.get('/check-session-id', (req, res) => {
    console.log(req.session);
    if (req.session.user) {
        // 현재 세션 객체 출력

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

// sessionStore는 세션 데이터 저장, 조회, 삭제를 담당
// all(callback): 저장된 모든 세션 데이터를 조회합니다.
// get(sessionID, callback): 특정 세션 ID의 세션 데이터를 가져옵니다.
// destroy(sessionID, callback): 특정 세션을 삭제합니다.
// set(sessionID, session, callback): 새로운 세션을 저장하거나 업데이트합니다.
// router.get('/get-session', (req, res) => {

// })

module.exports = router;
