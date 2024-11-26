const fs = require('fs');
const userModel = require('../models/userModel');

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
        const id = parseInt(req.params.id, 10); // 요청의 ID 파라미터
        if (isNaN(id)) {
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
        const { email } = req.query; // 쿼리에서 이메일 가져오기
        if (!email) {
            return res
                .status(400)
                .json({ message: 'Email query parameter is required' });
        }

        const user = await userModel.getUserByEmail(email);
        if (user) {
            res.status(200).json(user); // 사용자 정보 반환
        } else {
            res.status(404).json({
                message: `User with email ${email} not found`,
            }); // 사용자 없음
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
        const { email, password, re_password, nickname, profile_image } =
            req.body;
        // 입력 데이터 검증
        if (!email || !password || !nickname || password !== re_password) {
            return res.status(400).json({ message: 'invaild_input' });
        }

        // 유저 생성
        const newUser = await userModel.addUser({
            email,
            password,
            nickname,
            profile_image,
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
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const { nickname, profile_image } = req.body;

        const updatedUser = await userModel.updateUser(id, {
            nickname,
            profile_image,
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
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const isDeleted = await userModel.deleteUser(id);
        if (isDeleted) {
            res.status(200).json({
                message: `User with ID ${id} deleted successfully`,
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
        const id = parseInt(req.params.id, 10);
        const { password, re_password } = req.body;

        // 요청 데이터 검증
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        if (!password || !re_password) {
            return res
                .status(400)
                .json({ message: 'Password and re_password are required' });
        }

        if (password !== re_password) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // 비밀번호 변경
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
        const email = req.query.email;

        if (!email) {
            return res
                .status(400)
                .json({ available: false, message: 'Email is required' });
        }

        const isDuplicate = await userModel.isEmailDuplicate(email);

        if (isDuplicate) {
            res.status(200).json({
                available: false,
                message: 'Email already exists',
            });
        } else {
            res.status(200).json({
                available: true,
                message: 'Email is available',
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error checking email',
            error: error.message,
        });
    }
};

//닉네임 중복 체크
const checkNicknameDuplicate = async (req, res) => {
    try {
        const nickname = req.query.nickname;

        if (!nickname) {
            return res
                .status(400)
                .json({ available: false, message: 'Nickname is required' });
        }

        const isDuplicate = await userModel.isNicknameDuplicate(nickname);

        if (isDuplicate) {
            res.status(200).json({
                available: false,
                message: 'Nickname already exists',
            });
        } else {
            res.status(200).json({
                available: true,
                message: 'Nickname is available',
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error checking Nickname',
            error: error.message,
        });
    }
};

// 이미지 업로드 및 경로 업데이트
const uploadProfileImage = async (req, res) => {
    const { user_id } = req.params;

    if (!req.file) {
        return res.status(400).json({ message: 'invalid_image_file_request' });
    }

    const imagePath = `/data/profile-images/${req.file.filename}`;

    const updatedProfile = await userModel.updateProfileImage(
        user_id,
        imagePath,
    );
    console.log(updatedProfile);
    if (!updatedProfile) {
        // 이미지 파일 삭제
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: 'image_file_upload_failed' });
    }

    res.status(200).json({
        message: 'profile_image_uploaded_successfully',
        data: updatedProfile,
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
    changePassword,
    checkEmailDuplicate,
    checkNicknameDuplicate,
    uploadProfileImage,
};
