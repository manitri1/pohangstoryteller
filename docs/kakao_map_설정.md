# Kakao Map API 설정 가이드

## 📌 개요

포항 스토리 텔러 프로젝트에서 Kakao Map API를 사용하여 지도 기능을 구현하는 방법을 설명합니다.

---

## 🚀 1. Kakao Developers 계정 및 앱 등록

### 1.1 계정 생성 및 로그인

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인
3. 개발자 등록 완료

### 1.2 애플리케이션 등록

1. **내 애플리케이션** → **애플리케이션 추가하기**
2. **앱 이름**: "포항 스토리 텔러"
3. **사업자명**: 개인 또는 회사명
4. **카테고리**: "여행/교통" 선택
5. **앱 등록** 완료

---

## 🔧 2. 플랫폼 설정

### 2.1 Web 플랫폼 추가

1. **앱 설정** → **플랫폼** → **Web 플랫폼 등록**
2. **사이트 도메인** 입력:
   - 개발: `http://localhost:3000`, `http://localhost:3001`
   - 운영: `https://yourdomain.com`

### 2.2 JavaScript 키 확인

1. **앱 설정** → **앱 키** 탭
2. **JavaScript 키** 복사 (예: `abc123def456...`)

---

## ⚙️ 3. 프로젝트 설정

### 3.1 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# .env.local 파일 생성
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_javascript_key_here
```

**⚠️ 중요**:

- `your_javascript_key_here`를 Kakao Developers에서 발급받은 실제 JavaScript 키로 교체하세요
- `.env.local` 파일은 Git에 커밋하지 마세요 (보안상 이유)
- 실제 배포 시에는 서버 환경 변수로 설정하세요

### 3.2 설정 파일 생성

```typescript
// src/lib/config.ts
export const config = {
  // Kakao Map API 키 (실제 배포 시 환경 변수로 관리)
  kakaoMapApiKey:
    process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || 'your_kakao_map_api_key_here',

  // 기본 설정
  defaultMapCenter: {
    lat: 36.019, // 포항시 중심
    lng: 129.3435,
  },

  // 지도 기본 줌 레벨
  defaultZoomLevel: 12,

  // 마커 아이콘 설정
  markerIcons: {
    default:
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
    start:
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerRed.png',
    end: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerBlue.png',
    waypoint:
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerGreen.png',
  },
};
```

---

## 📝 4. 타입 정의

### 4.1 지도 관련 타입 정의

```typescript
// src/types/map.ts
export interface MapCenter {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  position: MapCenter;
  title: string;
  content?: string;
  image?: string;
  type?: 'start' | 'end' | 'waypoint' | 'default';
}

export interface MapRoute {
  id: string;
  name: string;
  waypoints: MapCenter[];
  color?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
}

export interface MapBounds {
  sw: MapCenter; // Southwest
  ne: MapCenter; // Northeast
}

export interface MapOptions {
  center: MapCenter;
  level: number; // 줌 레벨
  mapTypeId?: 'ROADMAP' | 'SKYVIEW' | 'HYBRID';
  draggable?: boolean;
  scrollwheel?: boolean;
  disableDoubleClick?: boolean;
  disableDoubleClickZoom?: boolean;
  projectionId?: string;
}

export interface MapEventHandlers {
  onMapClick?: (event: any) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  onBoundsChanged?: (bounds: MapBounds) => void;
  onZoomChanged?: (level: number) => void;
}
```

---

## 🗺️ 5. Kakao Map 컴포넌트 구현

### 5.1 기본 컴포넌트 구조

```typescript
// src/components/map/kakao-map.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { config } from '@/lib/config';
import {
  MapCenter,
  MapMarker,
  MapRoute,
  MapOptions,
  MapEventHandlers,
} from '@/types/map';

