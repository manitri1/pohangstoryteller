'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { MapMarker } from '@/types/map';
import { Plus, Trash2, MapPin, MessageSquare, X } from 'lucide-react';

interface InfoWindowData {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  content: string;
  removable: boolean;
}

const sampleInfoWindows: InfoWindowData[] = [
  {
    id: '1',
    position: { lat: 36.019, lng: 129.3435 },
    title: '포항시청',
    content: '포항시의 행정 중심지입니다. 다양한 시정 서비스를 제공합니다.',
    removable: true,
  },
  {
    id: '2',
    position: { lat: 36.014, lng: 129.3485 },
    title: '포항공과대학교',
    content: '한국의 대표적인 공과대학교입니다. 첨단 기술 연구의 중심지입니다.',
    removable: true,
  },
];

export default function InfoWindowTest() {
  const [infoWindows, setInfoWindows] =
    useState<InfoWindowData[]>(sampleInfoWindows);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [newInfoWindow, setNewInfoWindow] = useState({
    title: '',
    content: '',
    lat: '',
    lng: '',
  });
  const [selectedInfoWindow, setSelectedInfoWindow] =
    useState<InfoWindowData | null>(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const mapRef = useRef<any>(null);

  // 마커와 인포윈도우 동기화
  useEffect(() => {
    const newMarkers: MapMarker[] = infoWindows.map((info) => ({
      id: info.id,
      position: info.position,
      title: info.title,
    }));
    setMarkers(newMarkers);
  }, [infoWindows]);

  const addInfoWindow = () => {
    if (
      !newInfoWindow.title ||
      !newInfoWindow.content ||
      !newInfoWindow.lat ||
      !newInfoWindow.lng
    )
      return;

    const infoWindow: InfoWindowData = {
      id: Date.now().toString(),
      position: {
        lat: parseFloat(newInfoWindow.lat),
        lng: parseFloat(newInfoWindow.lng),
      },
      title: newInfoWindow.title,
      content: newInfoWindow.content,
      removable: true,
    };

    setInfoWindows((prev) => [...prev, infoWindow]);
    setNewInfoWindow({ title: '', content: '', lat: '', lng: '' });
  };

  const removeInfoWindow = (id: string) => {
    setInfoWindows((prev) => prev.filter((info) => info.id !== id));
    if (selectedInfoWindow?.id === id) {
      setSelectedInfoWindow(null);
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    const infoWindow = infoWindows.find((info) => info.id === marker.id);
    if (infoWindow) {
      setSelectedInfoWindow(infoWindow);
      setIsInfoWindowOpen(true);
    }
  };

  const closeInfoWindow = () => {
    setIsInfoWindowOpen(false);
    setSelectedInfoWindow(null);
  };

  const clearAllInfoWindows = () => {
    setInfoWindows([]);
    setSelectedInfoWindow(null);
    setIsInfoWindowOpen(false);
  };

  const addRandomInfoWindows = () => {
    const randomInfoWindows: InfoWindowData[] = Array.from(
      { length: 3 },
      (_, index) => ({
        id: `random_${Date.now()}_${index}`,
        position: {
          lat: 36.0 + (Math.random() - 0.5) * 0.1,
          lng: 129.3 + (Math.random() - 0.5) * 0.1,
        },
        title: `랜덤 장소 ${index + 1}`,
        content: `이것은 랜덤하게 생성된 ${index + 1}번째 장소입니다. 다양한 정보를 표시할 수 있습니다.`,
        removable: true,
      })
    );

    setInfoWindows((prev) => [...prev, ...randomInfoWindows]);
  };

  return (
    <div className="space-y-6">
      {/* 인포윈도우 추가 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">인포윈도우 추가</CardTitle>
          <CardDescription>
            새로운 인포윈도우를 지도에 추가해보세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                placeholder="인포윈도우 제목을 입력하세요"
                value={newInfoWindow.title}
                onChange={(e) =>
                  setNewInfoWindow((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lat">위도</Label>
              <Input
                id="lat"
                type="number"
                step="0.0001"
                placeholder="36.0190"
                value={newInfoWindow.lat}
                onChange={(e) =>
                  setNewInfoWindow((prev) => ({ ...prev, lat: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              placeholder="인포윈도우에 표시할 내용을 입력하세요"
              value={newInfoWindow.content}
              onChange={(e) =>
                setNewInfoWindow((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lng">경도</Label>
              <Input
                id="lng"
                type="number"
                step="0.0001"
                placeholder="129.3435"
                value={newInfoWindow.lng}
                onChange={(e) =>
                  setNewInfoWindow((prev) => ({ ...prev, lng: e.target.value }))
                }
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={addInfoWindow}
                disabled={
                  !newInfoWindow.title ||
                  !newInfoWindow.content ||
                  !newInfoWindow.lat ||
                  !newInfoWindow.lng
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                인포윈도우 추가
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={addRandomInfoWindows}>
              <MapPin className="w-4 h-4 mr-2" />
              랜덤 인포윈도우 3개 추가
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 인포윈도우 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">인포윈도우 목록</CardTitle>
              <CardDescription>
                현재 지도에 표시된 인포윈도우들 ({infoWindows.length}개)
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearAllInfoWindows}>
              <Trash2 className="w-4 h-4 mr-2" />
              모두 삭제
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
            {infoWindows.map((info) => (
              <div
                key={info.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedInfoWindow?.id === info.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setSelectedInfoWindow(info);
                  setIsInfoWindowOpen(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-sm">{info.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeInfoWindow(info.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {info.content}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  ({info.position.lat.toFixed(4)},{' '}
                  {info.position.lng.toFixed(4)})
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 선택된 인포윈도우 정보 */}
      {selectedInfoWindow && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">선택된 인포윈도우</CardTitle>
                <CardDescription>
                  클릭한 인포윈도우의 상세 정보입니다
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={closeInfoWindow}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">제목:</span>
                <p className="text-sm mt-1">{selectedInfoWindow.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium">내용:</span>
                <p className="text-sm mt-1">{selectedInfoWindow.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">위도:</span>
                  <p className="text-sm">
                    {selectedInfoWindow.position.lat.toFixed(4)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">경도:</span>
                  <p className="text-sm">
                    {selectedInfoWindow.position.lng.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">상태:</span>
                <Badge variant={isInfoWindowOpen ? 'default' : 'secondary'}>
                  {isInfoWindowOpen ? '열림' : '닫힘'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 지도 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">인포윈도우 테스트 지도</CardTitle>
          <CardDescription>
            마커를 클릭하여 인포윈도우를 확인하고, 지도를 드래그하여 다른
            마커들을 탐색해보세요
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
