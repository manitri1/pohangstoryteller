@echo off
chcp 65001 >nul
echo 포항 스토리텔러 500 오류 빠른 해결
echo ==================================
echo.

echo [1단계] 모든 Node.js 프로세스 종료
echo --------------------------------
echo 실행 중인 Node.js 프로세스를 모두 종료합니다...
taskkill /IM node.exe /F >nul 2>&1
echo Node.js 프로세스 종료 완료

echo.
echo [2단계] 포트 정리
echo ----------------
echo 포트 3000, 3001 정리 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1
echo 포트 정리 완료

echo.
echo [3단계] 캐시 정리
echo ----------------
if exist .next rmdir /s /q .next
echo Next.js 캐시 정리 완료

echo.
echo [4단계] 개발 서버 재시작
echo ----------------------
echo 3초 후 개발 서버를 시작합니다...
timeout /t 3 /nobreak >nul
echo 개발 서버 시작 중...
npm run dev
