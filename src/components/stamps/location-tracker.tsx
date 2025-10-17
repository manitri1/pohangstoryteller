'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Navigation,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useLocation } from '@/hooks/use-location';

interface LocationTrackerProps {
  targetLat: number;
  targetLng: number;
  rangeMeters?: number;
  onLocationVerified?: (verified: boolean) => void;
  onDistanceUpdate?: (distance: number) => void;
}

export function LocationTracker({
  targetLat,
  targetLng,
  rangeMeters = 100,
  onLocationVerified,
  onDistanceUpdate,
}: LocationTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [isInRange, setIsInRange] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const {
    location,
    error: locationError,
    isLoading,
    getCurrentLocation,
    isWithinRange,
    calculateDistance,
  } = useLocation();

  // 실시간 위치 추적 시작
  const startTracking = useCallback(async () => {
    setIsTracking(true);
    try {
      await getCurrentLocation();
    } catch (error) {
      console.error('위치 추적 시작 실패:', error);
    }
  }, [getCurrentLocation]);

  // 위치 추적 중지
  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  // 위치 업데이트 처리
  useEffect(() => {
    if (location) {
      const currentDistance = calculateDistance(
        location.latitude,
        location.longitude,
        targetLat,
        targetLng
      );

      setDistance(currentDistance);
      setLastUpdate(new Date());

      const inRange = isWithinRange(targetLat, targetLng, rangeMeters);
      setIsInRange(inRange);

      // 콜백 함수 호출
      onLocationVerified?.(inRange);
      onDistanceUpdate?.(currentDistance);
    }
  }, [
    location,
    targetLat,
    targetLng,
    rangeMeters,
    isWithinRange,
    calculateDistance,
    onLocationVerified,
    onDistanceUpdate,
  ]);

  // 자동 위치 업데이트 (30초마다)
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(async () => {
      try {
        await getCurrentLocation();
      } catch (error) {
        console.error('자동 위치 업데이트 실패:', error);
      }
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, [isTracking, getCurrentLocation]);

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  };

  const getStatusColor = (): string => {
    if (isInRange) return 'text-green-600';
    if (distance && distance < rangeMeters * 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (isInRange) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (locationError) return <AlertCircle className="h-5 w-5 text-red-600" />;
    return <MapPin className="h-5 w-5 text-blue-600" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Navigation className="h-5 w-5" />
          위치 추적
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 위치 상태 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">
              {isInRange ? '위치 확인됨' : '위치 확인 필요'}
            </span>
          </div>
          <Badge variant={isInRange ? 'default' : 'secondary'}>
            {isInRange ? '인증됨' : '대기중'}
          </Badge>
        </div>

        {/* 거리 정보 */}
        {distance !== null && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>목표까지 거리:</span>
              <span className={getStatusColor()}>
                {formatDistance(distance)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>인증 반경:</span>
              <span>{formatDistance(rangeMeters)}</span>
            </div>
          </div>
        )}

        {/* 위치 오류 */}
        {locationError && (
          <div className="rounded-md bg-red-50 p-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">위치 오류</span>
            </div>
            <p className="mt-1 text-sm text-red-700">{locationError.message}</p>
          </div>
        )}

        {/* 마지막 업데이트 시간 */}
        {lastUpdate && (
          <div className="text-xs text-gray-500">
            마지막 업데이트: {lastUpdate.toLocaleTimeString()}
          </div>
        )}

        {/* 제어 버튼 */}
        <div className="flex gap-2">
          {!isTracking ? (
            <Button
              onClick={startTracking}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4 mr-2" />
              )}
              위치 추적 시작
            </Button>
          ) : (
            <Button onClick={stopTracking} variant="outline" className="flex-1">
              추적 중지
            </Button>
          )}

          <Button
            onClick={getCurrentLocation}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>

        {/* 진행률 표시 */}
        {distance !== null && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>진행률</span>
              <span>
                {Math.max(
                  0,
                  Math.min(
                    100,
                    Math.round(((rangeMeters - distance) / rangeMeters) * 100)
                  )
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isInRange ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      ((rangeMeters - distance) / rangeMeters) * 100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
