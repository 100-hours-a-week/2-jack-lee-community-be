function isLoggedIn(req, res, next) {
    // 쿠키에서 session_id 확인
    const sessionId = req.cookies.session_id;

    if (!sessionId) {
        // 세션 ID가 없으면 로그인이 안 된 상태로 판단
        return res
            .status(401)
            .json({ success: false, message: '로그인이 필요합니다.' });
    }

    // 다음 미들웨어 또는 라우터로 전달
    next();
}

module.exports = isLoggedIn;
