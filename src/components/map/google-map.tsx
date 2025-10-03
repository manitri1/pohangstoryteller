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

interface GoogleMapProps {
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
    google: any;
    initGoogleMap: () => void;
    googleMapsLoadPromise?: Promise<void>;
  }
}

export function GoogleMap({
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
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routesRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<'script' | 'init' | 'tiles'>(
    'script'
  );
  const [retryCount, setRetryCount] = useState(0);

  // 지도 초기화
  const initializeMap = useCallback(() => {
    console.log('Google Maps 초기화 시작');

    if (!mapRef.current || !window.google) {
      console.error('Google Maps 초기화 실패: 필수 객체가 없습니다');
      setError('Google Maps API가 로드되지 않았습니다.');
      return;
    }

    try {
      const mapOptions = {
        center: { lat: center.lat, lng: center.lng },
        zoom: level,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
      };

      console.log('Google Maps 인스턴스 생성 시작');
      mapInstanceRef.current = new window.google.maps.Map(
        mapRef.current,
        mapOptions
      );

      // 지도 로드 완료 이벤트
      window.google.maps.event.addListener(
        mapInstanceRef.current,
        'tilesloaded',
        () => {
          console.log('Google Maps 타일 로드 완료');
          setLoadingStep('tiles');
          setIsLoaded(true);
          setError(null);
        }
      );

      // 이벤트 리스너 등록
      if (onMapClick) {
        window.google.maps.event.addListener(
          mapInstanceRef.current,
          'click',
          onMapClick
        );
      }

      if (onBoundsChanged) {
        window.google.maps.event.addListener(
          mapInstanceRef.current,
          'bounds_changed',
          () => {
            const bounds = mapInstanceRef.current.getBounds();
            onBoundsChanged({
              sw: {
                lat: bounds.getSouthWest().lat(),
                lng: bounds.getSouthWest().lng(),
              },
              ne: {
                lat: bounds.getNorthEast().lat(),
                lng: bounds.getNorthEast().lng(),
              },
            });
          }
        );
      }

      if (onZoomChanged) {
        window.google.maps.event.addListener(
          mapInstanceRef.current,
          'zoom_changed',
          () => {
            onZoomChanged(mapInstanceRef.current.getZoom());
          }
        );
      }

      console.log('Google Maps 초기화 완료');
    } catch (err) {
      console.error('Google Maps 초기화 실패:', err);
      setError('Google Maps 초기화에 실패했습니다.');
    }
  }, [center, level, onMapClick, onBoundsChanged, onZoomChanged]);

  // Google Maps API 로드 (최적화된 버전)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const loadGoogleMaps = async () => {
      // 이미 로드된 경우 즉시 초기화
      if (window.google && window.google.maps) {
        console.log('Google Maps API 이미 로드됨, 즉시 초기화');
        setLoadingStep('init');
        initializeMap();
        return;
      }

      // 이미 로딩 중인 경우 Promise 대기
      if (window.googleMapsLoadPromise) {
        console.log('Google Maps API 로딩 중, Promise 대기');
        try {
          await window.googleMapsLoadPromise;
          setLoadingStep('init');
          initializeMap();
        } catch (error) {
          console.error('Google Maps API 로드 실패:', error);
          setError('Google Maps API 로드에 실패했습니다.');
        }
        return;
      }

      // 기존 스크립트 확인
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );

      if (existingScript) {
        console.log('기존 Google Maps 스크립트 발견, 로드 대기');

        // Promise로 로딩 상태 관리
        window.googleMapsLoadPromise = new Promise((resolve, reject) => {
          let checkCount = 0;
          const maxChecks = 30; // 최대 3초 (30 * 100ms)

          const checkGoogle = () => {
            checkCount++;
            if (window.google && window.google.maps) {
              console.log('Google Maps 객체 확인됨');
              resolve();
            } else if (checkCount < maxChecks) {
              setTimeout(checkGoogle, 100);
            } else {
              console.error('Google Maps 객체 로드 타임아웃');
              reject(new Error('Google Maps API 로드 타임아웃'));
            }
          };

          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkGoogle);
          } else {
            checkGoogle();
          }
        });

        try {
          await window.googleMapsLoadPromise;
          setLoadingStep('init');
          initializeMap();
        } catch (error) {
          if (retryCount < 2) {
            console.log(`Google Maps API 로드 재시도 ${retryCount + 1}/2`);
            setRetryCount((prev) => prev + 1);
            setTimeout(() => {
              window.googleMapsLoadPromise = undefined;
              loadGoogleMaps();
            }, 1000);
          } else {
            setError('Google Maps API 로드가 시간 초과되었습니다.');
          }
        }
        return;
      }

      // 새로운 스크립트 로딩
      console.log('Google Maps API 새로 로드 시작');

      window.googleMapsLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&libraries=geometry&callback=initGoogleMap`;
        script.async = true;
        script.defer = true;

        // 글로벌 콜백 함수 설정
        window.initGoogleMap = () => {
          console.log('Google Maps API 로드 완료 (콜백)');
          clearTimeout(timeoutId);
          resolve();
        };

        // 타임아웃 설정 (5초로 단축)
        timeoutId = setTimeout(() => {
          console.error('Google Maps API 로드 타임아웃');
          reject(new Error('Google Maps API 로드 타임아웃'));
        }, 5000);

        script.onerror = (error) => {
          console.error('Google Maps 스크립트 로드 실패:', error);
          clearTimeout(timeoutId);
          reject(new Error('Google Maps API 로드 실패'));
        };

        document.head.appendChild(script);
      });

      try {
        await window.googleMapsLoadPromise;
        setLoadingStep('init');
        initializeMap();
      } catch (error) {
        console.error('Google Maps API 로드 실패:', error);
        if (retryCount < 2) {
          console.log(`Google Maps API 로드 재시도 ${retryCount + 1}/2`);
          setRetryCount((prev) => prev + 1);
          setTimeout(() => {
            window.googleMapsLoadPromise = undefined;
            loadGoogleMaps();
          }, 1000);
        } else {
          setError(`Google Maps API 로드에 실패했습니다.
          - API 키: ${config.googleMapsApiKey ? '설정됨' : '없음'}
          - 네트워크 연결을 확인해주세요
          - Google Cloud Console에서 API 키를 확인해주세요`);
        }
      }
    };

    loadGoogleMaps();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [initializeMap, retryCount]);

  // 마커 메모이제이션
  const memoizedMarkers = useMemo(() => markers, [markers]);

  // 마커 업데이트
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 추가
    const newMarkers = memoizedMarkers.map((marker) => {
      const position = { lat: marker.position.lat, lng: marker.position.lng };

      const googleMarker = new window.google.maps.Marker({
        position: position,
        title: marker.title,
        map: mapInstanceRef.current,
      });

      // 마커 클릭 이벤트
      if (onMarkerClick) {
        googleMarker.addListener('click', () => {
          onMarkerClick(marker);
        });
      }

      return googleMarker;
    });

    markersRef.current = newMarkers;
  }, [memoizedMarkers, isLoaded, onMarkerClick]);

  // 경로 메모이제이션
  const memoizedRoutes = useMemo(() => routes, [routes]);

  // 경로 업데이트
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // 기존 경로 제거
    routesRef.current.forEach((route) => route.setMap(null));
    routesRef.current = [];

    // 새 경로 추가
    const newRoutes = memoizedRoutes.map((route) => {
      const path = route.waypoints.map((point) => ({
        lat: point.lat,
        lng: point.lng,
      }));

      const polyline = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: route.color || '#FF0000',
        strokeOpacity: route.strokeOpacity || 0.7,
        strokeWeight: route.strokeWeight || 5,
        map: mapInstanceRef.current,
      });

      return polyline;
    });

    routesRef.current = newRoutes;
  }, [memoizedRoutes, isLoaded]);

  // 지도 중심점 업데이트
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    mapInstanceRef.current.setCenter({ lat: center.lat, lng: center.lng });
    mapInstanceRef.current.setZoom(level);
  }, [center, level, isLoaded]);

  // 로딩 UI (개선된 버전)
  const renderLoadingMap = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-300 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-transparent to-indigo-100 animate-pulse"></div>

      <div className="text-center p-6 relative z-10">
        <div className="relative mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500 mx-auto"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-300 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Google Maps를 불러오는 중...
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Google Maps API를 로드하고 있습니다
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
          <p>• Google Maps는 안정적이고 빠릅니다</p>
          <p>• 무료 크레딧이 제공됩니다</p>
        </div>

        {/* 로딩 시간 표시 */}
        <div className="mt-2 text-xs text-gray-400">
          <p>로딩 시간이 오래 걸리면 새로고침을 시도해주세요</p>
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
              Google Maps를 불러올 수 없습니다
            </h3>
            <p className="text-sm text-gray-600 mb-2">{error}</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Google Maps API 키를 확인해주세요</p>
              <p>• 네트워크 연결을 확인해주세요</p>
              <p>• 잠시 후 다시 시도해주세요</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              새로고침
            </button>
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
