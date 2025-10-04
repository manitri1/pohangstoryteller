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
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<'script' | 'init' | 'tiles'>(
    'script'
  );
  const [isInitializing, setIsInitializing] = useState(false);

  // 지도 초기화 (최적화된 버전)
  const initializeMap = useCallback(() => {
    console.log('지도 초기화 시작');

    // 이미 초기화된 경우 중복 실행 방지
    if (mapInstanceRef.current || isInitializing) {
      console.log('지도가 이미 초기화됨 또는 초기화 중, 중복 실행 방지');
      return;
    }

    setIsInitializing(true);

    // DOM이 준비될 때까지 대기
    const checkDOMAndInitialize = () => {
      if (!mapRef.current) {
        console.log('DOM이 아직 준비되지 않음, 100ms 후 재시도');
        setTimeout(checkDOMAndInitialize, 100);
        return;
      }

      console.log('DOM 준비 완료, 지도 초기화 진행');
      
      // 필수 객체 검증 강화
      if (!mapRef.current) {
        console.error('지도 초기화 실패: mapRef.current가 없습니다');
        setError('지도 컨테이너를 찾을 수 없습니다.');
        setIsInitializing(false);
        return;
      }

      if (!window.kakao) {
        console.error('지도 초기화 실패: window.kakao가 없습니다');
        setError('카카오맵 API가 로드되지 않았습니다.');
        setIsInitializing(false);
        return;
      }

      if (!window.kakao.maps) {
        console.error('지도 초기화 실패: window.kakao.maps가 없습니다');
        setError('카카오맵 API가 완전히 로드되지 않았습니다.');
        setIsInitializing(false);
        return;
      }

      console.log('필수 객체 검증 완료:', {
        mapRef: !!mapRef.current,
        kakao: !!window.kakao,
        maps: !!window.kakao.maps,
      });

      try {
        // 지도 옵션 최적화 (불필요한 로그 제거)
        const mapOption = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: level,
          // 성능 최적화 옵션 추가
          draggable: true,
          scrollwheel: true,
          disableDoubleClick: false,
          disableDoubleClickZoom: false,
          projectionId: 'kakao.maps.ProjectionId.WCONG',
        };

        console.log('지도 인스턴스 생성 시작');
        mapInstanceRef.current = new window.kakao.maps.Map(
          mapRef.current,
          mapOption
        );

      // 지도 로드 완료 이벤트 대기 (개선된 버전)
      let tilesLoaded = false;

      const handleTilesLoaded = () => {
        if (!tilesLoaded) {
          tilesLoaded = true;
          console.log('지도 타일 로드 완료');
          setLoadingStep('tiles');
          setIsLoaded(true);
          setError(null);
          setIsInitializing(false); // 초기화 완료
        }
      };

      // tilesloaded 이벤트 리스너 등록
      window.kakao.maps.event.addListener(
        mapInstanceRef.current,
        'tilesloaded',
        handleTilesLoaded
      );

      // 대안: 일정 시간 후 강제로 로드 완료 처리
      setTimeout(() => {
        if (!tilesLoaded) {
          console.log('타일 로드 타임아웃, 강제 완료 처리');
          handleTilesLoaded();
        }
      }, 3000); // 3초 후 강제 완료

      // 추가 대안: 지도 인스턴스 생성 직후 즉시 완료 처리
      setTimeout(() => {
        if (!tilesLoaded) {
          console.log('지도 인스턴스 생성 완료, 즉시 완료 처리');
          handleTilesLoaded();
        }
      }, 1000); // 1초 후 즉시 완료

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
    } catch (err) {
      console.error('지도 초기화 실패:', err);
      setIsInitializing(false); // 초기화 실패 시 상태 리셋

      // 서비스 비활성화 오류 감지
      if (err && typeof err === 'object' && 'message' in err) {
        const errorMessage = (err as any).message;
        if (
          errorMessage.includes('disabled') &&
          errorMessage.includes('OPEN_MAP_AND_LOCAL')
        ) {
          setError(
            '카카오맵 웹 지도 서비스가 비활성화되어 있습니다. 카카오 개발자 콘솔에서 서비스를 활성화해주세요.'
          );
          return;
        }
      }

        setError('지도 초기화에 실패했습니다.');
      }
    };

    // DOM이 준비될 때까지 대기 후 초기화 실행
    checkDOMAndInitialize();
  }, [
    center,
    level,
    onMapClick,
    onBoundsChanged,
    onZoomChanged,
    isInitializing,
  ]);

  // Kakao Map API 로드
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const loadKakaoMap = () => {
      // 이미 로드된 경우 즉시 초기화
      if (window.kakao && window.kakao.maps) {
        console.log('카카오맵 API 이미 로드됨, 즉시 초기화');
        initializeMap();
        return;
      }

      // HTML head에 이미 스크립트가 있는지 확인
      const existingScript = document.querySelector(
        'script[src*="dapi.kakao.com"]'
      );

      if (existingScript) {
        console.log('기존 스크립트 발견, 로드 대기');
        // 스크립트 로드 완료 대기 (개선된 버전)
        let checkCount = 0;
        const maxChecks = 50; // 최대 5초 (50 * 100ms)

        const checkKakao = () => {
          checkCount++;

          if (window.kakao && window.kakao.maps) {
            console.log('카카오 객체 확인됨');
            setLoadingStep('init');
            window.kakao.maps.load(() => {
              console.log('카카오맵 초기화 시작');
              initializeMap();
            });
          } else if (checkCount < maxChecks) {
            // 100ms 후 다시 확인
            setTimeout(checkKakao, 100);
          } else {
            console.error('카카오 객체 로드 타임아웃');
            setError(
              '카카오맵 API 로드가 시간 초과되었습니다. 페이지를 새로고침해주세요.'
            );
          }
        };

        // DOM 로드 완료 후 확인
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', checkKakao);
        } else {
          checkKakao();
        }
        return;
      }

      // 스크립트가 없는 경우 동적 로딩 (fallback)
      console.log('스크립트가 없어서 동적 로딩 시도');
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${config.kakaoMapApiKey}&autoload=false`;
      script.async = true;
      script.defer = true;

      console.log('카카오맵 API 로드 시작:', config.kakaoMapApiKey);

      // 타임아웃 설정 (8초)
      timeoutId = setTimeout(() => {
        console.error('카카오맵 API 로드 타임아웃');
        setError(
          '카카오맵 API 로드가 시간 초과되었습니다. CORS 정책 문제일 수 있습니다.'
        );
      }, 8000);

      script.onload = () => {
        console.log('스크립트 로드 완료');
        clearTimeout(timeoutId);

        if (window.kakao && window.kakao.maps) {
          console.log('카카오 객체 확인됨');
          window.kakao.maps.load(() => {
            console.log('카카오맵 초기화 시작');
            initializeMap();
          });
        } else {
          console.error('카카오 객체가 없습니다:', window.kakao);
          setError('카카오맵 API가 로드되지 않았습니다.');
        }
      };

      script.onerror = (error) => {
        console.error('스크립트 로드 실패:', error);
        console.error('API 키:', config.kakaoMapApiKey);
        console.error('스크립트 URL:', script.src);
        clearTimeout(timeoutId);
        setError(`카카오맵 API 로드에 실패했습니다. 
        - CORS 정책 문제일 수 있습니다
        - API 키: ${config.kakaoMapApiKey}
        - 네트워크 연결을 확인해주세요
        - 브라우저 개발자 도구의 Network 탭에서 오류를 확인해주세요`);
      };

      document.head.appendChild(script);
    };

    loadKakaoMap();

    // 클린업 함수
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [initializeMap]);

  // 마커 메모이제이션
  const memoizedMarkers = useMemo(() => markers, [markers]);

  // 마커 업데이트 (최적화된 버전)
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // 기존 마커 제거 (배치 처리)
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 추가 (배치 처리)
    const newMarkers = memoizedMarkers.map((marker) => {
      const position = new window.kakao.maps.LatLng(
        marker.position.lat,
        marker.position.lng
      );

      // 마커 이미지 설정 (캐싱)
      let markerImage;
      if (marker.image) {
        const imageSize = new window.kakao.maps.Size(24, 35);
        markerImage = new window.kakao.maps.MarkerImage(
          marker.image,
          imageSize
        );
      }

      const kakaoMarker = new window.kakao.maps.Marker({
        position: position,
        image: markerImage,
        title: marker.title,
      });

      // 마커 클릭 이벤트
      if (onMarkerClick) {
        window.kakao.maps.event.addListener(kakaoMarker, 'click', () => {
          onMarkerClick(marker);
        });
      }

      return kakaoMarker;
    });

    // 모든 마커를 한 번에 지도에 추가
    newMarkers.forEach((marker) => {
      marker.setMap(mapInstanceRef.current);
      markersRef.current.push(marker);
    });
  }, [memoizedMarkers, isLoaded, onMarkerClick]);

  // 경로 메모이제이션
  const memoizedRoutes = useMemo(() => routes, [routes]);

  // 경로 업데이트 (최적화된 버전)
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    // 기존 경로 제거 (배치 처리)
    routesRef.current.forEach((route) => route.setMap(null));
    routesRef.current = [];

    // 새 경로 추가 (배치 처리)
    const newRoutes = memoizedRoutes.map((route) => {
      const polyline = new window.kakao.maps.Polyline({
        path: route.waypoints.map(
          (point) => new window.kakao.maps.LatLng(point.lat, point.lng)
        ),
        strokeWeight: route.strokeWeight || 5,
        strokeColor: route.color || '#FF0000',
        strokeOpacity: route.strokeOpacity || 0.7,
        strokeStyle: 'solid',
      });

      return polyline;
    });

    // 모든 경로를 한 번에 지도에 추가
    newRoutes.forEach((route) => {
      route.setMap(mapInstanceRef.current);
      routesRef.current.push(route);
    });
  }, [memoizedRoutes, isLoaded]);

  // 지도 중심점 업데이트
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    const moveLatLon = new window.kakao.maps.LatLng(center.lat, center.lng);
    mapInstanceRef.current.setCenter(moveLatLon);
    mapInstanceRef.current.setLevel(level);
  }, [center, level, isLoaded]);

  // 개발용 지도 컴포넌트 (서비스 비활성화 시)
  const renderDevMap = () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 border border-gray-300 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="text-yellow-500 mb-4 text-6xl">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            카카오맵 서비스 비활성화
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            카카오 개발자 콘솔에서 웹 지도 서비스를 활성화해주세요
          </p>

          {/* 해결 방법 안내 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
            <h4 className="font-semibold text-yellow-800 mb-2">해결 방법:</h4>
            <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
              <li>카카오 개발자 콘솔 접속</li>
              <li>내 애플리케이션 → 포항 스토리 텔러 선택</li>
              <li>제품 설정 → 카카오맵 → 웹 지도 서비스 활성화</li>
              <li>도메인 등록 (localhost:3000)</li>
            </ol>
          </div>

          {/* 마커 위치 표시 */}
          {markers.length > 0 && (
            <div className="space-y-2 text-xs text-gray-500">
              <p className="font-semibold text-gray-700">마커 위치:</p>
              {markers.map((marker, index) => (
                <div
                  key={marker.id}
                  className="flex items-center gap-2 bg-white p-2 rounded border"
                >
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">{marker.title}</span>
                  <span className="text-gray-400">
                    ({marker.position.lat.toFixed(4)},{' '}
                    {marker.position.lng.toFixed(4)})
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-xs text-gray-400">
            <p>• 서비스 활성화 후 페이지를 새로고침하세요</p>
            <p>• 개발자 콘솔에서 API 로딩 상태를 확인할 수 있습니다</p>
          </div>
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
              지도를 불러올 수 없습니다
            </h3>
            <p className="text-sm text-gray-600 mb-2">{error}</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• 카카오맵 API 키를 확인해주세요</p>
              <p>• 네트워크 연결을 확인해주세요</p>
              <p>• 잠시 후 다시 시도해주세요</p>
            </div>
          </div>
        </div>
      ) : !isLoaded ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-300 rounded-lg relative overflow-hidden">
          {/* 배경 애니메이션 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-transparent to-indigo-100 animate-pulse"></div>

          <div className="text-center p-6 relative z-10">
            {/* 개선된 로딩 애니메이션 */}
            <div className="relative mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500 mx-auto"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-300 animate-spin"
                style={{
                  animationDirection: 'reverse',
                  animationDuration: '1.5s',
                }}
              ></div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              지도를 불러오는 중...
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              카카오맵 API를 로드하고 있습니다
            </p>

            {/* 진행 단계 표시 (실시간 업데이트) */}
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
              <p>• 첫 로드 시 시간이 다소 걸릴 수 있습니다</p>
              <p>• 네트워크 상태를 확인해주세요</p>
            </div>
          </div>
        </div>
      ) : error && error.includes('서비스가 비활성화') ? (
        renderDevMap()
      ) : config.kakaoMapApiKey === 'test_key_for_development' ? (
        renderDevMap()
      ) : (
        <div ref={mapRef} className="w-full h-full" />
      )}
    </div>
  );
}
