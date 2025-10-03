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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapMarker } from '@/types/map';
import { Plus, Trash2, MapPin, Star } from 'lucide-react';

const defaultMarkers: MapMarker[] = [
  {
    id: '1',
    position: { lat: 36.019, lng: 129.3435 },
    title: '포항시청',
    image: undefined,
  },
  {
    id: '2',
    position: { lat: 36.014, lng: 129.3485 },
    title: '포항공과대학교',
    image: undefined,
  },
];

const markerImages = [
  { name: '기본 마커', value: undefined },
  {
    name: '별 모양',
    value:
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
  },
  {
    name: '핀 모양',
    value:
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_pin_red.png',
  },
];

export default function MarkerTest() {
  const [markers, setMarkers] = useState<MapMarker[]>(defaultMarkers);
  const [newMarker, setNewMarker] = useState({
    title: '',
    lat: '',
    lng: '',
    image: undefined as string | undefined,
  });
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  const addMarker = () => {
    if (!newMarker.title || !newMarker.lat || !newMarker.lng) return;

    const marker: MapMarker = {
      id: Date.now().toString(),
      position: {
        lat: parseFloat(newMarker.lat),
        lng: parseFloat(newMarker.lng),
      },
      title: newMarker.title,
      image: newMarker.image,
    };

    setMarkers((prev) => [...prev, marker]);
    setNewMarker({ title: '', lat: '', lng: '', image: undefined });
  };

  const removeMarker = (id: string) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id));
    if (selectedMarker?.id === id) {
      setSelectedMarker(null);
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  const clearAllMarkers = () => {
    setMarkers([]);
    setSelectedMarker(null);
  };

  const addRandomMarkers = () => {
    const randomMarkers: MapMarker[] = Array.from(
      { length: 5 },
      (_, index) => ({
        id: `random_${Date.now()}_${index}`,
        position: {
          lat: 36.0 + (Math.random() - 0.5) * 0.1,
          lng: 129.3 + (Math.random() - 0.5) * 0.1,
        },
        title: `랜덤 마커 ${index + 1}`,
        image: Math.random() > 0.5 ? markerImages[1].value : undefined,
      })
    );

    setMarkers((prev) => [...prev, ...randomMarkers]);
  };

  return (
    <div className="space-y-6">
      {/* 마커 추가 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">마커 추가</CardTitle>
          <CardDescription>새로운 마커를 지도에 추가해보세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">마커 제목</Label>
              <Input
                id="title"
                placeholder="마커 제목을 입력하세요"
                value={newMarker.title}
                onChange={(e) =>
                  setNewMarker((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">마커 이미지</Label>
              <select
                id="image"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newMarker.image || ''}
                onChange={(e) =>
                  setNewMarker((prev) => ({
                    ...prev,
                    image: e.target.value || undefined,
                  }))
                }
              >
                {markerImages.map((img) => (
                  <option key={img.name} value={img.value || ''}>
                    {img.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">위도</Label>
              <Input
                id="lat"
                type="number"
                step="0.0001"
                placeholder="36.0190"
                value={newMarker.lat}
                onChange={(e) =>
                  setNewMarker((prev) => ({ ...prev, lat: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">경도</Label>
              <Input
                id="lng"
                type="number"
                step="0.0001"
                placeholder="129.3435"
                value={newMarker.lng}
                onChange={(e) =>
                  setNewMarker((prev) => ({ ...prev, lng: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={addMarker}
              disabled={!newMarker.title || !newMarker.lat || !newMarker.lng}
            >
              <Plus className="w-4 h-4 mr-2" />
              마커 추가
            </Button>
            <Button variant="outline" onClick={addRandomMarkers}>
              <MapPin className="w-4 h-4 mr-2" />
              랜덤 마커 5개 추가
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 마커 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">마커 목록</CardTitle>
              <CardDescription>
                현재 지도에 표시된 마커들 ({markers.length}개)
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearAllMarkers}>
              <Trash2 className="w-4 h-4 mr-2" />
              모두 삭제
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {markers.map((marker) => (
              <div
                key={marker.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMarker?.id === marker.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedMarker(marker)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {marker.image ? (
                      <Star className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <MapPin className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-medium text-sm">{marker.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeMarker(marker.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ({marker.position.lat.toFixed(4)},{' '}
                  {marker.position.lng.toFixed(4)})
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 선택된 마커 정보 */}
      {selectedMarker && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">선택된 마커 정보</CardTitle>
            <CardDescription>클릭한 마커의 상세 정보입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">제목:</span>
                <span className="text-sm">{selectedMarker.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">위도:</span>
                <span className="text-sm">
                  {selectedMarker.position.lat.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">경도:</span>
                <span className="text-sm">
                  {selectedMarker.position.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">이미지:</span>
                <Badge variant={selectedMarker.image ? 'default' : 'secondary'}>
                  {selectedMarker.image ? '커스텀' : '기본'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 지도 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">마커 테스트 지도</CardTitle>
          <CardDescription>
            마커를 클릭하여 정보를 확인하고, 지도를 드래그하여 마커들을
            탐색해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <KakaoMap
              center={{ lat: 36.019, lng: 129.3435 }}
              level={3}
              markers={markers}
              onMarkerClick={handleMarkerClick}
              className="rounded-lg border"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
