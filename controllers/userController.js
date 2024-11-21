const userModel = require('../models/userModel');

// 모든 유저 조회
exports.getAllUsers = (req, res) => {
    const users = userModel.getAllUsers();
    res.status(200).json(users);
};

// 회원가입
exports.register = (req, res) => {
    const { email, password, re_password, nickname, profile_image } = req.body;
    console.log(req.body);

    // 입력 데이터 검증
    if (!email || !password || !nickname || password !== re_password) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    // 이메일 중복 확인
    const existingUser = userModel.findUserByEmail(email);
    if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    // 유저 생성
    const newUser = userModel.createUser({
        email,
        password,
        nickname,
        profile_image,
    });
    res.status(201).json({
        message: 'User registered successfully',
        data: newUser,
    });
};

// 로그인
exports.login = (req, res) => {
    const { email, password } = req.body;

    // 입력 데이터 검증
    if (!email || !password) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    // 유저 인증
    const user = userModel.findUserByEmail(email);
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', data: user });
};
