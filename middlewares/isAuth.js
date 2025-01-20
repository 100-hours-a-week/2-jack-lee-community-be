const isAuthenticated = (req, res, next) => {
    const publicPaths = ['/users/login', '/users/register']; // 인증 불필요 경로
    if (publicPaths.includes(req.path)) {
        return next(); // 인증 없이 통과
    }

    if (!req.session?.user) {
        // 인증되지 않은 경우 로그인 페이지로 리디렉션
        return res.redirect('/users/login');
    }

    next();
};

export default isAuthenticated;
