'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { MapState, MapCenter, Marker, Route, MapEventHandlers } from '../types';

// Kakao Maps API 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

const kakao = typeof window !== 'undefined' ? window.kakao : null;

/**
 * 🗺️ 지도 상태 관리 훅
 * 지도의 전반적인 상태와 이벤트를 관리합니다.
 */
export function useMap(initialCenter: MapCenter, handlers?: MapEventHandlers) {
  const [mapState, setMapState] = useState<MapState>({
    isLoaded: false,
    isInitialized: false,
    currentCenter: initialCenter,
    currentLevel: initialCenter.level || 12,
    visibleMarkers: [],
    routes: [],
    collectedStamps: [],
    experienceRecords: [],
  });

  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Marker[]>([]);
  const routesRef = useRef<Route[]>([]);

  // 지도 초기화
  const initializeMap = useCallback(
    (mapInstance: any) => {
      if (!mapInstance) return;

      mapInstanceRef.current = mapInstance;

      setMapState((prev) => ({
        ...prev,
        isLoaded: true,
        isInitialized: true,
      }));

      // 지도 이벤트 리스너 등록
      if (handlers?.onMapClick) {
        kakao.maps.event.addListener(mapInstance, 'click', handlers.onMapClick);
      }

      if (handlers?.onBoundsChanged) {
        kakao.maps.event.addListener(mapInstance, 'bounds_changed', () => {
          const bounds = mapInstance.getBounds();
          handlers.onBoundsChanged?.(bounds);
        });
      }

      if (handlers?.onZoomChanged) {
        kakao.maps.event.addListener(mapInstance, 'zoom_changed', () => {
          const level = mapInstance.getLevel();
          handlers.onZoomChanged?.(level);
          setMapState((prev) => ({ ...prev, currentLevel: level }));
        });
      }
    },
    [handlers]
  );

  // 지도 중심점 변경
  const setCenter = useCallback((center: MapCenter) => {
    if (!mapInstanceRef.current) return;

    const moveLatLon = new kakao.maps.LatLng(center.lat, center.lng);
    mapInstanceRef.current.setCenter(moveLatLon);

    if (center.level) {
      mapInstanceRef.current.setLevel(center.level);
    }

    setMapState((prev) => ({
      ...prev,
      currentCenter: center,
      currentLevel: center.level || prev.currentLevel,
    }));
  }, []);

  // 지도 줌 변경
  const setZoom = useCallback((level: number) => {
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.setLevel(level);
    setMapState((prev) => ({ ...prev, currentLevel: level }));
  }, []);

  // 지도 범위 설정
  const fitBounds = useCallback((markers: Marker[]) => {
    if (!mapInstanceRef.current || markers.length === 0) return;

    const bounds = new kakao.maps.LatLngBounds();

    markers.forEach((marker) => {
      const latLng = new kakao.maps.LatLng(
        marker.position.lat,
        marker.position.lng
      );
      bounds.extend(latLng);
    });

    mapInstanceRef.current.setBounds(bounds);
  }, []);

  // 마커 선택
  const selectMarker = useCallback(
    (marker: Marker) => {
      setMapState((prev) => ({ ...prev, selectedMarker: marker }));
      handlers?.onMarkerClick?.(marker);
    },
    [handlers]
  );

  // 경로 선택
  const selectRoute = useCallback(
    (route: Route) => {
      setMapState((prev) => ({ ...prev, selectedRoute: route }));
      handlers?.onRouteClick?.(route);
    },
    [handlers]
  );

  // 스탬프 수집
  const collectStamp = useCallback(
    (stampId: string) => {
      setMapState((prev) => ({
        ...prev,
        collectedStamps: [
          ...prev.collectedStamps,
          {
            id: stampId,
            locationId: '',
            name: '',
            description: '',
            icon: '',
            isCollected: true,
          },
        ],
      }));
      handlers?.onStampCollected?.(stampId);
    },
    [handlers]
  );

  // 에러 처리
  const setError = useCallback((error: string) => {
    setMapState((prev) => ({ ...prev, error }));
  }, []);

  // 지도 인스턴스 가져오기
  const getMapInstance = useCallback(() => {
    return mapInstanceRef.current;
  }, []);

  // 현재 지도 상태 가져오기
  const getCurrentState = useCallback(() => {
    if (!mapInstanceRef.current) return null;

    const center = mapInstanceRef.current.getCenter();
    const level = mapInstanceRef.current.getLevel();
    const bounds = mapInstanceRef.current.getBounds();

    return {
      center: { lat: center.getLat(), lng: center.getLng() },
      level,
      bounds,
    };
  }, []);

  return {
    mapState,
    initializeMap,
    setCenter,
    setZoom,
    fitBounds,
    selectMarker,
    selectRoute,
    collectStamp,
    setError,
    getMapInstance,
    getCurrentState,
  };
}
