const fs = require('fs');
const postModel = require('../models/postModel');
const formatDateTime = require('../utils/utils');

// 게시글 목록 가져오기
const getPostList = (req, res) => {
    // 이미 모델에서 예외처리를 해서 또 할 필요 없음
    const posts = postModel.getAllPosts();

    // 목록에 필요한 필드만 반환
    const postList = posts.map((post) => ({
        post_id: post.post_id,
        post_title: post.post_title,
        author: post.author, // author는 object 타입
        created_at: post.created_at,
        likes: post.likes,
        comments: post.comments,
        views: post.views,
    }));

    res.status(200).json({ status: 200, data: postList });
};

const getPostDetail = (req, res) => {
    const { post_id } = req.params;
    const post = postModel.getPostById(post_id);

    if (!post) {
        return res.status(404).json({ status: 404, message: 'Post not found' });
    }

    // 질문: res.status(200).json({ status: 200, data: post }); 를 쓰는 게 맞을까 status 속성을 따로 두는게 맞을까?
    res.json({ status: 200, data: post });
};
// 새로운 게시글 저장
const savePost = (req, res) => {
    const { post_title, post_content } = req.body;

    if (!post_title || !post_content) {
        return res.status(400).json({
            message: 'invaild_input',
        });
    }

    const newPost = {
        post_title,
        post_content,
        post_image: null,
        post_image_name: null,
        author: {
            id: null,
            name: null,
            profile_image: null,
        },
        created_at: formatDateTime(),
        likes: 0,
        comments: 0,
        views: 0,
    };

    const savedPost = postModel.addPost(newPost);

    res.status(201).json({
        message: 'post_created_successfully',
        data: savedPost,
    });
};

// 게시글 수정
const updatePost = (req, res) => {
    const { post_id } = req.params;
    const updatedData = req.body;

    const updatedPost = postModel.updatePost(post_id, updatedData);

    if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({
        message: 'Post updated successfully',
        data: updatedPost,
    });
};

// 게시글 삭제
const deletePost = (req, res) => {
    const { post_id } = req.params;

    const isDeleted = postModel.deletePost(post_id);

    if (!isDeleted) {
        return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
};

// 댓글 추가
const addComment = (req, res) => {
    const { post_id } = req.params;
    const { comment_content, comment_author } = req.body;

    if (!comment_content) {
        return res
            .status(400)
            .json({ message: 'comment content cannot be empty' });
    }

    const newComment = {
        comment_content,
        comment_author: comment_author || {},
    };

    const comment = postModel.addComment(post_id, newComment);

    if (!comment) {
        return res.status(404).json({ message: 'comment_not_found' });
    }

    res.status(201).json({
        message: 'comment_added_successfully',
        data: comment,
    });
};

// 특정 게시글의 댓글 조회
const getComments = (req, res) => {
    const { post_id } = req.params;

    const comments = postModel.getCommentsByPostId(post_id);

    res.status(200).json({
        message: 'comments_retrieved_successfully',
        data: comments,
    });
};

// 댓글 수정
const updateComment = (req, res) => {
    const { post_id, comment_id } = req.params;
    const { comment_content } = req.body;

    if (!comment_content) {
        return res
            .status(400)
            .json({ message: 'comment content cannot be empty' });
    }

    const updatedComment = postModel.updateComment(post_id, comment_id, {
        comment_content,
    });

    if (!updatedComment) {
        return res.status(404).json({ message: 'comment_not_found' });
    }

    res.status(200).json({
        message: 'comment_updated_successfully',
        data: updatedComment,
    });
};

// 댓글 삭제
const deleteComment = (req, res) => {
    const { post_id, comment_id } = req.params;

    const isDeleted = postModel.deleteComment(post_id, comment_id);

    if (!isDeleted) {
        return res.status(404).json({ message: 'comment_not_found' });
    }

    res.status(200).json({ message: 'comment_deleted_successfully' });
};

// 이미지 업로드 및 경로 업데이트
const uploadPostImage = (req, res) => {
    const { post_id } = req.params;

    console.log(req.body);

    if (!req.file) {
        return res.status(400).json({ message: 'invalid_image_file_request' });
    }

    // 게시글 이미지 저장 경로
    const imagePath = `/data/post-images/${req.file.filename}`;
    // 게시글 이미지 파일 이름
    const imageFileName = req.body.post_image_name;

    const updatedPost = postModel.updatePostImage(
        post_id,
        imagePath,
        imageFileName,
    );

    if (!updatedPost) {
        // 이미지 파일 삭제
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: 'image_file_upload_failed' });
    }

    res.status(200).json({
        message: 'post_image_uploaded_successfully',
        data: updatedPost,
    });
};

module.exports = {
    savePost,
    getPostList,
    getPostDetail,
    updatePost,
    deletePost,
    addComment,
    getComments,
    updateComment,
    deleteComment,
    uploadPostImage,
};
