'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer } from './map-container';
import { MapControls, MapInfoPanel } from './map-controls';
import { StoryCourse, Location, Marker, Route, MapCenter } from '../types';
import { useMap } from '../hooks/use-map';
import { useMarkers } from '../hooks/use-markers';
import { useRoutes } from '../hooks/use-routes';
import { calculateCenter } from '../utils/map-utils';

/**
 * 📖 스토리 지도 컴포넌트
 * 스토리 코스와 지도를 통합하여 제공합니다.
 */
interface StoryMapProps {
  course: StoryCourse;
  onLocationClick?: (location: Location) => void;
  onRouteClick?: (route: Route) => void;
  onStampCollected?: (stampId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function StoryMap({
  course,
  onLocationClick,
  onRouteClick,
  onStampCollected,
  className = '',
  style,
}: StoryMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // 지도 중심점 계산
  const mapCenter: MapCenter = calculateCenter(
    course.locations.map((location) => location.coordinates)
  );

  // 마커 생성
  const markers: Marker[] = course.locations.map((location, index) => {
    const marker: Marker = {
      id: location.id,
      location: location,
      position: location.coordinates,
      type: 'waypoint',
    };

    // 시작점과 끝점 설정
    if (index === 0) {
      marker.type = 'start';
    } else if (index === course.locations.length - 1) {
      marker.type = 'end';
    }

    // 스탬프가 있는 경우
    if (location.stampId) {
      marker.type = 'stamp';
    }

    return marker;
  });

  // 경로 생성
  const routes: Route[] = course.routes.map((route) => ({
    id: route.id,
    name: route.name,
    waypoints: route.waypoints,
    color: route.color || '#3B82F6',
    strokeWeight: route.strokeWeight || 3,
    strokeOpacity: route.strokeOpacity || 0.8,
    isMainRoute: route.isMainRoute || false,
  }));

  // 지도 이벤트 핸들러
  const handleMapReady = useCallback((mapInstance: any) => {
    setIsMapReady(true);
  }, []);

  const handleMarkerClick = useCallback(
    (marker: Marker) => {
      setSelectedLocation(marker.location);
      onLocationClick?.(marker.location);
    },
    [onLocationClick]
  );

  const handleRouteClick = useCallback(
    (route: Route) => {
      setSelectedRoute(route);
      onRouteClick?.(route);
    },
    [onRouteClick]
  );

  const handleStampCollected = useCallback(
    (stampId: string) => {
      onStampCollected?.(stampId);
    },
    [onStampCollected]
  );

  // 지도 컨트롤 핸들러
  const handleZoomIn = useCallback(() => {
    // 줌 인 로직
  }, []);

  const handleZoomOut = useCallback(() => {
    // 줌 아웃 로직
  }, []);

  const handleFullscreen = useCallback(() => {
    // 전체화면 로직
  }, []);

  const handleLocation = useCallback(() => {
    // 내 위치 로직
  }, []);

  const handleLayerToggle = useCallback((layerId: string) => {
    // 레이어 토글 로직
  }, []);

  const handleSearch = useCallback((query: string) => {
    // 검색 로직
  }, []);

  // 통계 계산
  const totalMarkers = markers.length;
  const visitedMarkers = markers.filter((m) => m.isVisited).length;
  const collectedStamps = markers.filter((m) => m.isStampCollected).length;
  const totalRoutes = routes.length;

  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      {/* 지도 컨테이너 */}
      <MapContainer
        center={mapCenter}
        level={12}
        markers={markers}
        routes={routes}
        showControls={true}
        showScale={true}
        showZoom={true}
        draggable={true}
        scrollwheel={true}
        onMapReady={handleMapReady}
        handlers={{
          onMarkerClick: handleMarkerClick,
          onRouteClick: handleRouteClick,
          onStampCollected: handleStampCollected,
        }}
        className="w-full h-full"
      />

      {/* 지도 컨트롤 */}
      {isMapReady && (
        <MapControls
          controls={{
            showZoom: true,
            showScale: true,
            showFullscreen: true,
            showLocation: true,
            showLayers: true,
            showSearch: true,
          }}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFullscreen={handleFullscreen}
          onLocation={handleLocation}
          onLayerToggle={handleLayerToggle}
          onSearch={handleSearch}
          currentZoom={12}
        />
      )}

      {/* 지도 정보 패널 */}
      {isMapReady && (
        <MapInfoPanel
          totalMarkers={totalMarkers}
          totalRoutes={totalRoutes}
          visitedMarkers={visitedMarkers}
          collectedStamps={collectedStamps}
        />
      )}

      {/* 선택된 위치 정보 */}
      {selectedLocation && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">
              {selectedLocation.name}
            </h3>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-3">
            {selectedLocation.description}
          </p>

          <div className="space-y-2">
            {selectedLocation.category && (
              <div className="flex items-center gap-1">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {selectedLocation.category}
                </span>
              </div>
            )}

            {selectedLocation.estimatedTime && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>⏱️</span>
                <span>예상 소요시간: {selectedLocation.estimatedTime}분</span>
              </div>
            )}

            {selectedLocation.difficulty && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>📊</span>
                <span>난이도: {selectedLocation.difficulty}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            {selectedLocation.qrCode && (
              <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                QR 스캔
              </button>
            )}

            {selectedLocation.media && selectedLocation.media.length > 0 && (
              <button className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
                미디어 보기
              </button>
            )}
          </div>
        </div>
      )}

      {/* 선택된 경로 정보 */}
      {selectedRoute && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">
              {selectedRoute.name}
            </h3>
            <button
              onClick={() => setSelectedRoute(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span>📏</span>
              <span>총 거리: {selectedRoute.waypoints.length}개 포인트</span>
            </div>

            {selectedRoute.isMainRoute && (
              <div className="flex items-center gap-1 text-blue-600 font-medium">
                <span>⭐</span>
                <span>메인 경로</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
              경로 따라가기
            </button>
            <button className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
              경로 공유
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
