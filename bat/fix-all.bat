@echo off
chcp 65001 >nul
echo 포항 스토리텔러 종합 문제 해결 도구
echo ====================================
echo.

:menu
echo 선택하세요:
echo 1. 개발 서버 문제 해결 (포트 정리 + 캐시 정리 + 재시작)
echo 2. 500 오류 빠른 해결 (모든 Node.js 프로세스 종료)
echo 3. 빌드 문제 해결 (타입 체크 + 린트 + 빌드)
echo 4. NextAuth 문제 해결 (인증 시스템 오류)
echo 5. 의존성 재설치
echo 6. 환경 변수 설정
echo 7. 종료
echo.
set /p choice="번호를 입력하세요 (1-7): "

if "%choice%"=="1" goto dev_fix
if "%choice%"=="2" goto fix_500
if "%choice%"=="3" goto build_fix
if "%choice%"=="4" goto fix_nextauth
if "%choice%"=="5" goto reinstall
if "%choice%"=="6" goto env_setup
if "%choice%"=="7" goto end
echo 잘못된 선택입니다. 다시 시도해주세요.
echo.
goto menu

:dev_fix
echo.
echo [개발 서버 문제 해결]
echo ====================
echo 포트 정리 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1

echo 캐시 정리 중...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 개발 서버 시작...
npm run dev
goto menu

:fix_500
echo.
echo [500 오류 빠른 해결]
echo ===================
echo 모든 Node.js 프로세스 종료 중...
taskkill /IM node.exe /F >nul 2>&1

echo 포트 정리 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1

echo 캐시 정리 중...
if exist .next rmdir /s /q .next

echo 3초 후 개발 서버 시작...
timeout /t 3 /nobreak >nul
npm run dev
goto menu

:build_fix
echo.
echo [빌드 문제 해결]
echo ===============
echo 포트 정리 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1

echo 캐시 정리 중...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist dist rmdir /s /q dist

echo 타입 체크 중...
npx tsc --noEmit
if %errorlevel% neq 0 (
    echo 타입 오류 발견! 수정 후 다시 시도해주세요.
    pause
    goto menu
)

echo 린트 검사 중...
npx eslint . --ext .ts,.tsx --max-warnings 0
if %errorlevel% neq 0 (
    echo 린트 오류 발견! 수정 후 다시 시도해주세요.
    pause
    goto menu
)

echo 빌드 중...
npm run build
if %errorlevel% neq 0 (
    echo 빌드 실패! 오류를 확인해주세요.
    pause
    goto menu
)

echo ✅ 빌드 성공!
pause
goto menu

:fix_nextauth
echo.
echo [NextAuth 문제 해결]
echo ===================
echo NextAuth 관련 파일 확인 중...
if exist "src\lib\auth.ts" (
    echo ✅ auth.ts 파일 존재
) else (
    echo ❌ auth.ts 파일 없음
)

if exist "src\app\api\auth\[...nextauth]\route.ts" (
    echo ✅ NextAuth API 라우트 존재
) else (
    echo ❌ NextAuth API 라우트 없음
)

echo 환경 변수 확인 중...
if exist .env.local (
    echo ✅ .env.local 파일 존재
) else (
    echo ❌ .env.local 파일 없음
)

echo 포트 정리 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1

echo 캐시 정리 중...
if exist .next rmdir /s /q .next

echo TypeScript 타입 체크 중...
npx tsc --noEmit --skipLibCheck
if %errorlevel% neq 0 (
    echo 타입 오류 발견! 수정 후 다시 시도해주세요.
    pause
    goto menu
)

echo NextAuth 개발 서버 시작...
npm run dev
goto menu

:reinstall
echo.
echo [의존성 재설치]
echo ==============
echo node_modules 정리 중...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 의존성 설치 중...
npm install
if %errorlevel% neq 0 (
    echo 의존성 설치 실패! 인터넷 연결을 확인해주세요.
    pause
    goto menu
)
echo ✅ 의존성 재설치 완료!
pause
goto menu

:env_setup
echo.
echo [환경 변수 설정]
echo ==============
if exist .env.local (
    echo .env.local 파일이 이미 존재합니다.
    echo 덮어쓰시겠습니까? (y/n)
    set /p overwrite=""
    if /i "%overwrite%"=="y" (
        if exist .env.example copy .env.example .env.local
        echo .env.local 파일이 업데이트되었습니다.
    )
) else (
    if exist .env.example (
        copy .env.example .env.local
        echo .env.local 파일이 생성되었습니다.
    ) else (
        echo .env.example 파일이 없습니다.
        echo 기본 환경 변수를 생성합니다...
        echo NEXT_PUBLIC_SUPABASE_URL=your_supabase_url > .env.local
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key >> .env.local
        echo SUPABASE_SERVICE_ROLE_KEY=your_service_role_key >> .env.local
        echo NEXTAUTH_SECRET=your_nextauth_secret >> .env.local
        echo NEXTAUTH_URL=http://localhost:3000 >> .env.local
        echo .env.local 파일이 생성되었습니다. 값을 수정해주세요.
    )
)
pause
goto menu

:end
echo.
echo 프로그램을 종료합니다.
echo 감사합니다!
pause
