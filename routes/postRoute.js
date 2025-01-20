import express from 'express';
import postController from '../controllers/postController.js';
import { postImageUpload } from '../utils/fileUpload.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

const router = express.Router();

// 게시글 목록 정보 조회
router.get('', postController.getPostList);

//게시글 작성
router.post('', isLoggedIn, postController.savePost);

// 게시글 상세 정보 조회
router.get('/:post_id', postController.getPostDetail);

// 게시글 수정
router.patch('/:post_id', isLoggedIn, postController.updatePost);

// 게시글 삭제
router.delete('/:post_id', isLoggedIn, postController.deletePost);

// 게시글 이미지 업로드
router.post(
    '/:post_id/post-image',
    isLoggedIn,
    postImageUpload.single('post_image'),
    postController.uploadPostImage,
);

// 조회 수 증가
router.post('/:post_id/views', postController.addViewsCount);

// 조회 수 조회
router.get('/:post_id/views', postController.getViewsCount);

export default router;
