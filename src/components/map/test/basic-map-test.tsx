'use client';

import { useState } from 'react';
import { KakaoMap } from '@/components/map/kakao-map';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapCenter } from '@/types/map';

const testLocations: { name: string; center: MapCenter; level: number }[] = [
  { name: '포항시청', center: { lat: 36.019, lng: 129.3435 }, level: 3 },
  { name: '서울시청', center: { lat: 37.5665, lng: 126.978 }, level: 3 },
  { name: '부산시청', center: { lat: 35.1796, lng: 129.0756 }, level: 3 },
  { name: '대구시청', center: { lat: 35.8714, lng: 128.6014 }, level: 3 },
  { name: '인천시청', center: { lat: 37.4563, lng: 126.7052 }, level: 3 },
];

export default function BasicMapTest() {
  const [currentLocation, setCurrentLocation] = useState(testLocations[0]);
  const [mapEvents, setMapEvents] = useState<string[]>([]);

  const handleMapClick = (event: any) => {
    const lat = event.latLng.getLat();
    const lng = event.latLng.getLng();
    const newEvent = `지도 클릭: (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    setMapEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
  };

  const handleBoundsChanged = (bounds: any) => {
    const newEvent = `영역 변경: SW(${bounds.sw.lat.toFixed(4)}, ${bounds.sw.lng.toFixed(4)}) NE(${bounds.ne.lat.toFixed(4)}, ${bounds.ne.lng.toFixed(4)})`;
    setMapEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
  };

  const handleZoomChanged = (level: number) => {
    const newEvent = `줌 레벨 변경: ${level}`;
    setMapEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
  };

  const clearEvents = () => {
    setMapEvents([]);
  };

  return (
    <div className="space-y-6">
      {/* 지도 컨트롤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">위치 이동</CardTitle>
            <CardDescription>
              다른 도시로 지도 중심을 이동해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {testLocations.map((location) => (
              <Button
                key={location.name}
                variant={
                  currentLocation.name === location.name ? 'default' : 'outline'
                }
                size="sm"
                className="w-full justify-start"
                onClick={() => setCurrentLocation(location)}
              >
                {location.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">현재 설정</CardTitle>
            <CardDescription>현재 지도 설정 정보</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">위치:</span>
              <Badge variant="secondary">{currentLocation.name}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">위도:</span>
              <span className="text-sm text-gray-600">
                {currentLocation.center.lat.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">경도:</span>
              <span className="text-sm text-gray-600">
                {currentLocation.center.lng.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">줌 레벨:</span>
              <span className="text-sm text-gray-600">
                {currentLocation.level}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 지도 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">기본 지도</CardTitle>
          <CardDescription>
            지도를 클릭하거나 드래그하여 이벤트를 확인해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <KakaoMap
              center={currentLocation.center}
              level={currentLocation.level}
              onMapClick={handleMapClick}
              onBoundsChanged={handleBoundsChanged}
              onZoomChanged={handleZoomChanged}
              className="rounded-lg border"
            />
          </div>
        </CardContent>
      </Card>

      {/* 이벤트 로그 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">이벤트 로그</CardTitle>
              <CardDescription>
                지도에서 발생한 이벤트들을 확인할 수 있습니다
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearEvents}>
              로그 지우기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-32 overflow-y-auto bg-gray-50 rounded-lg p-3">
            {mapEvents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                지도를 클릭하거나 드래그하여 이벤트를 발생시켜보세요
              </p>
            ) : (
              <div className="space-y-1">
                {mapEvents.map((event, index) => (
                  <div key={index} className="text-xs font-mono text-gray-700">
                    {event}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
