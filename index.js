const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoute');

// JSON 파일 및 디렉토리 초기화
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
const dataFilePath = path.join(dataDir, 'users.json');
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

const app = express();
const PORT = 3000;
// data 폴더에 JSON 파일 저장
const upload = multer({ dest: 'data/' });

app.use(express.json()); // JSON 요청 파싱
app.use(bodyParser.json());
app.use(express.static('public')); // 클라이언트 HTML 파일 제공

app.use('/users', userRoutes);
//app.use('/posts', postRoutes);

// CORS 설정: 모든 Origin 허용
const corsOptions = {
    origin: '*', // 모든 Origin 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
};

app.use(cors(corsOptions)); // CORS 미들웨어 적용
app.use(express.json()); // JSON 요청 파싱

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
