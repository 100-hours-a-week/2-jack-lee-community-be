import express from 'express';
import likesController from '../controllers/likesController.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

const router = express.Router();

// 좋아요 눌렀으면 감소, 안 눌렀으면 증가
router.post('/:post_id', isLoggedIn, likesController.toggleLike);

// 좋아요 수 조회
router.get('/:post_id', likesController.getLikesCount);

// 특정 사용자의 좋아요 상태 확인
router.get('/:post_id/:user_id', isLoggedIn, likesController.getLikeStatus);

export default router;
