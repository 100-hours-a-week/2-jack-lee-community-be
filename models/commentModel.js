import { v4 as uuidv4 } from 'uuid';
import db from '../config/dbConfig.js';

const commentModel = {
    // 댓글 추가
    addComment: async (postId, newComment) => {
        const commentId = uuidv4();
        await db.execute(
            'INSERT INTO comments (comment_id, comment_content, created_at, post_id, author_id) VALUES (?, ?, ?, ?, ?)',
            [
                commentId,
                newComment.comment_content,
                newComment.created_at,
                postId,
                newComment.author_id,
            ],
        );
        return { comment_id: commentId, ...newComment };
    },

    // 특정 게시글의 댓글 조회
    getCommentsByPostId: async (postId) => {
        const query = `
            SELECT
                comments.comment_id,
                comments.comment_content,
                comments.created_at,
                comments.post_id,
                comments.author_id,
                users.username AS author_name,
                users.profile_image_url AS author_profile_image
            FROM
                comments
            LEFT JOIN
                users ON comments.author_id = users.user_id
            WHERE
                comments.post_id = ?
        `;

        const [rows] = await db.execute(query, [postId]);
        return rows.map((row) => ({
            comment_id: row.comment_id,
            comment_content: row.comment_content,
            created_at: row.created_at,
            post_id: row.post_id,
            author: {
                user_id: row.author_id,
                username: row.author_name,
                profile_image: row.author_profile_image,
            },
        }));
    },

    // 댓글 수정
    updateComment: async (commentId, updatedData) => {
        const { comment_content } = updatedData;
        await db.execute(
            'UPDATE comments SET comment_content = ? WHERE comment_id = ?',
            [comment_content, commentId],
        );
        const [rows] = await db.execute(
            'SELECT * FROM comments WHERE comment_id = ?',
            [commentId],
        );
        return rows[0] || null;
    },

    // 댓글 삭제
    deleteComment: async (commentId) => {
        const [result] = await db.execute(
            'DELETE FROM comments WHERE comment_id = ?',
            [commentId],
        );
        return result.affectedRows > 0;
    },

    // 댓글 수 조회
    getCommentsCount: async (postId) => {
        const [rows] = await db.execute(
            'SELECT COUNT(*) AS count FROM comments WHERE post_id = ?',
            [postId],
        );
        return rows[0]?.count || 0;
    },
};

export default commentModel;
