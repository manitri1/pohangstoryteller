// 지도 관련 타입 정의

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
