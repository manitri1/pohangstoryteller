# 포항 스토리텔러 개발 도구 모음

이 폴더에는 포항 스토리텔러 개발 중 발생하는 문제들을 해결하기 위한 배치 파일들이 포함되어 있습니다.

## 📁 파일 목록

### 1. `fix-all.bat` - 종합 문제 해결 도구 (추천)
- **기능**: 메뉴 방식으로 다양한 문제를 해결
- **사용법**: 더블클릭 후 원하는 번호 선택
- **해결 가능한 문제**:
  - 개발 서버 문제 (포트 충돌, 캐시 문제)
  - 500 오류 빠른 해결
  - 빌드 문제 (타입 오류, 린트 오류)
  - NextAuth 문제 (인증 시스템 오류)
  - 의존성 문제
  - 환경 변수 설정

### 2. `fix-500-error.bat` - 500 오류 상세 해결
- **기능**: 500 Internal Server Error를 체계적으로 해결
- **해결 과정**:
  1. 현재 상태 확인 (프로세스, 포트)
  2. 모든 프로세스 정리
  3. 환경 변수 확인 및 생성
  4. 캐시 정리
  5. TypeScript 타입 체크
  6. 개발 서버 시작

### 3. `quick-fix-500.bat` - 500 오류 빠른 해결
- **기능**: 500 오류를 빠르게 해결하고 개발 서버 시작
- **해결 과정**:
  1. 모든 Node.js 프로세스 종료
  2. 포트 정리
  3. 캐시 정리
  4. 개발 서버 재시작

### 4. `fix-nextauth.bat` - NextAuth 문제 해결
- **기능**: NextAuth 인증 시스템 오류를 체계적으로 해결
- **해결 과정**:
  1. NextAuth 관련 파일 확인
  2. 환경 변수 확인
  3. 프로세스 및 포트 정리
  4. 캐시 정리
  5. TypeScript 타입 체크
  6. 개발 서버 시작

## 🚀 사용 방법

### Windows에서 실행
1. 원하는 `.bat` 파일을 더블클릭
2. 명령 프롬프트 창이 열리면 자동으로 실행됩니다
3. 완료 후 `pause` 명령으로 결과를 확인할 수 있습니다

### 명령 프롬프트에서 실행
```cmd
cd bat
fix-all.bat
```

## ⚠️ 주의사항

- **관리자 권한**: 포트 정리 시 관리자 권한이 필요할 수 있습니다
- **한글 인코딩**: 모든 파일은 UTF-8 인코딩으로 작성되어 한글이 깨지지 않습니다
- **백업**: 중요한 파일이 있다면 실행 전 백업을 권장합니다

## 🔧 문제 해결

### 포트 충돌 오류
```
Error: listen EADDRINUSE: address already in use :::3000
```
→ `fix-all.bat`에서 "1. 개발 서버 문제 해결" 선택

### 500 Internal Server Error
```
Failed to load resource: the server responded with a status of 500
```
→ `quick-fix-500.bat` 실행 (빠른 해결)
→ 또는 `fix-500-error.bat` 실행 (상세 해결)

### 빌드 오류
```
Failed to compile
Type error: Cannot find name 'xxx'
```
→ `fix-all.bat`에서 "3. 빌드 문제 해결" 선택

### NextAuth 오류
```
[next-auth][error][CLIENT_FETCH_ERROR]
Failed to load resource: the server responded with a status of 500
```
→ `fix-all.bat`에서 "4. NextAuth 문제 해결" 선택
→ 또는 `fix-nextauth.bat` 실행

### 의존성 오류
```
Module not found: Can't resolve 'xxx'
```
→ `fix-all.bat`에서 "5. 의존성 재설치" 선택

## 📞 지원

문제가 지속되면 다음을 확인해주세요:
1. Node.js 버전 (권장: 18.x 이상)
2. npm 버전 (권장: 9.x 이상)
3. 환경 변수 설정 (`.env.local` 파일)
4. 네트워크 연결 상태
5. Supabase 연결 설정
6. 데이터베이스 마이그레이션 상태
