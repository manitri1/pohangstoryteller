# 지도 서비스 대안 가이드

## 🗺️ 지원하는 지도 서비스

### 1. Google Maps (추천)

- **장점**: 글로벌 표준, 안정적, 기능 풍부
- **단점**: 유료 (월 $200 무료 크레딧)
- **설정**: Google Cloud Console에서 API 키 발급

### 2. OpenStreetMap + Leaflet (무료 추천)

- **장점**: 완전 무료, 오픈소스, 가벼움
- **단점**: 한국 데이터 제한적
- **설정**: API 키 불필요

### 3. 카카오맵 (기존)

- **장점**: 한국 최적화, 한국어 지원
- **단점**: 복잡한 설정, CORS 문제
- **설정**: 카카오 개발자 콘솔에서 서비스 활성화 필요

## 🚀 사용 방법

### 기본 사용법

```tsx
import { MapSelector } from '@/components/map/map-selector';

// 지도 타입 자동 선택 (기본값: Google Maps)
<MapSelector
  center={{ lat: 36.019, lng: 129.3435 }}
  level={12}
  markers={markers}
  routes={routes}
  onMapClick={handleMapClick}
  onMarkerClick={handleMarkerClick}
/>;
```

### 특정 지도 서비스 사용

```tsx
import { GoogleMap } from '@/components/map/google-map';
import { LeafletMap } from '@/components/map/leaflet-map';
import { KakaoMap } from '@/components/map/kakao-map';

// Google Maps 사용
<GoogleMap center={center} markers={markers} />

// OpenStreetMap 사용
<LeafletMap center={center} markers={markers} />

// 카카오맵 사용
<KakaoMap center={center} markers={markers} />
```

## ⚙️ 설정 방법

### 1. Google Maps 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 및 Maps JavaScript API 활성화
3. API 키 생성
4. 환경변수 설정:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 2. OpenStreetMap 설정

- 별도 설정 불필요
- 즉시 사용 가능

### 3. 카카오맵 설정

1. [카카오 개발자 콘솔](https://developers.kakao.com/) 접속
2. 애플리케이션 생성
3. 웹 플랫폼 등록 및 도메인 설정
4. 카카오맵 서비스 활성화

## 💰 비용 비교

| 서비스            | 무료 크레딧 | 월 사용량   | 예상 비용 |
| ----------------- | ----------- | ----------- | --------- |
| **Google Maps**   | $200/월     | 10,000 로드 | $0-50     |
| **OpenStreetMap** | 무제한      | 무제한      | $0        |
| **카카오맵**      | 무료        | 무제한      | $0        |

## 🎯 추천 사용 시나리오

### 개발/테스트 환경

- **OpenStreetMap**: 무료, 빠른 설정
- **Google Maps**: 안정적 테스트

### 프로덕션 환경

- **Google Maps**: 글로벌 서비스, 안정성 중요
- **카카오맵**: 한국 전용 서비스

### 예산 제약

- **OpenStreetMap**: 완전 무료
- **Google Maps**: 무료 크레딧 활용

## 🔧 마이그레이션 가이드

### 카카오맵 → Google Maps

```tsx
// Before
import { KakaoMap } from '@/components/map/kakao-map';
<KakaoMap center={center} markers={markers} />;

// After
import { GoogleMap } from '@/components/map/google-map';
<GoogleMap center={center} markers={markers} />;
```

### 카카오맵 → OpenStreetMap

```tsx
// Before
import { KakaoMap } from '@/components/map/kakao-map';
<KakaoMap center={center} markers={markers} />;

// After
import { LeafletMap } from '@/components/map/leaflet-map';
<LeafletMap center={center} markers={markers} />;
```

## 🐛 문제 해결

### Google Maps 오류

- API 키 확인
- 도메인 제한 설정 확인
- 결제 정보 등록 확인

### OpenStreetMap 오류

- 네트워크 연결 확인
- CORS 정책 확인

### 카카오맵 오류

- 서비스 활성화 확인
- 도메인 등록 확인
- CORS 설정 확인
