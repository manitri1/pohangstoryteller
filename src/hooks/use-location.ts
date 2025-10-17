'use client';

import { useState, useEffect, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface LocationError {
  code: number;
  message: string;
}

interface UseLocationReturn {
  location: Location | null;
  error: LocationError | null;
  isLoading: boolean;
  getCurrentLocation: () => Promise<Location>;
  isWithinRange: (
    targetLat: number,
    targetLng: number,
    rangeMeters?: number
  ) => boolean;
  calculateDistance: (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => number;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = useCallback(async (): Promise<Location> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error: LocationError = {
          code: 0,
          message: '이 브라우저는 위치 서비스를 지원하지 않습니다.',
        };
        setError(error);
        setIsLoading(false);
        reject(error);
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setLocation(newLocation);
          setIsLoading(false);
          resolve(newLocation);
        },
        (err) => {
          const locationError: LocationError = {
            code: err.code,
            message: getLocationErrorMessage(err.code),
          };

          setError(locationError);
          setIsLoading(false);
          reject(locationError);
        },
        options
      );
    });
  }, []);

  const getLocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return '위치 접근 권한이 거부되었습니다.';
      case 2:
        return '위치 정보를 가져올 수 없습니다.';
      case 3:
        return '위치 요청 시간이 초과되었습니다.';
      default:
        return '알 수 없는 위치 오류가 발생했습니다.';
    }
  };

  const calculateDistance = useCallback(
    (lat1: number, lng1: number, lat2: number, lng2: number): number => {
      const R = 6371e3; // 지구 반지름 (미터)
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lng2 - lng1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // 미터 단위
    },
    []
  );

  const isWithinRange = useCallback(
    (
      targetLat: number,
      targetLng: number,
      rangeMeters: number = 100
    ): boolean => {
      if (!location) return false;

      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        targetLat,
        targetLng
      );

      return distance <= rangeMeters;
    },
    [location, calculateDistance]
  );

  return {
    location,
    error,
    isLoading,
    getCurrentLocation,
    isWithinRange,
    calculateDistance,
  };
}
