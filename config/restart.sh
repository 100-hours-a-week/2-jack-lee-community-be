#!/bin/bash

# 프론트엔드 및 백엔드 프로젝트 경로
FRONTEND_DIR="2-jack-lee-community-fe"  # 프론트엔드 경로
BACKEND_DIR="2-jack-lee-community-be"   # 백엔드 경로

echo "Starting deployment process..."

# 프론트엔드 최신 코드 가져오기
echo "Updating frontend..."
cd \$FRONTEND_DIR
git pull origin main || { echo "Frontend git pull failed!"; exit 1; }
npm install || { echo "Frontend npm install failed!"; exit 1; }

# 백엔드 최신 코드 가져오기
cd ..
echo "Updating backend..."
cd \$BACKEND_DIR
git pull origin main || { echo "Backend git pull failed!"; exit 1; }
npm install || { echo "Backend npm install failed!"; exit 1; }

# 서버 재시작
echo "Restarting servers with PM2..."
pm2 restart all || { echo "PM2 restart failed!"; exit 1; }

echo "Deployment completed successfully!"
