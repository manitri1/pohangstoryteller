#!/bin/bash

echo "포항 스토리텔러 QR 코드 생성기"
echo "================================"

echo ""
echo "1. 의존성 설치 중..."
npm install

echo ""
echo "2. QR 코드 이미지 생성 중..."
node generate_qr_images.js

echo ""
echo "3. 완료!"
echo "생성된 QR 코드 파일들을 확인하세요."

