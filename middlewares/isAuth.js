const isAuthenticated = (req, res, next) => {
    console.log('req.session ', req.session);
    // if (!req.sessionID) {
    //     return res.status(401).json({ error: 'Unauthorized' }); // ✅ API 요청일 경우 401 반환
    // }
    next();
};

export default isAuthenticated;
