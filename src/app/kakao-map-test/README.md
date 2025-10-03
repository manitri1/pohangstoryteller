# 카카오 지도 API 테스트 프로그램

이 프로그램은 카카오 지도 API의 다양한 기능을 테스트할 수 있는 Next.js 기반의 웹 애플리케이션입니다.

## 🚀 시작하기

### 1. 카카오 개발자 계정 설정

1. [카카오 개발자 사이트](https://developers.kakao.com/)에 접속하여 계정을 생성합니다.
2. 새로운 애플리케이션을 등록합니다.
3. **카카오맵 API**를 활성화합니다.
4. **JavaScript 키**를 발급받습니다.
5. 웹 플랫폼을 추가하고 도메인을 등록합니다 (개발 시: `http://localhost:3000`).

### 2. API 키 설정

`src/lib/config.ts` 파일에서 카카오맵 API 키를 설정합니다:

```typescript
export const config = {
  kakaoMapApiKey: 'YOUR_KAKAO_MAP_API_KEY',
  // ... 기타 설정
};
```

### 3. 애플리케이션 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/kakao-map-test`로 접속합니다.

## 🗺️ 테스트 기능

### 1. 기본 지도 테스트

- 지도 기본 기능 (이동, 줌, 클릭 이벤트)
- 다양한 도시로 지도 중심 이동
- 지도 이벤트 로그 확인

### 2. 마커 테스트

- 마커 추가/삭제
- 커스텀 마커 이미지
- 마커 클릭 이벤트
- 랜덤 마커 생성

### 3. 인포윈도우 테스트

- 인포윈도우 표시/숨김
- 커스텀 인포윈도우 내용
- 마커와 연동된 인포윈도우

### 4. 폴리라인/폴리곤 테스트

- 선 그리기 (Polyline)
- 영역 표시 (Polygon)
- 원 그리기 (Circle)
- 다양한 색상 및 스타일 설정

### 5. 장소 검색 테스트

- 키워드 검색
- 검색 결과 마커 표시
- 장소 상세 정보 확인
- 검색 히스토리 관리

### 6. 클러스터링 테스트

- 마커 클러스터링
- 클러스터 설정 조정
- 카테고리별 마커 관리
- 클러스터 정보 모니터링

## 🛠️ 기술 스택

- **Next.js 15**: React 프레임워크
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **shadcn/ui**: UI 컴포넌트
- **카카오 지도 API**: 지도 서비스

## 📁 프로젝트 구조

```
src/
├── app/
│   └── kakao-map-test/
│       ├── page.tsx              # 메인 테스트 페이지
│       └── README.md            # 이 파일
├── components/
│   ├── map/
│   │   ├── kakao-map.tsx        # 기본 카카오맵 컴포넌트
│   │   └── test/                # 테스트 컴포넌트들
│   │       ├── basic-map-test.tsx
│   │       ├── marker-test.tsx
│   │       ├── info-window-test.tsx
│   │       ├── polyline-test.tsx
│   │       ├── search-test.tsx
│   │       └── cluster-test.tsx
│   └── ui/                      # shadcn/ui 컴포넌트들
├── lib/
│   ├── config.ts               # 설정 파일
│   └── utils.ts                # 유틸리티 함수
└── types/
    └── map.ts                  # 지도 관련 타입 정의
```

## 🎯 사용법

1. **기본 지도 테스트**: 지도를 클릭하고 드래그하여 이벤트를 확인합니다.
2. **마커 테스트**: 새로운 마커를 추가하고 커스텀 이미지를 설정합니다.
3. **인포윈도우 테스트**: 마커를 클릭하여 인포윈도우를 확인합니다.
4. **폴리라인 테스트**: 지도를 클릭하여 선이나 영역을 그립니다.
5. **검색 테스트**: 장소를 검색하고 결과를 지도에서 확인합니다.
6. **클러스터링 테스트**: 많은 마커를 추가하고 클러스터링 동작을 확인합니다.

## 🔧 설정 옵션

### 클러스터링 설정

- **최소 클러스터 크기**: 클러스터가 형성되는 최소 마커 수
- **최대 줌 레벨**: 클러스터링이 적용되는 최대 줌 레벨
- **그리드 크기**: 클러스터링 그리드의 크기
- **평균 중심점**: 클러스터 중심을 평균으로 계산할지 여부

### 마커 설정

- **커스텀 이미지**: 마커에 사용할 이미지 URL
- **카테고리**: 마커의 카테고리 분류
- **설명**: 마커에 대한 추가 설명

## 🐛 문제 해결

### 지도가 표시되지 않는 경우

1. 카카오맵 API 키가 올바르게 설정되었는지 확인
2. 도메인이 카카오 개발자 콘솔에 등록되었는지 확인
3. 브라우저 개발자 도구에서 오류 메시지 확인

### 검색이 작동하지 않는 경우

1. 카카오맵 API에 Places 서비스가 활성화되었는지 확인
2. 네트워크 연결 상태 확인
3. API 사용량 제한 확인

## 📚 참고 자료

- [카카오 지도 Web API 가이드](https://apis.map.kakao.com/web/guide/)
- [카카오 개발자 문서](https://developers.kakao.com/docs)
- [Next.js 문서](https://nextjs.org/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.
