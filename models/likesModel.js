import db from '../config/dbConfig.js';

const likesModel = {
    // 좋아요 추가 및 취소
    toggleLike: async (postId, userId, created_at) => {
        const [rows] = await db.execute(
            'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
            [postId, userId],
        );

        if (rows.length > 0) {
            // 좋아요 취소
            await db.execute(
                'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
                [postId, userId],
            );
            return false; // 좋아요 취소됨
        } else {
            // 좋아요 추가
            await db.execute(
                'INSERT INTO likes (post_id, user_id, created_at) VALUES (?, ?, ?)',
                [postId, userId, created_at],
            );
            return true; // 좋아요 추가됨
        }
    },

    // 특정 게시글의 좋아요 수 조회
    getLikes: async (postId) => {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM likes WHERE post_id = ?',
            [postId],
        );
        return rows[0]?.count || 0;
    },

    // 특정 사용자의 좋아요 상태 확인
    isLikedByUser: async (postId, userId) => {
        const [rows] = await db.execute(
            'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
            [postId, userId],
        );
        return rows.length > 0;
    },
};

export default likesModel;
