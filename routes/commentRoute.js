import express from 'express';
import commentController from '../controllers/commentController.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

const router = express.Router();

// 댓글 작성
router.post('/:post_id', isLoggedIn, commentController.addComment);

// 특정 게시물에서 댓글 조회
router.get('/:post_id', commentController.getCommentsByPost);

// 댓글 수정
router.patch(
    '/:post_id/:comment_id',
    isLoggedIn,
    commentController.updateComment,
);

// 댓글 삭제
router.delete(
    '/:post_id/:comment_id',
    isLoggedIn,
    commentController.deleteComment,
);

// 댓글 수 조회
router.get('/:post_id/comments_count', commentController.getCommentsCount);

export default router;
