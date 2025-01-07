import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import formatDateTime from '../utils/utils.js';
import { fileURLToPath } from 'url';

// ES 모듈에서 __dirname과 __filename 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON 파일 경로 설정 - 게시글 관련 json 파일은 data/posts.json에 저장
const postsFilePath = path.join(__dirname, '../data/posts.json');
// 좋아요 누른 user 저장 Set
const likesSet = new Set();

const postModel = {
    // 파일에서 데이터 읽기
    getAllPosts() {
        try {
            const data = fs.readFileSync(postsFilePath, 'utf8');
            return JSON.parse(data).data || [];
        } catch (error) {
            console.error('Error reading posts file:', error);
            return [];
        }
    },

    // 게시글 ID로 검색
    getPostById(postId) {
        const posts = this.getAllPosts();
        return posts.find((post) => post.post_id === postId) || null;
    },

    // 파일에 데이터 저장
    saveAllPosts(posts) {
        try {
            const updatedData = { data: posts };
            fs.writeFileSync(
                postsFilePath,
                JSON.stringify(updatedData, null, 2),
                'utf8',
            );
        } catch (error) {
            console.error('Error writing posts file:', error);
        }
    },

    // 새 게시글 추가
    addPost(newPost) {
        let posts = this.getAllPosts();

        if (!posts) {
            posts = [];
        }

        // uuid를 포함한 post 데이터 생성
        const postWithId = { post_id: uuidv4(), ...newPost };

        posts.push(postWithId);
        this.saveAllPosts(posts);
        return postWithId;
    },

    // 게시글 수정
    updatePost(postId, updatedData) {
        const posts = this.getAllPosts();
        const postIndex = posts.findIndex((post) => post.post_id === postId);

        if (postIndex === -1) {
            return null; // 게시글이 없으면 null 반환
        }

        // 게시글 제목, 내용만 수정 가능
        // 주의! updatedData의 속성명과 여기서 받는 변수명이 다르면 안됨
        const { postTitle, postContent } = updatedData;
        if (postTitle !== undefined) posts[postIndex].post_title = postTitle;
        if (postContent !== undefined)
            posts[postIndex].post_content = postContent;

        this.saveAllPosts(posts);
        return posts[postIndex];
    },

    // 게시글 삭제
    deletePost(postId) {
        let posts = this.getAllPosts();
        const initialLength = posts.length;
        if (initialLength === 0) {
            console.warn('삭제할 게시글이 없음');
            return false;
        }

        posts = posts.filter((post) => post.post_id !== postId);

        this.saveAllPosts(posts);

        return initialLength > posts.length; // 삭제 여부 반환
    },

    // 댓글 관련: 댓글은 CRUD만 구현하면 되니 따로 model을 두지 않고 post에 합침
    // 댓글 추가
    addComment(postId, newComment) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post) return null;

        if (!Array.isArray(post.comments_info)) {
            post.comments_info = [];
        }

        const commentWithId = {
            comment_id: uuidv4(),
            comment_content: newComment.comment_content,
            comment_created_at: formatDateTime(),
            comment_author: {
                user_id: newComment.comment_author?.user_id || null,
                nickname: newComment.comment_author?.nickname || null,
                profile_image: newComment.comment_author?.profile_image || null,
            },
        };

        post.comments_info.push(commentWithId);

        this.saveAllPosts(posts);
        return commentWithId;
    },

    // 특정 게시글의 댓글 조회
    getCommentsByPostId(postId) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post || !Array.isArray(post.comments_info)) {
            return null; // 게시글이나 댓글이 없으면 null 반환
        }

        return post.comments_info;
    },

    // 댓글 수정
    updateComment(postId, commentId, updatedData) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post || !Array.isArray(post.comments_info)) return null;

        const commentIndex = post.comments_info.findIndex(
            (comment) => comment.comment_id === commentId,
        );

        if (commentIndex === -1) return null;

        const comment = post.comments_info[commentIndex];
        if (updatedData.comment_content) {
            comment.comment_content = updatedData.comment_content;
        }

        this.saveAllPosts(posts);
        return comment;
    },

    // 댓글 삭제
    deleteComment(postId, commentId) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post || !Array.isArray(post.comments_info)) return false;

        const initialLength = post.comments_info.length;
        post.comments_info = post.comments_info.filter(
            (comment) => comment.comment_id !== commentId,
        );

        if (post.comments_info.length === initialLength) {
            return false; // 삭제 실패
        }

        this.saveAllPosts(posts);
        return true;
    },

    // 게시글 이미지 경로 업데이트
    updatePostImage(postId, imagePath, imageFileName) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post) return null;

        post.post_image = imagePath;
        post.post_image_name = imageFileName;

        this.saveAllPosts(posts);
        return post;
    },

    // 좋아요 수 증가, 감소
    setLikes(postId, userId) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post) return null;

        if (likesSet.has(userId)) {
            console.log('delete');
            likesSet.delete(userId); // 좋아요 취소
        } else {
            console.log('add');
            likesSet.add(userId); // 좋아요 추가
        }
        console.log(likesSet);

        const likeCount = likesSet.size; // 현재 좋아요 수

        // posts.json의 likes 업데이트, likesList에 좋아요 누른 사용자의 id 저장
        post.likes = likeCount;
        post.likesList = [...likesSet];

        this.saveAllPosts(posts);

        return likeCount;
    },
    // 좋아요 수 조회
    getLikes(postId) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post) return null;

        return post.likes;
    },
    likesStatus(postId, userId) {
        if (likesSet.has(userId)) {
            return true;
        } else {
            return false;
        }
    },

    // 조회 수 증가
    addViews(postId) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post) return null;

        if (typeof post.views !== 'number') {
            post.views = 0;
        }

        post.views += 1;
        this.saveAllPosts(posts);
        return post;
    },
    // 조회 수 조회
    getViews(postId) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post) return null;

        if (typeof post.views !== 'number') {
            console.error('조회수가 숫자형이 아님');
        }

        return post.views;
    },
    // 댓글 수 증가
    addcomments(postId) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post) return null;

        if (typeof post.comments !== 'number') {
            post.comments = 0;
        }

        post.comments += 1;
        this.saveAllPosts(posts);
        return post;
    },
    // 댓글 수 감소
    decreaseComments(postId) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post) return null;

        if (typeof post.comments !== 'number') {
            post.comments = 0;
        }

        post.comments -= 1;
        this.saveAllPosts(posts);
        return post;
    },
    // 댓글 수 조회
    getComments(postId) {
        const posts = this.getAllPosts();
        const post = posts.find((p) => p.post_id === postId);

        if (!post) return null;

        console.log(post.comments);

        post.comments = post.comments_info.length;
        this.saveAllPosts(posts);

        if (post.comments_info) {
            return post.comments_info.length;
        } else {
            return 0;
        }
    },
};

export default postModel;
