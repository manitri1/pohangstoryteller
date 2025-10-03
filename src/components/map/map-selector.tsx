'use client';

import { useState } from 'react';
import { KakaoMap } from './kakao-map';
import { GoogleMap } from './google-map';
import { LeafletMap } from './leaflet-map';
import { config } from '@/lib/config';
import {
  MapCenter,
  MapMarker,
  MapRoute,
  MapOptions,
  MapEventHandlers,
} from '@/types/map';

interface MapSelectorProps {
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
  defaultMapType?: 'kakao' | 'google' | 'leaflet';
}

export function MapSelector({
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
  defaultMapType = 'google', // 기본값을 Google Maps로 설정
}: MapSelectorProps) {
  const [mapType, setMapType] = useState<'kakao' | 'google' | 'leaflet'>(
    defaultMapType
  );

  const renderMap = () => {
    const commonProps = {
      center,
      level,
      markers,
      routes,
      className,
      style,
      onMapClick,
      onMarkerClick,
      onBoundsChanged,
      onZoomChanged,
    };

    switch (mapType) {
      case 'kakao':
        return <KakaoMap {...commonProps} />;
      case 'google':
        return <GoogleMap {...commonProps} />;
      case 'leaflet':
        return <LeafletMap {...commonProps} />;
      default:
        return <GoogleMap {...commonProps} />;
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* 지도 타입 선택 버튼 */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setMapType('kakao')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            mapType === 'kakao'
              ? 'bg-yellow-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          카카오맵
        </button>
        <button
          onClick={() => setMapType('google')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            mapType === 'google'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Google Maps
        </button>
        <button
          onClick={() => setMapType('leaflet')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            mapType === 'leaflet'
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          OpenStreetMap
        </button>
      </div>

      {/* 지도 렌더링 */}
      {renderMap()}
    </div>
  );
}
