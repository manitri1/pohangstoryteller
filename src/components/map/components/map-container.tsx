'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapOptions, MapEventHandlers, MapCenter } from '../types';
import { useMap } from '../hooks/use-map';
import { useMarkers } from '../hooks/use-markers';
import { useRoutes } from '../hooks/use-routes';

/**
 * 🗺️ 지도 컨테이너 컴포넌트
 * 포항 스토리 텔러의 핵심 지도 기능을 제공합니다.
 */
interface MapContainerProps extends MapOptions {
  className?: string;
  style?: React.CSSProperties;
  onMapReady?: (mapInstance: any) => void;
  onMapError?: (error: string) => void;
  handlers?: MapEventHandlers;
  children?: React.ReactNode;
}

export function MapContainer({
  center,
  level = 12,
  markers = [],
  routes = [],
  showControls = true,
  showScale = true,
  showZoom = true,
  draggable = true,
  scrollwheel = true,
  disableDoubleClick = false,
  disableDoubleClickZoom = false,
  keyboardShortcuts = true,
  className = '',
  style,
  onMapReady,
  onMapError,
  handlers,
  children,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 커스텀 훅들
  const mapHook = useMap(center, handlers);
  const markersHook = useMarkers();
  const routesHook = useRoutes();

  // 카카오맵 API 로드
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      };

      script.onerror = () => {
        setError('카카오맵 API 로드에 실패했습니다.');
        onMapError?.('카카오맵 API 로드에 실패했습니다.');
      };

      document.head.appendChild(script);
    };

    loadKakaoMap();
  }, []);

  // 지도 초기화
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.kakao) return;

    try {
      const mapOption = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: level,
        draggable,
        scrollwheel,
        disableDoubleClick,
        disableDoubleClickZoom,
        keyboardShortcuts,
      };

      const mapInstance = new window.kakao.maps.Map(mapRef.current, mapOption);

      // 지도 훅 초기화
      mapHook.initializeMap(mapInstance);

      // 마커와 경로 설정
      if (markers.length > 0) {
        markersHook.addMarkers(markers);
        markersHook.showMarkersOnMap(mapInstance);
      }

      if (routes.length > 0) {
        routesHook.addRoutes(routes);
        routesHook.showRoutesOnMap(mapInstance);
      }

      setIsLoaded(true);
      onMapReady?.(mapInstance);
    } catch (err) {
      const errorMessage = '지도 초기화에 실패했습니다.';
      setError(errorMessage);
      onMapError?.(errorMessage);
    }
  }, [
    center,
    level,
    markers,
    routes,
    draggable,
    scrollwheel,
    disableDoubleClick,
    disableDoubleClickZoom,
    keyboardShortcuts,
    mapHook,
    markersHook,
    routesHook,
    onMapReady,
    onMapError,
  ]);

  // 마커 업데이트
  useEffect(() => {
    if (isLoaded && markers.length > 0) {
      markersHook.clearMarkers();
      markersHook.addMarkers(markers);
      markersHook.showMarkersOnMap(mapHook.getMapInstance());
    }
  }, [markers, isLoaded, markersHook, mapHook]);

  // 경로 업데이트
  useEffect(() => {
    if (isLoaded && routes.length > 0) {
      routesHook.clearRoutes();
      routesHook.addRoutes(routes);
      routesHook.showRoutesOnMap(mapHook.getMapInstance());
    }
  }, [routes, isLoaded, routesHook, mapHook]);

  // 지도 중심점 변경
  useEffect(() => {
    if (isLoaded) {
      mapHook.setCenter(center);
    }
  }, [center, isLoaded, mapHook]);

  // 지도 줌 레벨 변경
  useEffect(() => {
    if (isLoaded) {
      mapHook.setZoom(level);
    }
  }, [level, isLoaded, mapHook]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={style}
      >
        <div className="text-center p-8">
          <div className="text-red-500 text-lg font-semibold mb-2">
            지도를 불러올 수 없습니다
          </div>
          <div className="text-gray-600 text-sm">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      {/* 지도 컨테이너 */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />

      {/* 로딩 상태 */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div className="text-gray-600 text-sm">지도를 불러오는 중...</div>
          </div>
        </div>
      )}

      {/* 지도 컨트롤 */}
      {showControls && isLoaded && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {showZoom && (
            <div className="bg-white rounded-lg shadow-lg p-1">
              <button
                onClick={() =>
                  mapHook.setZoom(mapHook.mapState.currentLevel + 1)
                }
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
                disabled={mapHook.mapState.currentLevel >= 20}
              >
                +
              </button>
              <div className="w-full h-px bg-gray-200"></div>
              <button
                onClick={() =>
                  mapHook.setZoom(mapHook.mapState.currentLevel - 1)
                }
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
                disabled={mapHook.mapState.currentLevel <= 1}
              >
                −
              </button>
            </div>
          )}
        </div>
      )}

      {/* 스케일 표시 */}
      {showScale && isLoaded && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-1 text-xs text-gray-600">
          스케일: 1:
          {(
            1000000 / Math.pow(2, mapHook.mapState.currentLevel - 1)
          ).toLocaleString()}
        </div>
      )}

      {/* 자식 컴포넌트들 */}
      {children}
    </div>
  );
}
