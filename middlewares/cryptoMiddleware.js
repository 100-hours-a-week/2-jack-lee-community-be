import crypto from 'crypto';
import { Buffer } from 'buffer';
import { secretKey, algorithm, iv } from '../config/cryptoConfig.js';

// Buffer 명시적 사용
const keyBuffer = Buffer.from(secretKey);
const ivBuffer = Buffer.from(iv);

// 데이터 암호화 함수
const encrypt = (data) => {
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// 데이터 복호화 함수
const decrypt = (encryptedData) => {
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// 암호화 미들웨어
const cryptoMiddleware = (req, res, next) => {
    req.encrypt = encrypt; // 요청 객체에 암호화 함수 추가
    req.decrypt = decrypt; // 요청 객체에 복호화 함수 추가
    next(); // 다음 미들웨어로 이동
};

export default cryptoMiddleware;
