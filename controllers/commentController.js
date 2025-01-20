import commentModel from '../models/commentModel.js';
import { v4 as uuidv4 } from 'uuid';
import formatDateTime from '../utils/utils.js';

// 댓글 추가
const addComment = async (req, res) => {
    const { post_id } = req.params;
    const { comment_content } = req.body;
    const author_id = req.session.user.userId;

    if (!comment_content) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    if (!req.session?.user?.userId) {
        return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const newComment = {
        comment_id: uuidv4(),
        comment_content,
        author_id,
        created_at: formatDateTime(),
    };

    try {
        const comment = await commentModel.addComment(post_id, newComment);
        res.status(201).json({
            message: 'Comment added successfully',
            data: comment,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding comment',
            error: error.message,
        });
    }
};

// 특정 게시글의 댓글 조회
const getCommentsByPost = async (req, res) => {
    const { post_id } = req.params;

    try {
        const comments = await commentModel.getCommentsByPostId(post_id);
        res.status(200).json({
            message: 'Comments retrieved successfully',
            data: comments,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving comments',
            error: error.message,
        });
    }
};

// 댓글 수정
const updateComment = async (req, res) => {
    const { comment_id } = req.params;
    const { comment_content } = req.body;

    if (!comment_content) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        const updatedComment = await commentModel.updateComment(comment_id, {
            comment_content,
        });
        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({
            message: 'Comment updated successfully',
            data: updatedComment,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating comment',
            error: error.message,
        });
    }
};

// 댓글 삭제
const deleteComment = async (req, res) => {
    const { comment_id } = req.params;

    try {
        const isDeleted = await commentModel.deleteComment(comment_id);
        if (!isDeleted) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting comment',
            error: error.message,
        });
    }
};

// 댓글 수 조회
const getCommentsCount = async (req, res) => {
    const { post_id } = req.params;

    try {
        const commentsCount = await commentModel.getCommentsCount(post_id);
        if (commentsCount === null) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({
            message: 'Comments count retrieved successfully',
            data: commentsCount,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving comments count',
            error: error.message,
        });
    }
};

const commentController = {
    addComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
    getCommentsCount,
};

export default commentController;
