# Google Maps 설정 가이드

## 🔧 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Google Maps API 키
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Kakao Map API 키
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key_here

# OpenAI API 키
OPENAI_API_KEY=your_openai_api_key_here
```

## 🚀 Google Maps API 키 발급 방법

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리" 메뉴로 이동
4. "Maps JavaScript API" 검색 후 활성화
5. "API 및 서비스" > "사용자 인증 정보" 메뉴로 이동
6. "사용자 인증 정보 만들기" > "API 키" 선택
7. 생성된 API 키를 복사하여 `.env.local` 파일에 추가

## ⚡ 성능 최적화 기능

### 1. 스크립트 캐싱

- 중복 API 로딩 방지
- Promise 기반 로딩 상태 관리
- 글로벌 콜백 함수 활용

### 2. 재시도 메커니즘

- 최대 2회 자동 재시도
- 1초 간격으로 재시도
- 실패 시 사용자 친화적 에러 메시지

### 3. 타임아웃 최적화

- API 로딩 타임아웃: 5초
- 체크 간격: 100ms
- 최대 체크 횟수: 30회

### 4. 로딩 상태 표시

- 3단계 로딩 진행률 표시
- 실시간 로딩 상태 업데이트
- 사용자 피드백 메시지

## 🛠️ 문제 해결

### 로딩이 오래 걸리는 경우:

1. API 키가 올바른지 확인
2. 네트워크 연결 상태 확인
3. 브라우저 캐시 클리어
4. 새로고침 버튼 클릭

### API 키 오류:

1. Google Cloud Console에서 API 키 확인
2. Maps JavaScript API 활성화 확인
3. 도메인 제한 설정 확인

## 📝 추가 설정

### API 제한 설정 (선택사항):

1. Google Cloud Console > API 및 서비스 > 사용자 인증 정보
2. API 키 선택 > 제한사항 설정
3. HTTP 리퍼러(웹사이트) 제한 또는 IP 주소 제한 설정

### 무료 할당량:

- Google Maps는 월 $200 크레딧 제공
- 대부분의 소규모 프로젝트에서 충분
- 사용량은 Google Cloud Console에서 모니터링 가능
