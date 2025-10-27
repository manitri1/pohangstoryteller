@echo off
chcp 65001 >nul
echo 포항 스토리텔러 500 오류 상세 해결 도구
echo ======================================
echo.

echo [1단계] 현재 상태 확인
echo ---------------------
echo 실행 중인 Node.js 프로세스 확인...
tasklist | findstr node.exe
if %errorlevel% neq 0 (
    echo Node.js 프로세스가 실행되지 않고 있습니다.
) else (
    echo Node.js 프로세스가 실행 중입니다.
)

echo.
echo 포트 사용 상태 확인...
netstat -ano | findstr :3000
netstat -ano | findstr :3001

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
echo [3단계] 환경 변수 확인
echo ---------------------
if exist .env.local (
    echo .env.local 파일이 존재합니다.
    echo 파일 내용 확인 중...
    echo.
    type .env.local
    echo.
) else (
    echo .env.local 파일이 없습니다!
    echo .env.example에서 복사합니다...
    if exist .env.example (
        copy .env.example .env.local
        echo .env.local 파일이 생성되었습니다.
    ) else (
        echo .env.example 파일도 없습니다!
        echo 기본 환경 변수를 생성합니다...
        echo NEXT_PUBLIC_SUPABASE_URL=your_supabase_url > .env.local
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key >> .env.local
        echo SUPABASE_SERVICE_ROLE_KEY=your_service_role_key >> .env.local
        echo NEXTAUTH_SECRET=your_nextauth_secret >> .env.local
        echo NEXTAUTH_URL=http://localhost:3000 >> .env.local
        echo .env.local 파일이 생성되었습니다. 값을 수정해주세요.
    )
)

echo.
echo [4단계] 캐시 및 빌드 파일 정리
echo ----------------------------
echo Next.js 캐시 정리 중...
if exist .next rmdir /s /q .next
echo 캐시 정리 완료

echo node_modules 캐시 정리 중...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo 캐시 정리 완료

echo.
echo [5단계] TypeScript 타입 체크
echo --------------------------
echo TypeScript 컴파일러로 타입을 확인합니다...
npx tsc --noEmit
if %errorlevel% neq 0 (
    echo 타입 오류가 발견되었습니다!
    echo 오류를 수정한 후 다시 시도해주세요.
    pause
    exit /b 1
)
echo 타입 체크 통과

echo.
echo [6단계] 개발 서버 시작
echo ---------------------
echo 개발 서버를 시작합니다...
echo 브라우저에서 http://localhost:3000 을 열어주세요.
echo.
echo 서버를 중지하려면 Ctrl+C를 누르세요.
echo.

npm run dev

echo.
echo 개발 서버가 종료되었습니다.
echo.
echo 문제가 지속되면 다음을 확인해주세요:
echo 1. Supabase 연결 설정 (.env.local 파일)
echo 2. 데이터베이스 마이그레이션 상태
echo 3. 네트워크 연결 상태
echo 4. 방화벽 설정
echo.
pause
