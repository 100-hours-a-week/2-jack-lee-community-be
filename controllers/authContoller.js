import userModel from '../models/userModel.js';

const authController = {
    // 로그인 처리
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await userModel.validateUser(email, password);

            if (!user) {
                return res.status(401).json({
                    message:
                        '인증 실패: 이메일 또는 비밀번호가 일치하지 않습니다.',
                });
            }

            if (user) {
                // 세션에 사용자 정보 저장
                req.session.user = {
                    userId: user.user_id,
                    email: user.email,
                    username: user.username,
                    profileImage: user.profile_image_url,
                };

                // 쿠키 설정 (1시간 유효)
                res.cookie('session_id', req.sessionID, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60,
                });

                // 로그인 성공 응답
                res.json({
                    message: '로그인 성공(세션 저장)',
                    user,
                    data: {
                        sessionID: req.sessionID,
                    },
                });
            } else {
                // 인증 실패 응답
                res.status(401).json({ message: '인증 실패' });
            }
        } catch (error) {
            // 서버 오류 처리
            res.status(500).json({ message: error.message });
        }
    },

    // 로그아웃 처리
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                // 세션 삭제 실패 처리
                return res.status(500).json({ message: '로그아웃 실패' });
            }
            // 쿠키 삭제 후 로그아웃 성공 응답
            res.clearCookie('session_id');
            res.json({
                message: '로그아웃 성공',
                data: null,
            });
        });
    },

    // 인증 여부 확인 미들웨어
    isAuthenticated: (req, res, next) => {
        if (!req.session.user) {
            // 인증되지 않은 경우
            return res
                .status(401)
                .json({ status: 401, message: '인증되지 않았습니다.' });
        }

        // 인증된 경우 다음 미들웨어로 이동
        next();
    },

    // 사용자 프로필 조회
    getProfile: async (req, res) => {
        try {
            // 세션에 사용자 정보가 있는지 확인
            if (!req.session?.user) {
                return res
                    .status(401)
                    .json({ message: '로그인이 필요합니다.' });
            }

            const userId = req.session.user.userId;
            const user = await userModel.getUserById(userId);

            if (!user) {
                // 사용자를 찾을 수 없는 경우
                return res
                    .status(404)
                    .json({ message: '사용자를 찾을 수 없습니다.' });
            }

            // 비밀번호 제외한 사용자 정보 반환
            const { password, ...userProfile } = user;
            res.status(200).json(userProfile);
        } catch (error) {
            // 서버 오류 처리
            console.error('사용자 정보 조회 오류:', error);
            res.status(500).json({
                message: '서버 오류가 발생했습니다.',
                error: error.message,
            });
        }
    },
};

export default authController;
