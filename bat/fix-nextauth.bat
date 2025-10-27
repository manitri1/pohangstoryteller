@echo off
chcp 65001 >nul
echo 포항 스토리텔러 NextAuth 문제 해결 도구
echo ======================================
echo.

echo [1단계] NextAuth 관련 오류 진단
echo ------------------------------
echo NextAuth 설정 파일 확인 중...

if exist "src\lib\auth.ts" (
    echo ✅ auth.ts 파일 존재
) else (
    echo ❌ auth.ts 파일 없음
)

if exist "src\lib\auth-simple.ts" (
    echo ✅ auth-simple.ts 파일 존재
) else (
    echo ❌ auth-simple.ts 파일 없음
)

if exist "src\app\api\auth\[...nextauth]\route.ts" (
    echo ✅ NextAuth API 라우트 존재
) else (
    echo ❌ NextAuth API 라우트 없음
)

echo.
echo 환경 변수 확인 중...
if exist .env.local (
    echo ✅ .env.local 파일 존재
    echo 환경 변수 내용:
    type .env.local | findstr "NEXTAUTH"
    echo.
) else (
    echo ❌ .env.local 파일 없음
)

echo.
echo [2단계] 모든 프로세스 정리
echo ------------------------
echo 모든 Node.js 프로세스를 종료합니다...
taskkill /IM node.exe /F >nul 2>&1
echo Node.js 프로세스 정리 완료

echo 포트 정리 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1
echo 포트 정리 완료

echo.
echo [3단계] 캐시 정리
echo ----------------
if exist .next rmdir /s /q .next
echo Next.js 캐시 정리 완료

echo.
echo [4단계] TypeScript 타입 체크
echo --------------------------
echo NextAuth 관련 타입을 확인합니다...
npx tsc --noEmit --skipLibCheck
if %errorlevel% neq 0 (
    echo 타입 오류가 발견되었습니다!
    echo 오류를 수정한 후 다시 시도해주세요.
    pause
    exit /b 1
)
echo 타입 체크 통과

echo.
echo [5단계] 개발 서버 시작
echo ---------------------
echo NextAuth가 올바르게 설정된 개발 서버를 시작합니다...
echo 브라우저에서 http://localhost:3000 을 열어주세요.
echo.
echo 서버를 중지하려면 Ctrl+C를 누르세요.
echo.

npm run dev

echo.
echo 개발 서버가 종료되었습니다.
echo.
echo NextAuth 문제가 지속되면 다음을 확인해주세요:
echo 1. .env.local 파일의 NEXTAUTH_SECRET 설정
echo 2. Supabase 연결 설정
echo 3. profiles 테이블 존재 여부
echo 4. 데이터베이스 마이그레이션 상태
echo.
pause
