# 2-jack-lee-community-be

<br/>

# 🛠 Backend - API Server

## 프로젝트 소개

Jack's Community 프로젝트 백엔드 리포지터리입니다.

## 📌 기술 스택

-   Node.js (Express)
-   MySQL
-   쿠키와 세션 (로그인 인증)

## 🚀 설치 및 실행

```bash
    git clone https://github.com/100-hours-a-week/2-jack-lee-community-be.git
    npm install
    npm start
```

## 🔑 환경 변수 설정 (.env)

```bash
    DB_HOST = your-database-url
    DB_PORT = your-port
    DB_USER = username
    DB_PASSWORD = password
    DB_NAME = your-database-name
```

## 👨‍💻 프론트엔드 리포지터리 링크

https://github.com/100-hours-a-week/2-jack-lee-community-fe

## 백엔드 회고

커뮤니티 프로젝트의 백엔드드 부분을 개발하면서 느낀 점, 좋았던 점, 어려웠던 점, 앞으로 개선할 점 에 대해 회고해보겠습니다.

1. 느낀 점: 일단 코드의 가독성이 매우 중요하다는 걸 느꼈습니다. 개발을 진행할수록 코드가 길어지면서 내가 수정해야 하는 부분이 어디에 있는 코드인지 찾는게 정말 귀찮았습니다. 이를 위해 파일 구조를 명확히 하고, 중복되는 부분 함수화, 주석 표시 등이 필수적이란 걸 느꼈습니다.
2. 좋았던 점: 파일 구조를 명확히 하면서 미들웨어의 편리성에 대해 알았고, 아키텍처를 잘 짜서 코드의 일부분만 변경해도 빠르게 마이그레이션이 가능했던 점이 좋았습니다. 또 API를 개발하면서 클라이언트와 백엔드가 어떤 방식으로 소통해야 할지에 대한 부분도 많이 배웠습니다.
3. 어려웠던 점: 파일 업로드 부분이 여러가지 설정할 부분이 많아 헷갈렸고, fetch를 한번 해도 되는 작업을 두번 하는 실수가 많았습니다. 정말 초기 API 설계에 대한 경험이 중요한 것 같습니다.
4. 앞으로 개선할 점: 초기 API 설계, DB 설계, 예외 처리 설계, 아키텍처 설계만 제대로 해도 큰 문제 없다는 걸 느꼈습니다. 다음에는 GraphQL과 Redis 같은 기술을 도입하여 더 나은 확장성을 고려하는 프로젝트를 진행해보고 싶습니다.
