const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { profileImageUpload } = require('../utils/fileUpload');

// 이메일 중복 체크
router.get('/check-email', userController.checkEmailDuplicate);

// 닉네임 중복 체크
router.get('/check-nickname', userController.checkNicknameDuplicate);

// 모든 사용자 정보 조회
router.get('', userController.getAllUsers);

// id로 특정 사용자 정보 조회
router.get('/:id', userController.getUserById);

// 회원가입
router.post('/register', userController.addUser);

// 회원정보 수정
router.patch('/:id', userController.updateUser);

// 비밀번호 수정
router.patch('/update-password/:id', userController.changePassword);

// 회원탈퇴
router.delete('/:id', userController.deleteUser);

// 로그인
// router.post('/login', userController.login);

// 프로필 이미지 업로드
router.post(
    '/:user_id/profile-image',
    profileImageUpload.single('profile_image'),
    userController.uploadProfileImage,
);

module.exports = router;
