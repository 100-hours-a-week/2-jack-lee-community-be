import likesModel from '../models/likesModel.js';
import formatDateTime from '../utils/utils.js';

// 좋아요 토글
const toggleLike = async (req, res) => {
    const { post_id } = req.params;
    const { user_id } = req.body;
    const created_at = formatDateTime();

    if (!user_id) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        const isLiked = await likesModel.toggleLike(
            post_id,
            user_id,
            created_at,
        );
        res.status(200).json({
            message: isLiked
                ? 'Like added successfully'
                : 'Like removed successfully',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error toggling like',
            error: error.message,
        });
    }
};

// 특정 게시글의 좋아요 수 조회
const getLikesCount = async (req, res) => {
    const { post_id } = req.params;

    try {
        const likesCount = await likesModel.getLikes(post_id);
        res.status(200).json({
            message: 'Likes count retrieved successfully',
            data: likesCount,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving likes count',
            error: error.message,
        });
    }
};

// 특정 사용자의 좋아요 상태 확인
const getLikeStatus = async (req, res) => {
    const { post_id, user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        const isLiked = await likesModel.isLikedByUser(post_id, user_id);
        res.status(200).json({
            message: 'Like status retrieved successfully',
            data: isLiked,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving like status',
            error: error.message,
        });
    }
};

const likesController = {
    toggleLike,
    getLikesCount,
    getLikeStatus,
};

export default likesController;
