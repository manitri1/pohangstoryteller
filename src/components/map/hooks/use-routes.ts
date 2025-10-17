'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Route, Coordinate } from '../types';

// Kakao Maps API 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

// Kakao Maps API 로드 상태 확인
const useKakaoMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkKakaoMaps = () => {
      if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
        setIsLoaded(true);
      } else {
        setIsLoaded(false);
      }
    };

    checkKakaoMaps();

    // 주기적으로 체크 (API 로드 완료까지)
    const interval = setInterval(checkKakaoMaps, 100);

    // 5초 후에는 체크 중단
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return isLoaded;
};

/**
 * 🛣️ 경로 관리 훅
 * 지도상의 경로들을 생성, 업데이트, 삭제하는 기능을 제공합니다.
 */
export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [kakaoPolylines, setKakaoPolylines] = useState<any[]>([]);
  const mapInstanceRef = useRef<any>(null);
  const isKakaoMapsLoaded = useKakaoMaps();

  // 경로 생성
  const createRoute = useCallback((routeData: Omit<Route, 'id'>): Route => {
    const route: Route = {
      id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...routeData,
    };
    return route;
  }, []);

  // 좌표 배열에서 경로 생성
  const createRouteFromCoordinates = useCallback(
    (
      waypoints: Coordinate[],
      name: string,
      options?: Partial<Route>
    ): Route => {
      return createRoute({
        name,
        waypoints,
        color: options?.color || '#3B82F6',
        strokeWeight: options?.strokeWeight || 3,
        strokeOpacity: options?.strokeOpacity || 0.8,
        isMainRoute: options?.isMainRoute || false,
      });
    },
    [createRoute]
  );

  // 경로 추가
  const addRoute = useCallback((route: Route) => {
    setRoutes((prev) => [...prev, route]);
  }, []);

  // 경로들 추가
  const addRoutes = useCallback((newRoutes: Route[]) => {
    setRoutes((prev) => [...prev, ...newRoutes]);
  }, []);

  // 경로 업데이트
  const updateRoute = useCallback(
    (routeId: string, updates: Partial<Route>) => {
      setRoutes((prev) =>
        prev.map((route) =>
          route.id === routeId ? { ...route, ...updates } : route
        )
      );
    },
    []
  );

  // 경로 삭제
  const removeRoute = useCallback((routeId: string) => {
    setRoutes((prev) => prev.filter((route) => route.id !== routeId));
  }, []);

  // 모든 경로 삭제
  const clearRoutes = useCallback(() => {
    setRoutes([]);
  }, []);

  // 카카오맵 폴리라인 생성
  const createKakaoPolyline = useCallback(
    (route: Route) => {
      if (
        !mapInstanceRef.current ||
        !isKakaoMapsLoaded ||
        typeof window === 'undefined' ||
        !window.kakao ||
        !window.kakao.maps
      )
        return null;

      const path = route.waypoints.map(
        (point) => new window.kakao.maps.LatLng(point.lat, point.lng)
      );

      const polyline = new window.kakao.maps.Polyline({
        path,
        strokeWeight: route.strokeWeight || 3,
        strokeColor: route.color || '#3B82F6',
        strokeOpacity: route.strokeOpacity || 0.8,
        strokeStyle: 'solid',
      });

      // 폴리라인 클릭 이벤트
      window.kakao.maps.event.addListener(polyline, 'click', () => {
        console.log('경로 클릭:', route);
      });

      return polyline;
    },
    [isKakaoMapsLoaded]
  );

  // 카카오맵에 경로 표시
  const showRoutesOnMap = useCallback(
    (mapInstance: any) => {
      if (!mapInstance || !isKakaoMapsLoaded) return;

      mapInstanceRef.current = mapInstance;

      // 기존 폴리라인들 제거
      kakaoPolylines.forEach((polyline) => polyline.setMap(null));
      setKakaoPolylines([]);

      // 새 폴리라인들 생성 및 표시
      const newKakaoPolylines = routes
        .map((route) => createKakaoPolyline(route))
        .filter((polyline) => polyline !== null);

      newKakaoPolylines.forEach((polyline) => {
        polyline.setMap(mapInstance);
      });

      setKakaoPolylines(newKakaoPolylines);
    },
    [routes, createKakaoPolyline, kakaoPolylines, isKakaoMapsLoaded]
  );

  // 경로 색상 변경
  const setRouteColor = useCallback(
    (routeId: string, color: string) => {
      updateRoute(routeId, { color });
    },
    [updateRoute]
  );

  // 경로 두께 변경
  const setRouteWeight = useCallback(
    (routeId: string, weight: number) => {
      updateRoute(routeId, { strokeWeight: weight });
    },
    [updateRoute]
  );

  // 경로 투명도 변경
  const setRouteOpacity = useCallback(
    (routeId: string, opacity: number) => {
      updateRoute(routeId, { strokeOpacity: opacity });
    },
    [updateRoute]
  );

  // 메인 경로 설정
  const setMainRoute = useCallback((routeId: string) => {
    setRoutes((prev) =>
      prev.map((route) => ({
        ...route,
        isMainRoute: route.id === routeId,
      }))
    );
  }, []);

  // 경로 거리 계산
  const calculateRouteDistance = useCallback((route: Route): number => {
    if (route.waypoints.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < route.waypoints.length - 1; i++) {
      const point1 = route.waypoints[i];
      const point2 = route.waypoints[i + 1];

      // 하버사인 공식을 사용한 거리 계산 (km)
      const R = 6371; // 지구 반지름 (km)
      const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
      const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((point1.lat * Math.PI) / 180) *
          Math.cos((point2.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      totalDistance += distance;
    }

    return totalDistance;
  }, []);

  // 경로 예상 시간 계산 (도보 기준)
  const calculateRouteTime = useCallback(
    (route: Route): number => {
      const distance = calculateRouteDistance(route);
      const walkingSpeed = 4; // km/h
      return Math.round((distance / walkingSpeed) * 60); // 분 단위
    },
    [calculateRouteDistance]
  );

  // 경로 최적화 (TSP 근사 알고리즘)
  const optimizeRoute = useCallback((waypoints: Coordinate[]): Coordinate[] => {
    if (waypoints.length <= 2) return waypoints;

    // 간단한 최근접 이웃 알고리즘
    const optimized: Coordinate[] = [waypoints[0]];
    const remaining = [...waypoints.slice(1)];

    while (remaining.length > 0) {
      const lastPoint = optimized[optimized.length - 1];
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const distance = Math.sqrt(
          Math.pow(remaining[i].lat - lastPoint.lat, 2) +
            Math.pow(remaining[i].lng - lastPoint.lng, 2)
        );

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      optimized.push(remaining[nearestIndex]);
      remaining.splice(nearestIndex, 1);
    }

    return optimized;
  }, []);

  // 경로 필터링
  const filterRoutes = useCallback(
    (predicate: (route: Route) => boolean) => {
      return routes.filter(predicate);
    },
    [routes]
  );

  // 경로 검색
  const searchRoutes = useCallback(
    (query: string) => {
      return routes.filter((route) =>
        route.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    [routes]
  );

  // 경로 통계
  const getRouteStats = useCallback(() => {
    const total = routes.length;
    const totalDistance = routes.reduce(
      (sum, route) => sum + calculateRouteDistance(route),
      0
    );
    const totalTime = routes.reduce(
      (sum, route) => sum + calculateRouteTime(route),
      0
    );
    const mainRoutes = routes.filter((route) => route.isMainRoute).length;

    return {
      total,
      totalDistance,
      totalTime,
      mainRoutes,
      averageDistance: total > 0 ? totalDistance / total : 0,
      averageTime: total > 0 ? totalTime / total : 0,
    };
  }, [routes, calculateRouteDistance, calculateRouteTime]);

  return {
    routes,
    addRoute,
    addRoutes,
    updateRoute,
    removeRoute,
    clearRoutes,
    setRouteColor,
    setRouteWeight,
    setRouteOpacity,
    setMainRoute,
    createRoute,
    createRouteFromCoordinates,
    showRoutesOnMap,
    calculateRouteDistance,
    calculateRouteTime,
    optimizeRoute,
    filterRoutes,
    searchRoutes,
    getRouteStats,
    isKakaoMapsLoaded,
  };
}
