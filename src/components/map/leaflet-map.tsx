'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { config } from '@/lib/config';
import {
  MapCenter,
  MapMarker,
  MapRoute,
  MapOptions,
  MapEventHandlers,
} from '@/types/map';

interface LeafletMapProps {
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
    L: any;
  }
}

export function LeafletMap({
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
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routesRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<'script' | 'init' | 'tiles'>(
    'script'
  );

  // 지도 초기화
  const initializeMap = useCallback(() => {
    console.log('Leaflet 지도 초기화 시작');

    if (!mapRef.current || !window.L) {
      console.error('Leaflet 지도 초기화 실패: 필수 객체가 없습니다');
      setError('Leaflet API가 로드되지 않았습니다.');
      return;
    }

    try {
      // 지도 생성
      mapInstanceRef.current = window.L.map(mapRef.current, {
        center: [center.lat, center.lng],
        zoom: level,
        zoomControl: true,
        attributionControl: true,
      });

      // 타일 레이어 추가 (OpenStreetMap)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // 지도 로드 완료 이벤트
      mapInstanceRef.current.whenReady(() => {
        console.log('Leaflet 지도 로드 완료');
        setLoadingStep('tiles');
        setIsLoaded(true);
        setError(null);
      });

      // 이벤트 리스너 등록
      if (onMapClick) {
        mapInstanceRef.current.on('click', onMapClick);
      }

      if (onBoundsChanged) {
        mapInstanceRef.current.on('moveend', () => {
          const bounds = mapInstanceRef.current.getBounds();
          onBoundsChanged({
            sw: {
              lat: bounds.getSouthWest().lat,
              lng: bounds.getSouthWest().lng,
            },
            ne: {
              lat: bounds.getNorthEast().lat,
              lng: bounds.getNorthEast().lng,
            },
          });
        });
      }

      if (onZoomChanged) {
        mapInstanceRef.current.on('zoomend', () => {
          onZoomChanged(mapInstanceRef.current.getZoom());
        });
      }

      console.log('Leaflet 지도 초기화 완료');
    } catch (err) {
      console.error('Leaflet 지도 초기화 실패:', err);
      setError('Leaflet 지도 초기화에 실패했습니다.');
    }
  }, [center, level, onMapClick, onBoundsChanged, onZoomChanged]);

  // Leaflet API 로드
  useEffect(() => {
    const loadLeaflet = () => {
      if (window.L) {
        console.log('Leaflet API 이미 로드됨, 즉시 초기화');
        setLoadingStep('init');
        initializeMap();
        return;
      }

      // 기존 스크립트 확인
      const existingScript = document.querySelector(
        'script[src*="leafletjs.com"]'
      );

      if (existingScript) {
        console.log('기존 Leaflet 스크립트 발견, 로드 대기');
        const checkLeaflet = () => {
          if (window.L) {
            console.log('Leaflet 객체 확인됨');
            setLoadingStep('init');
            initializeMap();
          } else {
            setTimeout(checkLeaflet, 100);
          }
        };

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', checkLeaflet);
        } else {
          checkLeaflet();
        }
        return;
      }

      // CSS 로드
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);

      // JavaScript 로드
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = 'anonymous';
      script.async = true;
      script.defer = true;

      console.log('Leaflet API 로드 시작');

      script.onload = () => {
        console.log('Leaflet 스크립트 로드 완료');
        setLoadingStep('init');
        initializeMap();
      };

      script.onerror = (error) => {
        console.error('Leaflet 스크립트 로드 실패:', error);
        setError('Leaflet API 로드에 실패했습니다.');
      };

      document.head.appendChild(script);
    };

    loadLeaflet();
  }, [initializeMap]);

  // 마커 메모이제이션
  const memoizedMarkers = useMemo(() => markers, [markers]);

  // 마커 업데이트
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) =>
      mapInstanceRef.current.removeLayer(marker)
    );
    markersRef.current = [];

    // 새 마커 추가
    const newMarkers = memoizedMarkers.map((marker) => {
      const leafletMarker = window.L.marker([
        marker.position.lat,
        marker.position.lng,
      ])
        .addTo(mapInstanceRef.current)
        .bindPopup(marker.title);

      // 마커 클릭 이벤트
      if (onMarkerClick) {
        leafletMarker.on('click', () => {
          onMarkerClick(marker);
        });
      }

      return leafletMarker;
    });

    markersRef.current = newMarkers;
  }, [memoizedMarkers, isLoaded, onMarkerClick]);

  // 경로 메모이제이션
  const memoizedRoutes = useMemo(() => routes, [routes]);

  // 경로 업데이트
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // 기존 경로 제거
    routesRef.current.forEach((route) =>
      mapInstanceRef.current.removeLayer(route)
    );
    routesRef.current = [];

    // 새 경로 추가
    const newRoutes = memoizedRoutes.map((route) => {
      const path = route.waypoints.map((point) => [point.lat, point.lng]);

      const polyline = window.L.polyline(path, {
        color: route.color || '#FF0000',
        weight: route.strokeWeight || 5,
        opacity: route.strokeOpacity || 0.7,
      }).addTo(mapInstanceRef.current);

      return polyline;
    });

    routesRef.current = newRoutes;
  }, [memoizedRoutes, isLoaded]);

  // 지도 중심점 업데이트
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    mapInstanceRef.current.setView([center.lat, center.lng], level);
  }, [center, level, isLoaded]);

  // 로딩 UI
  const renderLoadingMap = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 border border-gray-300 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-transparent to-emerald-100 animate-pulse"></div>

      <div className="text-center p-6 relative z-10">
        <div className="relative mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-500 mx-auto"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-300 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          OpenStreetMap을 불러오는 중...
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Leaflet API를 로드하고 있습니다
        </p>

        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                loadingStep === 'script'
                  ? 'bg-green-500 animate-pulse'
                  : loadingStep === 'init' || loadingStep === 'tiles'
                    ? 'bg-green-500'
                    : 'bg-gray-300'
              }`}
            ></div>
            <span>API 스크립트 로드</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                loadingStep === 'init'
                  ? 'bg-blue-500 animate-pulse'
                  : loadingStep === 'tiles'
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
              }`}
            ></div>
            <span>지도 초기화</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                loadingStep === 'tiles'
                  ? 'bg-green-500 animate-pulse'
                  : 'bg-gray-300'
              }`}
            ></div>
            <span>타일 로드</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          <p>• OpenStreetMap은 완전 무료입니다</p>
          <p>• 오픈소스로 커스터마이징이 자유롭습니다</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`w-full h-full ${className}`} style={style}>
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg">
          <div className="text-center p-6">
            <div className="text-yellow-500 mb-4 text-4xl">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              OpenStreetMap을 불러올 수 없습니다
            </h3>
            <p className="text-sm text-gray-600 mb-2">{error}</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• 네트워크 연결을 확인해주세요</p>
              <p>• 잠시 후 다시 시도해주세요</p>
            </div>
          </div>
        </div>
      ) : !isLoaded ? (
        renderLoadingMap()
      ) : (
        <div ref={mapRef} className="w-full h-full" />
      )}
    </div>
  );
}