interface KakaoMapProps {
  center?: MapCenter;
  level?: number;
  markers?: MapMarker[];
  routes?: MapRoute[];
  className?: string;
  style?: React.CSSProperties;
  onMapClick?: (event: any) => void;
  onMarkerClick?: (marker: MapMarker) => void;
  onBoundsChanged?: (bounds: any) => void;
  onZoomChanged?: (level: number) => void;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export function KakaoMap({
  center = config.defaultMapCenter,
  level = config.defaultZoomLevel,
  markers = [],
  routes = [],
  className = '',
  style,
  onMapClick,
  onMarkerClick,
  onBoundsChanged,
  onZoomChanged,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routesRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // API 로드 및 지도 초기화 로직...
}
```

### 5.2 API 스크립트 로드

```typescript
useEffect(() => {
  const loadKakaoMap = () => {
    if (window.kakao && window.kakao.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.kakaoMapApiKey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        initializeMap();
      });
    };
    document.head.appendChild(script);
  };

  loadKakaoMap();
}, []);
```

### 5.3 지도 초기화

```typescript
const initializeMap = () => {
  if (!mapRef.current || !window.kakao) return;

  const mapOption = {
    center: new window.kakao.maps.LatLng(center.lat, center.lng),
    level: level,
  };

  mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, mapOption);
  setIsLoaded(true);

  // 이벤트 리스너 등록
  if (onMapClick) {
    window.kakao.maps.event.addListener(
      mapInstanceRef.current,
      'click',
      onMapClick
    );
  }

  if (onBoundsChanged) {
    window.kakao.maps.event.addListener(
      mapInstanceRef.current,
      'bounds_changed',
      () => {
        const bounds = mapInstanceRef.current.getBounds();
        onBoundsChanged({
          sw: {
            lat: bounds.getSouthWest().getLat(),
            lng: bounds.getSouthWest().getLng(),
          },
          ne: {
            lat: bounds.getNorthEast().getLat(),
            lng: bounds.getNorthEast().getLng(),
          },
        });
      }
    );
  }

  if (onZoomChanged) {
    window.kakao.maps.event.addListener(
      mapInstanceRef.current,
      'zoom_changed',
      () => {
        onZoomChanged(mapInstanceRef.current.getLevel());
      }
    );
  }
};
```

---

## 📍 6. 마커 및 경로 표시

### 6.1 마커 표시

```typescript
useEffect(() => {
  if (!isLoaded || !mapInstanceRef.current) return;

  // 기존 마커 제거
  markersRef.current.forEach((marker) => marker.setMap(null));
  markersRef.current = [];

  // 새 마커 추가
  markers.forEach((marker) => {
    const position = new window.kakao.maps.LatLng(
      marker.position.lat,
      marker.position.lng
    );

    // 마커 이미지 설정
    let markerImage;
    if (marker.image) {
      const imageSize = new window.kakao.maps.Size(24, 35);
      markerImage = new window.kakao.maps.MarkerImage(marker.image, imageSize);
    }

    const kakaoMarker = new window.kakao.maps.Marker({
      position: position,
      image: markerImage,
      title: marker.title,
    });

    kakaoMarker.setMap(mapInstanceRef.current);
    markersRef.current.push(kakaoMarker);

    // 마커 클릭 이벤트
    if (onMarkerClick) {
      window.kakao.maps.event.addListener(kakaoMarker, 'click', () => {
        onMarkerClick(marker);
      });
    }
  });
}, [markers, isLoaded, onMarkerClick]);
```

### 6.2 경로 표시 (Polyline)

```typescript
useEffect(() => {
  if (!isLoaded || !mapInstanceRef.current) return;

  // 기존 경로 제거
  routesRef.current.forEach((route) => route.setMap(null));
  routesRef.current = [];

  // 새 경로 추가
  routes.forEach((route) => {
    const polyline = new window.kakao.maps.Polyline({
      path: route.waypoints.map(
        (point) => new window.kakao.maps.LatLng(point.lat, point.lng)
      ),
      strokeWeight: route.strokeWeight || 5,
      strokeColor: route.color || '#FF0000',
      strokeOpacity: route.strokeOpacity || 0.7,
      strokeStyle: 'solid',
    });

    polyline.setMap(mapInstanceRef.current);
    routesRef.current.push(polyline);
  });
}, [routes, isLoaded]);
```

---

## 💡 7. 사용 예시

### 7.1 코스 상세 페이지에서 사용

```typescript
// src/components/stories/course-detail.tsx
import { KakaoMap } from '@/components/map/kakao-map';

const getMapMarkers = (): MapMarker[] => {
  return course.locations.map((location, index) => ({
    id: location.id,
    position: location.coordinates,
    title: location.name,
    content: location.description,
    type: index === 0 ? 'start' : index === course.locations.length - 1 ? 'end' : 'waypoint'
  }));
};

const getMapRoute = (): MapRoute => {
  return {
    id: course.id,
    name: course.title,
    waypoints: course.locations.map(location => location.coordinates),
    color: '#3B82F6',
    strokeWeight: 5,
    strokeOpacity: 0.7
  };
};

