#!/bin/bash

echo "===== Restart Script Start ====="

git pull origin

npm install

pm2 restart all

echo "===== Restart Script End ====="