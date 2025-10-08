/**
 * 🗺️ Map Components Types
 * 포항 스토리 텔러 지도 컴포넌트 타입 정의
 */

// 기본 좌표 타입
export interface Coordinate {
  lat: number;
  lng: number;
}

// 지도 중심점과 줌 레벨
export interface MapCenter extends Coordinate {
  level?: number;
}

// 방문지 정보
export interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: Coordinate;
  category: '맛집탐방' | '역사여행' | '자연경관' | '골목산책';
  qrCode?: string;
  stampId?: string;
  media?: Media[];
  story?: string;
  estimatedTime?: number; // 분 단위
  difficulty?: '쉬움' | '보통' | '어려움';
}

// 미디어 콘텐츠
export interface Media {
  id: string;
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  title: string;
  description?: string;
  duration?: number; // 초 단위
  thumbnail?: string;
}

// 스토리 코스
export interface StoryCourse {
  id: string;
  title: string;
  description: string;
  category: Location['category'];
  duration: number; // 분 단위
  difficulty: Location['difficulty'];
  locations: Location[];
  routes: Route[];
  thumbnail?: string;
  tags: string[];
  isRecommended?: boolean;
  rating?: number;
}

// 경로 정보
export interface Route {
  id: string;
  name: string;
  waypoints: Coordinate[];
  color?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  isMainRoute?: boolean;
}

// 마커 정보
export interface Marker {
  id: string;
  location: Location;
  position: Coordinate;
  type: 'start' | 'end' | 'waypoint' | 'stamp' | 'photo';
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  isVisited?: boolean;
  isStampCollected?: boolean;
}

// 지도 이벤트 핸들러
export interface MapEventHandlers {
  onMapClick?: (event: any) => void;
  onMarkerClick?: (marker: Marker) => void;
  onMarkerHover?: (marker: Marker) => void;
  onRouteClick?: (route: Route) => void;
  onBoundsChanged?: (bounds: any) => void;
  onZoomChanged?: (level: number) => void;
  onStampCollected?: (stampId: string) => void;
}

// 지도 옵션
export interface MapOptions {
  center: MapCenter;
  level?: number;
  markers?: Marker[];
  routes?: Route[];
  showControls?: boolean;
  showScale?: boolean;
  showZoom?: boolean;
  draggable?: boolean;
  scrollwheel?: boolean;
  disableDoubleClick?: boolean;
  disableDoubleClickZoom?: boolean;
  keyboardShortcuts?: boolean;
}

// 스탬프 정보
export interface Stamp {
  id: string;
  locationId: string;
  name: string;
  description: string;
  icon: string;
  collectedAt?: Date;
  isCollected: boolean;
  reward?: {
    type: 'coupon' | 'badge' | 'discount';
    value: string;
    description: string;
  };
}

// 사용자 경험 기록
export interface ExperienceRecord {
  id: string;
  userId?: string;
  locationId: string;
  visitedAt: Date;
  photos: Media[];
  story?: string;
  emotions: string[];
  rating?: number;
  stamps: Stamp[];
}

// 지도 상태
export interface MapState {
  isLoaded: boolean;
  isInitialized: boolean;
  currentCenter: MapCenter;
  currentLevel: number;
  selectedMarker?: Marker;
  selectedRoute?: Route;
  visibleMarkers: Marker[];
  routes: Route[];
  collectedStamps: Stamp[];
  experienceRecords: ExperienceRecord[];
  userLocation?: Coordinate;
  error?: string;
}

// QR 코드 정보
export interface QRCodeInfo {
  type: 'stamp' | 'story' | 'media';
  locationId: string;
  data: any;
  expiresAt?: Date;
}

// 지도 테마
export interface MapTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  styles?: any; // 지도 스타일 오버라이드
}

// 반응형 브레이크포인트
export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

// 지도 컨트롤 옵션
export interface MapControls {
  showZoom: boolean;
  showScale: boolean;
  showFullscreen: boolean;
  showLocation: boolean;
  showLayers: boolean;
  showSearch: boolean;
}

// 지도 레이어
export interface MapLayer {
  id: string;
  name: string;
  type: 'marker' | 'route' | 'overlay' | 'heatmap';
  visible: boolean;
  opacity: number;
  data: any;
}

// 지도 애니메이션
export interface MapAnimation {
  type: 'flyTo' | 'panTo' | 'zoomTo' | 'rotateTo';
  duration: number;
  easing?: string;
  callback?: () => void;
}

// 지도 성능 설정
export interface MapPerformance {
  maxMarkers: number;
  maxRoutes: number;
  enableClustering: boolean;
  enableVirtualization: boolean;
  cacheSize: number;
}

// 지도 접근성 설정
export interface MapAccessibility {
  enableKeyboardNavigation: boolean;
  enableScreenReader: boolean;
  enableHighContrast: boolean;
  enableVoiceOver: boolean;
  announceChanges: boolean;
}

// 지도 보안 설정
export interface MapSecurity {
  enableLocationTracking: boolean;
  enableDataCollection: boolean;
  enableAnalytics: boolean;
  dataRetentionDays: number;
  encryptionRequired: boolean;
}
