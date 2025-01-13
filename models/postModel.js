import { v4 as uuidv4 } from 'uuid';
import db from '../config/dbConfig.js';

const postModel = {
    // 모든 게시글 조회
    getAllPosts: async () => {
        const [rows] = await db.execute('SELECT * FROM posts');
        return rows;
    },

    // 게시글 ID로 검색
    getPostById: async (postId) => {
        const [rows] = await db.execute(
            'SELECT * FROM posts WHERE post_id = ?',
            [postId],
        );
        return rows[0] || null;
    },

    // 새 게시글 추가
    addPost: async (newPost) => {
        const postId = uuidv4();
        await db.execute(
            'INSERT INTO posts (post_id, post_title, post_content, post_image_url, post_image_name, author_id, created_at, post_views) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
            [
                postId,
                newPost.post_title,
                newPost.post_content,
                newPost.post_image_url || null,
                newPost.post_image_name || null,
                newPost.author_id,
                newPost.created_at,
            ],
        );
        return { post_id: postId, ...newPost };
    },

    // 게시글 수정
    updatePost: async (postId, updatedData) => {
        const { post_title, post_content } = updatedData;
        await db.execute(
            'UPDATE posts SET post_title = ?, post_content = ? WHERE post_id = ?',
            [post_title || null, post_content || null, postId],
        );
        return await postModel.getPostById(postId);
    },

    // 게시글 삭제
    deletePost: async (postId) => {
        const [result] = await db.execute(
            'DELETE FROM posts WHERE post_id = ?',
            [postId],
        );
        return result.affectedRows > 0;
    },

    // 게시글 이미지 업데이트
    updatePostImage: async (postId, imagePath, imageFileName) => {
        await db.execute(
            'UPDATE posts SET post_image_url = ?, post_image_name = ? WHERE post_id = ?',
            [imagePath, imageFileName, postId],
        );
        const [rows] = await db.execute(
            'SELECT * FROM posts WHERE post_id = ?',
            [postId],
        );
        return rows[0] || null;
    },

    // 게시글 조회수 증가
    addViews: async (postId) => {
        const [updateResult] = await db.execute(
            'UPDATE posts SET post_views = post_views + 1 WHERE post_id = ?',
            [postId],
        );
        if (updateResult.affectedRows === 0) return null; // 게시글이 없을 경우 null 반환

        const [rows] = await db.execute(
            'SELECT post_views FROM posts WHERE post_id = ?',
            [postId],
        );
        return rows[0]?.post_views || null;
    },

    // 게시글 조회수 가져오기
    getViews: async (postId) => {
        const [rows] = await db.execute(
            'SELECT post_views FROM posts WHERE post_id = ?',
            [postId],
        );
        return rows[0]?.post_views || null;
    },
};

export default postModel;
