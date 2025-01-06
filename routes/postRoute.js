const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { postImageUpload } = require('../utils/fileUpload');
const isLoggedIn = require('../middlewares/isLoggedIn');

// 게시글 목록 정보 조회
router.get('', postController.getPostList);

// 게시글 작성
router.post('', isLoggedIn, postController.savePost);

// 게시글 상세 정보 조회
router.get('/:post_id', postController.getPostDetail);

// 게시글 수정
router.patch('/:post_id', isLoggedIn, postController.updatePost);

// 게시글 삭제
router.delete('/:post_id', isLoggedIn, postController.deletePost);

// 댓글 작성
router.post('/:post_id/comments', isLoggedIn, postController.addComment);

// 특정 게시물에서 댓글 조회
router.get('/:post_id/comments', postController.getComments);

// 댓글 수정
router.patch(
    '/:post_id/comments/:comment_id',
    isLoggedIn,
    postController.updateComment,
);

// 댓글 삭제
router.delete(
    '/:post_id/comments/:comment_id',
    isLoggedIn,
    postController.deleteComment,
);

// 게시글 이미지 업로드
router.post(
    '/:post_id/post-image',
    isLoggedIn,
    postImageUpload.single('post_image'),
    postController.uploadPostImage,
);

// 좋아요 수 증가, 감소
router.post('/:post_id/likes', isLoggedIn, postController.setLikesCount);

// 좋아요 수 조회
router.get('/:post_id/likes', postController.getLikesCount);

// 좋아요 상태 가져오기
router.get(
    '/:post_id/likes/like-status',
    isLoggedIn,
    postController.getLikeStatus,
);

// 조회 수 증가
router.post('/:post_id/views', postController.addViewsCount);

// 조회 수 조회
router.get('/:post_id/views', postController.getViewsCount);

// 댓글 수 증가
router.post('/:post_id/comments_add', postController.addCommentsCount);

// 댓글 수 감소
router.post(
    '/:post_id/comments_decrease',
    postController.decreaseCommentsCount,
);

// 댓글 수 조회
router.get('/:post_id/comments_count', postController.getCommentsCount);

module.exports = router;
