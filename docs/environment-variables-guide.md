# 포항 스토리텔러 환경변수 설정 가이드

## 📋 개요

이 가이드는 포항 스토리텔러 애플리케이션의 환경변수 설정 방법을 설명합니다. 웹 스크래핑 스크립트가 환경변수를 통해 설정을 읽어와 동작합니다.

## 🔧 환경변수 설정 방법

### **1. .env.local 파일 생성**

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 웹 스크래핑 설정
DEFAULT_IMAGE_URL=https://picsum.photos/400/300
DEFAULT_STAMP_IMAGE_URL=https://picsum.photos/200/200
DEFAULT_VISIT_DURATION=90
QR_CODE_PREFIX=POHANG_

# API 키 설정
KAKAO_API_KEY=your_kakao_api_key
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

### **2. 환경변수별 상세 설명**

#### **🖼️ 이미지 설정**
- `DEFAULT_IMAGE_URL`: 기본 이미지 URL (400x300)
- `DEFAULT_STAMP_IMAGE_URL`: 스탬프 이미지 URL (200x200)

#### **⏰ 시간 설정**
- `DEFAULT_VISIT_DURATION`: 기본 방문 시간 (분)

#### **🏷️ QR 코드 설정**
- `QR_CODE_PREFIX`: QR 코드 접두사

#### **🔑 API 키 설정**
- `KAKAO_API_KEY`: 카카오맵 API 키
- `NAVER_CLIENT_ID`: 네이버 검색 API 클라이언트 ID
- `NAVER_CLIENT_SECRET`: 네이버 검색 API 클라이언트 시크릿

## 🚀 API 키 발급 방법

### **카카오맵 API 키 발급**

1. **카카오 개발자 콘솔** 접속: https://developers.kakao.com/
2. **애플리케이션 등록**
3. **플랫폼 설정** → **Web 플랫폼 추가**
4. **제품 설정** → **카카오맵** 활성화
5. **앱 키** → **REST API 키** 복사

### **네이버 검색 API 키 발급**

1. **네이버 개발자 센터** 접속: https://developers.naver.com/
2. **애플리케이션 등록**
3. **사용 API**: 검색 선택
4. **서비스 환경**: Web 플랫폼 추가
5. **Client ID**와 **Client Secret** 복사

## 📝 사용 예시

### **스크립트 실행**

```bash
# 환경변수 설정 후 스크립트 실행
node scripts/scrape-web-data.js
```

### **환경변수 확인**

스크립트 실행 시 다음과 같은 출력을 확인할 수 있습니다:

```
📋 환경변수 설정:
  - DEFAULT_IMAGE_URL: https://picsum.photos/400/300
  - DEFAULT_STAMP_IMAGE_URL: https://picsum.photos/200/200
  - DEFAULT_VISIT_DURATION: 90분
  - QR_CODE_PREFIX: POHANG_
  - KAKAO_API_KEY: 설정됨
  - NAVER_CLIENT_ID: 설정됨
  - NAVER_CLIENT_SECRET: 설정됨
```

## 🔒 보안 주의사항

1. **`.env.local` 파일은 절대 Git에 커밋하지 마세요**
2. **실제 API 키는 안전하게 보관하세요**
3. **환경변수 파일의 권한을 적절히 설정하세요**

## 🛠️ 문제 해결

### **환경변수가 읽히지 않는 경우**

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 파일명이 정확한지 확인 (`.env.local`)
3. 파일 인코딩이 UTF-8인지 확인

### **API 키 오류가 발생하는 경우**

1. API 키가 올바르게 설정되었는지 확인
2. API 키의 권한이 적절한지 확인
3. API 호출 제한에 걸리지 않았는지 확인

## 📚 추가 자료

- [카카오 개발자 콘솔](https://developers.kakao.com/)
- [네이버 개발자 센터](https://developers.naver.com/)
- [Supabase 문서](https://supabase.com/docs)
- [Next.js 환경변수](https://nextjs.org/docs/basic-features/environment-variables)
