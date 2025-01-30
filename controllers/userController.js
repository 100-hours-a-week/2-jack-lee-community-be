import fs from 'fs';
import userModel from '../models/userModel.js';

// 모든 사용자 가져오기
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users); // 성공적으로 사용자 반환
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving users',
            error: error.message,
        });
    }
};

// ID로 사용자 가져오기
const getUserById = async (req, res) => {
    try {
        const { id } = req.params; // 요청의 ID 파라미터

        if (!id) {
            return res.status(400).json({ message: 'Invalid user ID' }); // 잘못된 요청
        }

        const user = await userModel.getUserById(id);
        if (user) {
            res.status(200).json(user); // 사용자 정보 반환
        } else {
            res.status(404).json({ message: `User with ID ${id} not found` }); // 사용자 없음
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving user',
            error: error.message,
        });
    }
};

// 이메일로 사용자 가져오기
const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await userModel.getUserByEmail(email);
        if (user) {
            res.status(200).json(user); // 사용자 정보 반환
        } else {
            res.status(404).json({
                message: `User with email ${email} not found`,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving user by email',
            error: error.message,
        });
    }
};

// 새 사용자 추가
const addUser = async (req, res) => {
    try {
        const { email, password, re_password, username, profile_image_url } =
            req.body;

        if (!email || !password || !username || password !== re_password) {
            return res.status(400).json({ message: 'invalid_input' });
        }

        const newUser = await userModel.addUser({
            email,
            password,
            username,
            profile_image_url,
        });

        res.status(201).json({
            message: 'user_created_successfully',
            data: newUser,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding user',
            error: error.message,
        });
    }
};

// 사용자 업데이트
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const { username, profile_image_url } = req.body;

        const updatedUser = await userModel.updateUser(id, {
            username,
            profile_image_url,
        });

        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: `User with ID ${id} not found` });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user',
            error: error.message,
        });
    }
};

// 사용자 삭제
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const isDeleted = await userModel.deleteUser(id);

        if (isDeleted) {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ message: '세션 삭제 실패' });
                }

                // 현재 요청에서 세션을 다시 생성하지 않도록 함
                req.session = null;

                res.clearCookie('connect.sid', {
                    httpOnly: true,
                    sameSite: 'None',
                    path: '/', // 쿠키를 설정할 때 사용한 path 유지
                });

                res.clearCookie('session_id', {
                    httpOnly: true,
                    sameSite: 'None',
                    path: '/',
                });

                // ✅ Set-Cookie 헤더를 사용하여 강제 만료
                res.setHeader('Set-Cookie', [
                    'connect.sid=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure',
                    'session_id=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure',
                ]);

                res.status(200).json({
                    message: `User with ID ${id} deleted successfully`,
                });
            });
        } else {
            res.status(404).json({ message: `User with ID ${id} not found` });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message,
        });
    }
};

// 비밀번호 변경
const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, re_password } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        if (!password || !re_password || password !== re_password) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const isPasswordChanged = await userModel.changePassword(id, password);

        if (isPasswordChanged) {
            res.status(200).json({ message: 'Password changed successfully' });
        } else {
            res.status(404).json({ message: `User with ID ${id} not found` });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error changing password',
            error: error.message,
        });
    }
};

// 이메일 중복 체크
const checkEmailDuplicate = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res
                .status(400)
                .json({ available: false, message: 'Email is required' });
        }

        const isDuplicate = await userModel.isEmailDuplicate(email);

        res.status(200).json({
            available: !isDuplicate,
            message: isDuplicate
                ? 'Email already exists'
                : 'Email is available',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error checking email',
            error: error.message,
        });
    }
};

// 닉네임 중복 체크
const checkUsernameDuplicate = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res
                .status(400)
                .json({ available: false, message: 'username is required' });
        }

        const isDuplicate = await userModel.isUsernameDuplicate(username);

        res.status(200).json({
            available: !isDuplicate,
            message: isDuplicate
                ? 'username already exists'
                : 'username is available',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error checking username',
            error: error.message,
        });
    }
};

// 프로필 이미지 업로드
const uploadProfileImage = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!req.file) {
            return res
                .status(400)
                .json({ message: 'invalid_image_file_request' });
        }

        const imagePath = `http://localhost:3000/profile-images/${req.file.filename}`;

        const updatedProfile = await userModel.updateProfileImage(
            user_id,
            imagePath,
        );

        if (!updatedProfile) {
            fs.unlinkSync(req.file.path); // 업로드된 이미지 삭제
            return res
                .status(404)
                .json({ message: 'image_file_upload_failed' });
        }

        res.status(200).json({
            message: 'profile_image_url_uploaded_successfully',
            data: updatedProfile,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error uploading profile image',
            error: error.message,
        });
    }
};

// 모든 메서드 객체로 export
const userController = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
    changePassword,
    checkEmailDuplicate,
    checkUsernameDuplicate,
    uploadProfileImage,
};

export default userController;
