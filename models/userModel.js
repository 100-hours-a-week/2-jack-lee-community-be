import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../config/dbConfig.js';

// 비밀번호 해싱 함수
const hashPassword = async (password) => {
    const saltRounds = 10; // 작업 비용 (높을수록 안전하지만 느려짐)
    return await bcrypt.hash(password, saltRounds);
};

// 비밀번호 검증 함수
const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// userModel 객체 리터럴
const userModel = {
    // 사용자 인증
    validateUser: async (email, password) => {
        // 이메일로 사용자 조회
        const user = await userModel.getUserByEmail(email);

        if (user) {
            // 입력된 비밀번호와 저장된 해시된 비밀번호 비교
            const isMatch = await verifyPassword(password, user.password);

            if (isMatch) {
                // 비밀번호 일치 - 사용자 인증 성공
                const { password, ...userWithoutPassword } = user; // 비밀번호 제거 후 반환
                return userWithoutPassword;
            }
        }

        // 사용자 없음 또는 비밀번호 불일치 - 인증 실패
        return null;
    },

    // 모든 사용자 조회
    getAllUsers: async () => {
        const [rows] = await db.execute(
            'SELECT user_id, username, email, profile_image_url FROM users WHERE is_deleted = 0',
        );
        return rows;
    },

    // ID로 사용자 조회
    getUserById: async (id) => {
        const [rows] = await db.execute(
            'SELECT user_id, email, password, username, profile_image_url FROM users WHERE user_id = ? AND is_deleted = 0',
            [id],
        );
        return rows[0] || null;
    },

    // 이메일로 사용자 조회
    getUserByEmail: async (email) => {
        const [rows] = await db.execute(
            'SELECT user_id, email, password, username, profile_image_url FROM users WHERE email = ? AND is_deleted = 0',
            [email],
        );
        return rows[0] || null;
    },

    // 새 사용자 추가
    addUser: async (newUser) => {
        newUser.user_id = uuidv4();
        newUser.password = await hashPassword(newUser.password); // 비밀번호 해싱
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
            'UPDATE users SET is_deleted = 1 WHERE user_id = ?',
            [id],
        );
        return result.affectedRows > 0;
    },

    // 비밀번호 변경
    changePassword: async (id, newPassword) => {
        const hashedPassword = await hashPassword(newPassword);

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
            'SELECT COUNT(*) as count FROM users WHERE email = ? AND is_deleted = 0',
            [sanitizedEmail],
        );
        return rows[0].count > 0;
    },

    // 닉네임 중복 체크
    isUsernameDuplicate: async (username) => {
        const sanitizedUsername = username.trim().replace(/['"]+/g, ''); // 공백 및 따옴표 제거

        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM users WHERE username = ? AND is_deleted = 0',
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
