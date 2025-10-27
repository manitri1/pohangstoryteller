@echo off
chcp 65001 >nul
echo Pohang StoryTeller All-in-One Fix Tool
echo ======================================
echo.

:menu
echo Select option:
echo 1. Fix Dev Server (Port cleanup + Cache cleanup + Restart)
echo 2. Fix 500 Error (Kill all Node.js processes)
echo 3. Fix Build Issues (Type check + Lint + Build)
echo 4. Fix NextAuth Issues (Authentication system errors)
echo 5. Reinstall Dependencies
echo 6. Setup Environment Variables
echo 7. Fix All Issues (Run 1-5 automatically)
echo 8. Exit
echo.
set /p choice="Enter number (1-8): "

if "%choice%"=="1" goto dev_fix
if "%choice%"=="2" goto fix_500
if "%choice%"=="3" goto build_fix
if "%choice%"=="4" goto fix_nextauth
if "%choice%"=="5" goto reinstall
if "%choice%"=="6" goto env_setup
if "%choice%"=="7" goto fix_all
if "%choice%"=="8" goto end
echo Invalid selection. Please try again.
echo.
goto menu

:dev_fix
echo.
echo [Fixing Dev Server]
echo ===================
echo Cleaning ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1

echo Cleaning cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Starting dev server...
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

:fix_all
echo.
echo [Fixing All Issues - Running 1-5 Automatically]
echo ================================================
echo This will run the following steps sequentially:
echo 1. Kill all Node.js processes
echo 2. Clean ports (3000, 3001)
echo 3. Clean cache (.next, node_modules\.cache)
echo 4. Reinstall dependencies
echo 5. Type check and lint
echo 6. Start dev server
echo.
echo Continue? (y/n)
set /p confirm=""
if /i not "%confirm%"=="y" goto menu

echo.
echo [Step 1] Killing all Node.js processes...
taskkill /IM node.exe /F >nul 2>&1
echo Done

echo.
echo [Step 2] Cleaning ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1
echo Done

echo.
echo [Step 3] Cleaning cache...
echo Stopping all processes that might be using files...
taskkill /IM node.exe /F >nul 2>&1
taskkill /IM npm.exe /F >nul 2>&1
timeout /t 2 /nobreak >nul

echo Force deleting .next folder...
if exist .next (
    attrib -r -h -s .next\*.* /s /d >nul 2>&1
    rmdir /s /q .next >nul 2>&1
    if exist .next (
        echo Warning: Could not delete .next folder completely
        echo Trying alternative method...
        del /f /s /q .next\*.* >nul 2>&1
        rmdir /s /q .next >nul 2>&1
    )
)

echo Cleaning other cache folders...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist out rmdir /s /q out
if exist dist rmdir /s /q dist
if exist .turbo rmdir /s /q .turbo

echo Clearing npm cache...
npm cache clean --force >nul 2>&1

echo Done

echo.
echo [Step 4] Reinstalling dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo Installing dependencies... (This may take a while)
npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies! Check your internet connection.
    pause
    goto menu
)
echo Done

echo.
echo [Step 5] Type checking...
npx tsc --noEmit --skipLibCheck
if %errorlevel% neq 0 (
    echo Type errors found! But continuing...
) else (
    echo Type check passed
)

echo.
echo [Step 6] Lint checking...
npx eslint . --ext .ts,.tsx --max-warnings 0 >nul 2>&1
if %errorlevel% neq 0 (
    echo Lint errors found! But continuing...
) else (
    echo Lint check passed
)

echo.
echo [Step 7] Checking environment variables...
if exist .env.local (
    echo .env.local file exists
) else (
    echo .env.local file missing - using defaults
)

echo.
echo [Step 8] Starting dev server...
echo Starting dev server in 3 seconds...
timeout /t 3 /nobreak >nul
echo.
echo Starting dev server...
echo Open http://localhost:3000 in your browser
echo.
echo Note: If you see image loading errors (522), it's due to picsum.photos service issues.
echo This is normal and doesn't affect functionality.
echo.
npm run dev
goto menu

:end
echo.
echo Exiting program.
echo Thank you!
pause
