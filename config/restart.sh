#!/bin/bash

# 프론트엔드 및 백엔드 프로젝트 경로
FRONTEND_DIR="2-jack-lee-community-fe"  # 프론트엔드 경로
BACKEND_DIR="2-jack-lee-community-be"   # 백엔드 경로
BRANCH="feature"  # Pull할 브랜치 지정

echo "Starting deployment process..."

# 프론트엔드 최신 코드 가져오기
echo "Updating frontend ($BRANCH branch)..."
cd $FRONTEND_DIR
git checkout $BRANCH || { echo "Frontend: Failed to checkout branch $BRANCH"; exit 1; }
git pull --rebase origin $BRANCH || { echo "Frontend git pull failed!"; exit 1; }
npm install || { echo "Frontend npm install failed!"; exit 1; }

# 백엔드 최신 코드 가져오기
cd ..
echo "Updating backend ($BRANCH branch)..."
cd $BACKEND_DIR
git checkout $BRANCH || { echo "Backend: Failed to checkout branch $BRANCH"; exit 1; }
git pull --rebase origin $BRANCH || { echo "Backend git pull failed!"; exit 1; }
npm install || { echo "Backend npm install failed!"; exit 1; }

# 서버 재시작
echo "Restarting servers with PM2..."
pm2 restart all || { echo "PM2 restart failed!"; exit 1; }

echo "Deployment completed successfully!"
