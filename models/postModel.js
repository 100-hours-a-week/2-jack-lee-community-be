import { v4 as uuidv4 } from 'uuid';
import db from '../config/dbConfig.js';

const postModel = {
    // 모든 게시글 조회
    getAllPosts: async () => {
        const query = `
        SELECT
            posts.post_id,
            posts.post_title,
            posts.post_content,
            posts.post_image_url,
            posts.post_image_name,
            posts.created_at,
            posts.post_views,
            users.user_id AS author_id,
            users.username AS author_name,
            users.profile_image_url AS author_profile_image,
            COUNT(DISTINCT likes.user_id) AS post_likes,
            COUNT(DISTINCT comments.comment_id) AS post_comments
        FROM
            posts
        LEFT JOIN
            users ON posts.author_id = users.user_id
        LEFT JOIN
            likes ON posts.post_id = likes.post_id
        LEFT JOIN
            comments ON posts.post_id = comments.post_id
        GROUP BY
            posts.post_id, 
            users.user_id, 
            users.username, 
            users.profile_image_url
    `;

        const [rows] = await db.execute(query);

        // 데이터 맵핑 처리
        return rows.map((row) => ({
            post_id: row.post_id,
            post_title: row.post_title,
            post_content: row.post_content,
            post_image_url: row.post_image_url,
            post_image_name: row.post_image_name,
            created_at: row.created_at,
            post_views: row.post_views,
            post_likes: row.post_likes, // 좋아요 수 추가
            post_comments: row.post_comments, // 댓글 수 추가
            author: {
                user_id: row.author_id,
                username: row.author_name,
                profile_image: row.author_profile_image,
            },
        }));
    },
    // 특정 커서 이후의 게시글 가져오기
    getPostsAfterCursor: async (cursor, limit) => {
        console.log('Cursor:', cursor, 'Limit:', limit);

        const safeCursor = cursor ?? null;
        const safeLimit = parseInt(limit, 10); // 숫자로 변환하여 안정성 확보

        let query = `
            SELECT
                posts.post_id,
                posts.post_title,
                posts.post_content,
                posts.post_image_url,
                posts.post_image_name,
                posts.created_at,
                posts.post_views,
                users.user_id AS author_id,
                users.username AS author_name,
                users.profile_image_url AS author_profile_image,
                COUNT(DISTINCT likes.user_id) AS post_likes,
                COUNT(DISTINCT comments.comment_id) AS post_comments
            FROM
                posts
            LEFT JOIN
                users ON posts.author_id = users.user_id
            LEFT JOIN
                likes ON posts.post_id = likes.post_id
            LEFT JOIN
                comments ON posts.post_id = comments.post_id
        `;

        const params = [];

        if (safeCursor) {
            query += ` WHERE posts.post_id < ? `;
            params.push(cursor);
        }

        query += `
            GROUP BY
                posts.post_id, 
                users.user_id, 
                users.username, 
                users.profile_image_url
            ORDER BY
                posts.post_id DESC
            LIMIT ${safeLimit};
        `;

        console.log('Executing Query:', query, 'With Params:', params);

        const [rows] = await db.execute(query, params);

        // 다음 커서 계산
        const nextCursor =
            rows.length > 0 ? rows[rows.length - 1].post_id : null;

        // 데이터 매핑
        const posts = rows.map((row) => ({
            post_id: row.post_id,
            post_title: row.post_title,
            post_content: row.post_content,
            post_image_url: row.post_image_url,
            post_image_name: row.post_image_name,
            created_at: row.created_at,
            post_views: row.post_views,
            post_likes: row.post_likes,
            post_comments: row.post_comments,
            author: {
                user_id: row.author_id,
                username: row.author_name,
                profile_image: row.author_profile_image,
            },
        }));

        return { posts, nextCursor };
    },

    // 게시글 ID로 검색
    getPostById: async (postId) => {
        const query = `
            SELECT
                posts.post_id,
                posts.post_title,
                posts.post_content,
                posts.post_image_url,
                posts.post_image_name,
                posts.created_at,
                posts.post_views,
                users.user_id AS author_id,
                users.username AS author_name,
                users.profile_image_url AS author_profile_image,
                COUNT(DISTINCT likes.user_id) AS post_likes
            FROM
                posts
            LEFT JOIN
                users ON posts.author_id = users.user_id
            LEFT JOIN
                likes ON posts.post_id = likes.post_id
            WHERE
                posts.post_id = ?
            GROUP BY
                posts.post_id, 
                users.user_id, 
                users.username, 
                users.profile_image_url
        `;

        const [rows] = await db.execute(query, [postId]);
        if (rows.length === 0) {
            return null; // 해당 post_id에 해당하는 게시글이 없을 경우 null 반환
        }
        const row = rows[0];
        return {
            post_id: row.post_id,
            post_title: row.post_title,
            post_content: row.post_content,
            post_image_url: row.post_image_url,
            post_image_name: row.post_image_name,
            created_at: row.created_at,
            post_views: row.post_views,
            post_likes: row.post_likes, // 좋아요 수 추가
            author: {
                user_id: row.author_id,
                username: row.author_name,
                profile_image: row.author_profile_image,
            },
        };
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
