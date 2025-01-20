import express from 'express';
import userController from '../controllers/userController.js';
import { profileImageUpload } from '../utils/fileUpload.js';

const router = express.Router();

// 이메일 중복 체크
router.get('/check-email', userController.checkEmailDuplicate);

// 닉네임 중복 체크
router.get('/check-username', userController.checkUsernameDuplicate);

// 모든 사용자 정보 조회
router.get('', userController.getAllUsers);

// ID로 특정 사용자 정보 조회
router.get('/:id', userController.getUserById);

// Email로 특정 사용자 정보 조회
router.get('/e/:email', userController.getUserByEmail);

// 회원가입
router.post('/register', userController.addUser);

// 회원정보 수정
router.patch('/:id', userController.updateUser);

// 비밀번호 수정
router.patch('/update-password/:id', userController.changePassword);

// 회원탈퇴
router.delete('/:id', userController.deleteUser);

// 프로필 이미지 업로드
router.post(
    '/:user_id/profile-image',
    profileImageUpload.single('profile_image'),
    userController.uploadProfileImage,
);

export default router;
