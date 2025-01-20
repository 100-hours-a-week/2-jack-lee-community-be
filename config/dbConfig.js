import mysql from 'mysql2/promise';
import env from './dotenv.js'; // 환경 변수를 이미 로드한 모듈 가져오기
import colors from 'colors';

const dbConfig = {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    connectionLimit: 10, // 풀에 유지할 최대 연결 수 (기본값: 10)
    waitForConnections: true, // 연결 요청이 초과되었을 때 대기 여부
    queueLimit: 0, // 대기열에 넣을 요청의 최대 수 (0은 무제한)
    dateStrings: true, // 날짜 필드를 문자열로 반환
};

const db = mysql.createPool(dbConfig);

// 데이터베이스 연결 확인
(async () => {
    try {
        const connection = await db.getConnection(); // 연결 풀에서 연결 가져오기
        console.log('Connected to MySQL database'.green);
        connection.release(); // 연결 반환
    } catch (err) {
        console.error('Database connection failed:'.red, err.message);
    }
})();

export default db;
