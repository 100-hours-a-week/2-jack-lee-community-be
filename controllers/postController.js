import postModel from '../models/postModel.js';
import fs from 'fs';
import formatDateTime from '../utils/utils.js';

// 게시글 목록 가져오기
const getPostList = async (req, res) => {
    try {
        const posts = await postModel.getAllPosts();
        res.status(200).json({ status: 200, data: posts });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error retrieving posts',
            error: error.message,
        });
    }
};

// 게시글 상세 정보 조회
const getPostDetail = async (req, res) => {
    const { post_id } = req.params;
    try {
        const post = await postModel.getPostById(post_id);
        if (!post) {
            return res
                .status(404)
                .json({ status: 404, message: 'Post not found' });
        }
        res.status(200).json({ status: 200, data: post });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error retrieving post',
            error: error.message,
        });
    }
};

// 새로운 게시글 저장
const savePost = async (req, res) => {
    const { post_title, post_content } = req.body;

    if (!req.session?.user?.userId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const author_id = req.session.user.userId;

    if (!post_title || !post_content) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const newPost = {
        post_title,
        post_content,
        author_id,
        created_at: formatDateTime(),
        post_image_url: null,
        post_image_name: null,
    };

    try {
        const savedPost = await postModel.addPost(newPost);
        res.status(201).json({
            message: 'Post created successfully',
            data: savedPost,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error saving post',
            error: error.message,
        });
    }
};

// 게시글 이미지 업로드
const uploadPostImage = async (req, res) => {
    const { post_id } = req.params;

    if (!req.file) {
        return res.status(400).json({ message: 'Invalid image file' });
    }

    const imagePath = `http://localhost:3000/post-images/${req.file.filename}`;
    const imageFileName = req.file.filename;

    try {
        const updatedPost = await postModel.updatePostImage(
            post_id,
            imagePath,
            imageFileName,
        );
        if (!updatedPost) {
            fs.unlinkSync(req.file.path); // 업로드된 파일 삭제
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({
            message: 'Post image uploaded successfully',
            data: updatedPost,
        });
    } catch (error) {
        fs.unlinkSync(req.file.path); // 에러 발생 시 파일 삭제
        res.status(500).json({
            message: 'Error uploading post image',
            error: error.message,
        });
    }
};

// 게시글 수정
const updatePost = async (req, res) => {
    const { post_id } = req.params;
    const { post_title, post_content } = req.body;
    console.log(post_title, post_content);

    if (!post_title || !post_content) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        const updatedPost = await postModel.updatePost(post_id, {
            post_title,
            post_content,
        });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({
            message: 'Post updated successfully',
            data: updatedPost,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating post',
            error: error.message,
        });
    }
};

// 게시글 삭제
const deletePost = async (req, res) => {
    const { post_id } = req.params;

    try {
        const isDeleted = await postModel.deletePost(post_id);
        if (!isDeleted) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting post',
            error: error.message,
        });
    }
};

// 게시글 조회수 증가
const addViewsCount = async (req, res) => {
    const { post_id } = req.params;

    try {
        const updatedViews = await postModel.addViews(post_id);
        if (!updatedViews) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({
            message: 'Views updated successfully',
            data: updatedViews,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating views',
            error: error.message,
        });
    }
};

// 게시글 조회수 가져오기
const getViewsCount = async (req, res) => {
    const { post_id } = req.params;

    try {
        const views = await postModel.getViews(post_id);
        if (views === null) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({
            message: 'Views retrieved successfully',
            data: views,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving views',
            error: error.message,
        });
    }
};

const postController = {
    getPostList,
    getPostDetail,
    savePost,
    uploadPostImage,
    updatePost,
    deletePost,
    addViewsCount,
    getViewsCount,
};

export default postController;
