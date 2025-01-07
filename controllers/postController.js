import fs from 'fs';
import postModel from '../models/postModel.js';
import userModel from '../models/userModel.js';
import formatDateTime from '../utils/utils.js';

// 게시글 목록 가져오기
const getPostList = (req, res) => {
    const posts = postModel.getAllPosts();
    res.status(200).json({ status: 200, data: posts });
};

// 게시글 상세 정보 조회
const getPostDetail = (req, res) => {
    const { post_id } = req.params;
    const post = postModel.getPostById(post_id);

    if (!post) {
        return res.status(404).json({ status: 404, message: 'Post not found' });
    }

    res.json({ status: 200, data: post });
};

// 새로운 게시글 저장
const savePost = async (req, res) => {
    const { post_title, post_content } = req.body;

    if (!post_title || !post_content) {
        return res.status(400).json({ message: 'invalid_input' });
    }

    const userId = req.session.user.userId;
    const userData = await userModel.getUserById(userId);
    const { nickname, profile_image } = userData;

    const newPost = {
        post_title,
        post_content,
        post_image: null,
        post_image_name: null,
        author: {
            id: userId,
            name: nickname,
            profile_image,
        },
        created_at: formatDateTime(),
        likes: 0,
        likes_list: [],
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
const addComment = async (req, res) => {
    const { post_id } = req.params;
    const { comment_content } = req.body;

    if (!req.session.user) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    if (!comment_content) {
        return res.status(400).json({ message: '댓글 내용을 적어주세요' });
    }

    const user = await userModel.getUserById(req.session.user.userId);

    if (!user) {
        return res
            .status(404)
            .json({ message: '사용자 정보를 찾을 수 없습니다.' });
    }

    const newComment = {
        comment_content,
        comment_author: {
            user_id: user.id,
            nickname: user.nickname,
            profile_image: user.profile_image,
        },
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

// 게시글 이미지 업로드
const uploadPostImage = (req, res) => {
    const { post_id } = req.params;

    if (!req.file) {
        return res.status(400).json({ message: 'invalid_image_file_request' });
    }

    const imagePath = `http://localhost:3000/post-images/${req.file.filename}`;
    const imageFileName = req.body.post_image_name;

    const updatedPost = postModel.updatePostImage(
        post_id,
        imagePath,
        imageFileName,
    );

    if (!updatedPost) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: 'image_file_upload_failed' });
    }

    res.status(200).json({
        message: 'post_image_uploaded_successfully',
        data: updatedPost,
    });
};

// 좋아요 수 증가, 감소
const setLikesCount = (req, res) => {
    const { post_id } = req.params;

    const userId = req.session.user.userId;

    const updatedElement = postModel.setLikes(post_id, userId);

    res.status(200).json({
        message: 'likes_updated_successfully',
        data: updatedElement,
    });
};

// 좋아요 수 조회
const getLikesCount = (req, res) => {
    const { post_id } = req.params;

    const likes = postModel.getLikes(post_id);

    res.status(200).json({
        message: 'likes_retrieved_successfully',
        data: likes,
    });
};

// 좋아요 상태 조회
const getLikeStatus = (req, res) => {
    const { postId } = req.params;

    const userId = req.session.user.userId;

    const liked = postModel.likesStatus(postId, userId);

    res.json({ success: true, liked });
};

// 조회수 증가
const addViewsCount = (req, res) => {
    const { post_id } = req.params;

    const views = postModel.addViews(post_id);

    if (!views) {
        return res.status(404).json({ message: 'posts_not_found' });
    }

    res.status(200).json({
        message: 'views_updated_successfully',
        data: views,
    });
};

// 조회수 조회
const getViewsCount = (req, res) => {
    const { post_id } = req.params;

    const views = postModel.getViews(post_id);

    res.status(200).json({
        message: 'views_retrieved_successfully',
        data: views,
    });
};

// 댓글 수 증가
const addCommentsCount = (req, res) => {
    const { post_id } = req.params;

    const comments = postModel.addcomments(post_id);

    if (!comments) {
        return res.status(404).json({ message: 'posts_not_found' });
    }

    res.status(200).json({
        message: 'comments_updated_successfully',
        data: comments,
    });
};

// 댓글 수 감소
const decreaseCommentsCount = (req, res) => {
    const { post_id } = req.params;

    const comments = postModel.decreaseComments(post_id);

    if (!comments) {
        return res.status(404).json({ message: 'posts_not_found' });
    }

    res.status(200).json({
        message: 'comments_updated_successfully',
        data: comments,
    });
};

// 댓글 수 조회
const getCommentsCount = (req, res) => {
    const { post_id } = req.params;

    const comments = postModel.getComments(post_id);

    res.status(200).json({
        message: 'comments_retrieved_successfully',
        data: comments,
    });
};

const postController = {
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
    setLikesCount,
    getLikesCount,
    getLikeStatus,
    addViewsCount,
    getViewsCount,
    addCommentsCount,
    decreaseCommentsCount,
    getCommentsCount,
};

export default postController;
