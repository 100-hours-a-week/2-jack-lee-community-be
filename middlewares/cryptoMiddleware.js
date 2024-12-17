const crypto = require('crypto');
const { Buffer } = require('buffer');
const { secretKey, algorithm, iv } = require('../config/cryptoConfig');

// Buffer 명시적 사용
const keyBuffer = Buffer.from(secretKey);
const ivBuffer = Buffer.from(iv);

// 데이터 암호화 함수
function encrypt(data) {
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// 데이터 복호화 함수
function decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const cryptoMiddleware = (req, res, next) => {
    req.encrypt = encrypt;
    req.decrypt = decrypt;
    next();
};

module.exports = cryptoMiddleware;
