'use client';

import React, { useEffect, useRef } from 'react';
import { Route } from '../types';

/**
 * 🛣️ 지도 경로 컴포넌트
 * 개별 경로의 표시와 상호작용을 담당합니다.
 */
interface MapRouteProps {
  route: Route;
  mapInstance?: any;
  onClick?: (route: Route) => void;
  className?: string;
}

export function MapRoute({
  route,
  mapInstance,
  onClick,
  className = '',
}: MapRouteProps) {
  const polylineRef = useRef<any>(null);

  // 카카오맵 폴리라인 생성
  useEffect(() => {
    if (!mapInstance || !window.kakao || route.waypoints.length < 2) return;

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
      onClick?.(route);
    });

    // 지도에 폴리라인 표시
    polyline.setMap(mapInstance);
    polylineRef.current = polyline;

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [route, mapInstance, onClick]);

  // 경로 색상 업데이트
  useEffect(() => {
    if (polylineRef.current) {
      polylineRef.current.setOptions({
        strokeColor: route.color || '#3B82F6',
      });
    }
  }, [route.color]);

  // 경로 두께 업데이트
  useEffect(() => {
    if (polylineRef.current) {
      polylineRef.current.setOptions({
        strokeWeight: route.strokeWeight || 3,
      });
    }
  }, [route.strokeWeight]);

  // 경로 투명도 업데이트
  useEffect(() => {
    if (polylineRef.current) {
      polylineRef.current.setOptions({
        strokeOpacity: route.strokeOpacity || 0.8,
      });
    }
  }, [route.strokeOpacity]);

  return null; // 이 컴포넌트는 DOM 요소를 직접 렌더링하지 않음
}

/**
 * 🛣️ 경로 정보 컴포넌트
 * 경로의 상세 정보를 표시합니다.
 */
interface RouteInfoProps {
  route: Route;
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

export function RouteInfo({
  route,
  isVisible,
  onClose,
  className = '',
}: RouteInfoProps) {
  if (!isVisible) return null;

  // 경로 거리 계산 (간단한 하버사인 공식)
  const calculateDistance = (waypoints: typeof route.waypoints): number => {
    if (waypoints.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const point1 = waypoints[i];
      const point2 = waypoints[i + 1];

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
  };

  // 예상 소요 시간 계산 (도보 기준)
  const calculateTime = (distance: number): number => {
    const walkingSpeed = 4; // km/h
    return Math.round((distance / walkingSpeed) * 60); // 분 단위
  };

  const distance = calculateDistance(route.waypoints);
  const estimatedTime = calculateTime(distance);

  return (
    <div
      className={`absolute z-10 bg-white rounded-lg shadow-lg p-4 min-w-64 max-w-80 ${className}`}
    >
      {/* 팝업 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-1 rounded"
            style={{ backgroundColor: route.color || '#3B82F6' }}
          />
          <h3 className="font-semibold text-gray-900">{route.name}</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      {/* 경로 정보 */}
      <div className="space-y-3">
        {/* 거리 정보 */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📏</span>
          <span>총 거리: {distance.toFixed(1)}km</span>
        </div>

        {/* 예상 소요 시간 */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>⏱️</span>
          <span>예상 소요시간: {estimatedTime}분 (도보 기준)</span>
        </div>

        {/* 경로 포인트 수 */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📍</span>
          <span>경유지: {route.waypoints.length}개</span>
        </div>

        {/* 메인 경로 여부 */}
        {route.isMainRoute && (
          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
            <span>⭐</span>
            <span>메인 경로</span>
          </div>
        )}

        {/* 경로 스타일 정보 */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-1 rounded"
              style={{ backgroundColor: route.color || '#3B82F6' }}
            />
            <span>색상</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-1 rounded"
              style={{
                backgroundColor: route.color || '#3B82F6',
                opacity: route.strokeOpacity || 0.8,
              }}
            />
            <span>
              투명도: {Math.round((route.strokeOpacity || 0.8) * 100)}%
            </span>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-2 pt-2">
          <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
            경로 따라가기
          </button>
          <button className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
            경로 공유
          </button>
        </div>
      </div>
    </div>
  );
}