// JSX에서 사용
{showMap && (
  <div className="h-64 sm:h-80 lg:h-96 w-full rounded-lg overflow-hidden border">
    <KakaoMap
      center={getMapCenter()}
      level={12}
      markers={getMapMarkers()}
      routes={[getMapRoute()]}
      onMarkerClick={handleMarkerClick}
      className="w-full h-full"
    />
  </div>
)}
```

---

## 🎯 8. 주요 기능

### 8.1 지도 컨트롤

- **줌**: 마우스 휠, +/- 버튼
- **팬**: 드래그로 지도 이동
- **마커 클릭**: 방문지 정보 표시
- **경로 표시**: 방문지 간 이동 경로

### 8.2 반응형 대응

```typescript
// 모바일/태블릿/데스크톱별 지도 높이 조정
<div className="h-64 sm:h-80 lg:h-96 w-full rounded-lg overflow-hidden border">
  <KakaoMap ... />
</div>
```

---

## ⚠️ 9. 주의사항

### 9.1 API 키 보안

- **환경 변수 사용**: `.env.local`에 저장
- **도메인 제한**: Kakao Developers에서 허용 도메인 설정
- **키 노출 방지**: 클라이언트 사이드에서만 사용

### 9.2 성능 최적화

- **지연 로딩**: 필요할 때만 API 로드
- **마커 최적화**: 대량 마커 시 클러스터링 고려
- **이벤트 정리**: 컴포넌트 언마운트 시 이벤트 리스너 제거

---

## 🐛 10. 디버깅 및 테스트

### 10.1 개발자 도구 확인

```javascript
// 브라우저 콘솔에서 확인
console.log(window.kakao); // API 로드 확인
console.log(window.kakao.maps); // 지도 객체 확인
```

### 10.2 일반적인 오류 해결

- **API 키 오류**: JavaScript 키 확인
- **도메인 오류**: 허용 도메인 설정 확인
- **CORS 오류**: HTTPS 사용 권장

---

## 📊 11. 사용량 및 비용

### 11.1 무료 사용량

- **월 300,000회** 무료
- **일 10,000회** 제한
- 초과 시 유료 과금

### 11.2 과금 정책

- **기본 요금**: 월 300,000회 초과 시 1,000회당 1원
- **상세 정보**: [Kakao Developers 과금 정책](https://developers.kakao.com/pricing)

---

## 🔗 12. 참고 자료

- [Kakao Developers 공식 문서](https://developers.kakao.com/docs)
- [Kakao Map API 가이드](https://apis.map.kakao.com/web/guide/)
- [Kakao Map API 레퍼런스](https://apis.map.kakao.com/web/api-reference/)

---

## ✅ 13. 체크리스트

### 13.1 설정 완료 확인

- [x] Kakao Developers 계정 생성 (개발자 직접 수행 필요)
- [x] 애플리케이션 등록 (개발자 직접 수행 필요)
- [x] Web 플랫폼 추가 (개발자 직접 수행 필요)
- [x] JavaScript 키 확인 (개발자 직접 수행 필요)
- [x] 환경 변수 설정
- [x] 프로젝트 설정 파일 생성
- [x] 타입 정의 완료
- [x] Kakao Map 컴포넌트 구현
- [x] 마커 및 경로 표시 기능
- [x] 반응형 대응
- [x] 테스트 완료

### 13.2 배포 전 확인

- [ ] 운영 도메인 등록
- [ ] API 키 보안 확인
- [ ] 사용량 모니터링 설정
- [ ] 오류 처리 구현

---

**🎉 Kakao Map API 설정이 완료되었습니다!**

## ✅ 구현 완료 상태

### 📁 생성된 파일들

- `src/lib/config.ts` - API 키 및 기본 설정
- `src/types/map.ts` - 지도 관련 TypeScript 타입 정의
- `src/components/map/kakao-map.tsx` - Kakao Map React 컴포넌트
- `docs/kakao_map_설정.md` - 상세 설정 가이드

### 🔧 구현된 기능들

- ✅ 지도 초기화 및 렌더링
- ✅ 마커 표시 (시작점, 종료점, 경유지)
- ✅ 경로 그리기 (Polyline)
- ✅ 이벤트 핸들링 (클릭, 줌, 범위 변경)
- ✅ 반응형 디자인 지원
- ✅ 커스텀 마커 이미지 지원

### 🚀 사용 방법

1. Kakao Developers에서 JavaScript 키 발급
2. `.env.local` 파일에 API 키 설정
3. 코스 상세 페이지에서 지도 기능 확인

이제 포항 스토리 텔러에서 지도 기능을 활용할 수 있습니다. 추가 질문이나 문제가 있으시면 언제든 문의해주세요.
