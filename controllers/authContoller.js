const userModel = require('../models/userModel');

// 회원가입은 userController에 있음, 리팩토링 때 변경 예정
// controllers/
// ├── authController.js   // 로그인, 로그아웃, 회원가입
// ├── userController.js   // 사용자 프로필 조회, 수정 등
const authController = {
    // async register(req, res) {
    //     try {
    //         const { email, password, nickname, profile_image } = req.body;
    //         const newUser = await userModel.createUser(
    //             email,
    //             password,
    //             nickname,
    //             profile_image,
    //         );

    //         res.status(201).json({
    //             message: '사용자 등록 성공',
    //             user: {
    //                 id: newUser.id,
    //                 email: newUser.email,
    //                 nickname: newUser.nickname,
    //                 profile_image: newUser.profile_image,
    //             },
    //         });
    //     } catch (error) {
    //         res.status(400).json({ message: error.message });
    //     }
    // },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userModel.validateUser(email, password);

            if (user) {
                req.session.user = {
                    userId: user.id,
                    email: user.email,
                    nickname: user.nickname,
                };

                res.cookie('session_id', req.sessionID, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60,
                }); // 1시간 쿠키

                res.json({
                    message: '로그인 성공(세션 저장)',
                    user,
                });
            } else {
                res.status(401).json({ message: '인증 실패' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: '로그아웃 실패' });
            }
            res.clearCookie('session_id');

            res.json({ message: '로그아웃 성공' });
        });
    },

    // 인증 미들웨어
    isAuthenticated(req, res, next) {
        const sessionID = req.sessionID;

        if (sessionID === undefined) {
            return res.status(401).json({ message: '인증되지 않았습니다.' });
        }

        next();
    },

    // 프로필 조회
    async getProfile(req, res) {
        try {
            // 세션에 사용자 정보가 있는지 확인
            if (!req.session || !req.session.user || !req.session.user.userId) {
                return res
                    .status(401)
                    .json({ message: '로그인이 필요합니다.' });
            }

            const userId = req.session.user.userId;

            const user = await userModel.getUserById(userId);

            if (!user) {
                return res
                    .status(404)
                    .json({ message: '사용자를 찾을 수 없습니다.' });
            }

            // 비밀번호 제거 후 사용자 정보 반환
            const { password, ...userProfile } = user;
            res.status(200).json(userProfile);
        } catch (error) {
            console.error('사용자 정보 조회 오류:', error);
            res.status(500).json({
                message: '서버 오류가 발생했습니다.',
                error: error.message,
            });
        }
    },
};

module.exports = authController;
