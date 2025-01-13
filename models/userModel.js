import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import db from '../config/dbConfig.js';

// 비밀번호 해싱 함수
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// userModel 객체 리터럴
const userModel = {
    // 사용자 인증
    validateUser: async (email, password) => {
        const user = await userModel.getUserByEmail(email);
        if (user && user.password === hashPassword(password)) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    },

    // 모든 사용자 조회
    getAllUsers: async () => {
        const [rows] = await db.execute(
            'SELECT user_id, username, email, profile_image_url FROM users',
        );
        return rows;
    },

    // ID로 사용자 조회
    getUserById: async (id) => {
        const [rows] = await db.execute(
            'SELECT user_id, username, email, profile_image_url FROM users WHERE user_id = ?',
            [id],
        );
        return rows[0] || null;
    },

    // 이메일로 사용자 조회
    getUserByEmail: async (email) => {
        const [rows] = await db.execute(
            'SELECT user_id, username, email, profile_image_url FROM users WHERE email = ?',
            [email],
        );
        return rows[0] || null;
    },

    // 새 사용자 추가
    addUser: async (newUser) => {
        newUser.user_id = uuidv4();
        newUser.password = hashPassword(newUser.password);
        delete newUser.re_password; // 비밀번호 확인 필드 제거

        await db.execute(
            'INSERT INTO users (user_id, username, email, password, profile_image_url) VALUES (?, ?, ?, ?, ?)',
            [
                newUser.user_id,
                newUser.username,
                newUser.email,
                newUser.password,
                newUser.profile_image_url || null,
            ],
        );
        return newUser;
    },

    // 사용자 업데이트
    updateUser: async (id, updatedUser) => {
        const { username, profile_image_url } = updatedUser;

        await db.execute(
            'UPDATE users SET username = ?, profile_image_url = ? WHERE user_id = ?',
            [username || null, profile_image_url || null, id],
        );

        const [rows] = await db.execute(
            'SELECT user_id, username, email, profile_image_url FROM users WHERE user_id = ?',
            [id],
        );
        return rows[0] || null;
    },

    // 사용자 삭제
    deleteUser: async (id) => {
        const [result] = await db.execute(
            'DELETE FROM users WHERE user_id = ?',
            [id],
        );
        return result.affectedRows > 0;
    },

    // 비밀번호 변경
    changePassword: async (id, newPassword) => {
        const hashedPassword = hashPassword(newPassword);

        const [result] = await db.execute(
            'UPDATE users SET password = ? WHERE user_id = ?',
            [hashedPassword, id],
        );
        return result.affectedRows > 0;
    },

    // 이메일 중복 체크
    isEmailDuplicate: async (email) => {
        const sanitizedEmail = email.trim().replace(/['"]+/g, ''); // 공백 및 따옴표 제거

        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM users WHERE email = ?',
            [sanitizedEmail],
        );
        return rows[0].count > 0;
    },

    // 닉네임 중복 체크
    isUsernameDuplicate: async (username) => {
        const sanitizedUsername = username.trim().replace(/['"]+/g, ''); // 공백 및 따옴표 제거

        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM users WHERE username = ?',
            [sanitizedUsername],
        );
        return rows[0].count > 0;
    },

    // 프로필 이미지 업데이트
    updateProfileImage: async (userId, profileImageUrl) => {
        await db.execute(
            'UPDATE users SET profile_image_url = ? WHERE user_id = ?',
            [profileImageUrl, userId],
        );

        const [rows] = await db.execute(
            'SELECT user_id, username, email, profile_image_url FROM users WHERE user_id = ?',
            [userId],
        );
        return rows[0] || null;
    },
};

export default userModel;
