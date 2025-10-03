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
// import { Slider } from '@/components/ui/slider';
import { MapMarker } from '@/types/map';
import { Plus, Trash2, MapPin, Layers, Settings, Shuffle } from 'lucide-react';

interface ClusterMarker extends MapMarker {
  category: string;
  description?: string;
}

const sampleCategories = [
  { name: '음식점', color: '#FF6B6B', icon: '🍽️' },
  { name: '카페', color: '#4ECDC4', icon: '☕' },
  { name: '병원', color: '#45B7D1', icon: '🏥' },
  { name: '학교', color: '#96CEB4', icon: '🎓' },
  { name: '관광지', color: '#FFEAA7', icon: '🏛️' },
  { name: '쇼핑', color: '#DDA0DD', icon: '🛍️' },
];

declare global {
  interface Window {
    kakao: any;
  }
}

export default function ClusterTest() {
  const [markers, setMarkers] = useState<ClusterMarker[]>([]);
  const [clusterSettings, setClusterSettings] = useState({
    minClusterSize: 2,
    maxZoom: 10,
    gridSize: 60,
    averageCenter: true,
  });
  const [selectedCategory, setSelectedCategory] = useState('음식점');
  const [newMarker, setNewMarker] = useState({
    title: '',
    lat: '',
    lng: '',
    category: '음식점',
    description: '',
  });
  const [selectedMarker, setSelectedMarker] = useState<ClusterMarker | null>(
    null
  );
  const [clusterInfo, setClusterInfo] = useState({
    totalMarkers: 0,
    visibleClusters: 0,
    averageZoom: 0,
  });

  // 샘플 마커 생성
  const generateSampleMarkers = (count: number, category: string) => {
    const categoryData = sampleCategories.find((c) => c.name === category);
    if (!categoryData) return [];

    const newMarkers: ClusterMarker[] = Array.from(
      { length: count },
      (_, index) => ({
        id: `${category}_${Date.now()}_${index}`,
        position: {
          lat: 36.0 + (Math.random() - 0.5) * 0.1,
          lng: 129.3 + (Math.random() - 0.5) * 0.1,
        },
        title: `${category} ${index + 1}`,
        category: category,
        description: `${category}에 대한 설명입니다.`,
      })
    );

    return newMarkers;
  };

  const addMarker = () => {
    if (!newMarker.title || !newMarker.lat || !newMarker.lng) return;

    const marker: ClusterMarker = {
      id: Date.now().toString(),
      position: {
        lat: parseFloat(newMarker.lat),
        lng: parseFloat(newMarker.lng),
      },
      title: newMarker.title,
      category: newMarker.category,
      description: newMarker.description,
    };

    setMarkers((prev) => [...prev, marker]);
    setNewMarker({
      title: '',
      lat: '',
      lng: '',
      category: '음식점',
      description: '',
    });
  };

  const removeMarker = (id: string) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id));
    if (selectedMarker?.id === id) {
      setSelectedMarker(null);
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    const clusterMarker = markers.find((m) => m.id === marker.id);
    if (clusterMarker) {
      setSelectedMarker(clusterMarker);
    }
  };

  const addRandomMarkers = (count: number) => {
    const randomCategory =
      sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
    const newMarkers = generateSampleMarkers(count, randomCategory.name);
    setMarkers((prev) => [...prev, ...newMarkers]);
  };

  const clearAllMarkers = () => {
    setMarkers([]);
    setSelectedMarker(null);
  };

  const getCategoryColor = (category: string) => {
    const categoryData = sampleCategories.find((c) => c.name === category);
    return categoryData?.color || '#666666';
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = sampleCategories.find((c) => c.name === category);
    return categoryData?.icon || '📍';
  };

  // 클러스터 정보 업데이트
  useEffect(() => {
    setClusterInfo({
      totalMarkers: markers.length,
      visibleClusters: Math.ceil(
        markers.length / clusterSettings.minClusterSize
      ),
      averageZoom: Math.max(
        1,
        Math.min(10, 10 - Math.log2(markers.length / 10))
      ),
    });
  }, [markers, clusterSettings]);

  return (
    <div className="space-y-6">
      {/* 마커 추가 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">마커 추가</CardTitle>
          <CardDescription>
            새로운 마커를 추가하여 클러스터링을 테스트해보세요
          </CardDescription>
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
              <Label htmlFor="category">카테고리</Label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newMarker.category}
                onChange={(e) =>
                  setNewMarker((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                {sampleCategories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.icon} {category.name}
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
          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Input
              id="description"
              placeholder="마커에 대한 설명을 입력하세요"
              value={newMarker.description}
              onChange={(e) =>
                setNewMarker((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={addMarker}
              disabled={!newMarker.title || !newMarker.lat || !newMarker.lng}
            >
              <Plus className="w-4 h-4 mr-2" />
              마커 추가
            </Button>
            <Button variant="outline" onClick={() => addRandomMarkers(5)}>
              <Shuffle className="w-4 h-4 mr-2" />
              랜덤 마커 5개 추가
            </Button>
            <Button variant="outline" onClick={() => addRandomMarkers(20)}>
              <Shuffle className="w-4 h-4 mr-2" />
              랜덤 마커 20개 추가
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 클러스터 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">클러스터 설정</CardTitle>
          <CardDescription>클러스터링 동작을 조정해보세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                최소 클러스터 크기: {clusterSettings.minClusterSize}
              </Label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={clusterSettings.minClusterSize}
                onChange={(e) =>
                  setClusterSettings((prev) => ({
                    ...prev,
                    minClusterSize: parseInt(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>최대 줌 레벨: {clusterSettings.maxZoom}</Label>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={clusterSettings.maxZoom}
                onChange={(e) =>
                  setClusterSettings((prev) => ({
                    ...prev,
                    maxZoom: parseInt(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>그리드 크기: {clusterSettings.gridSize}</Label>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={clusterSettings.gridSize}
                onChange={(e) =>
                  setClusterSettings((prev) => ({
                    ...prev,
                    gridSize: parseInt(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>평균 중심점 사용</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={clusterSettings.averageCenter}
                  onChange={(e) =>
                    setClusterSettings((prev) => ({
                      ...prev,
                      averageCenter: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm">클러스터 중심을 평균으로 계산</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 클러스터 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">클러스터 정보</CardTitle>
          <CardDescription>현재 클러스터링 상태를 확인해보세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {clusterInfo.totalMarkers}
              </div>
              <div className="text-sm text-blue-800">총 마커 수</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {clusterInfo.visibleClusters}
              </div>
              <div className="text-sm text-green-800">예상 클러스터 수</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {clusterInfo.averageZoom.toFixed(1)}
              </div>
              <div className="text-sm text-purple-800">평균 줌 레벨</div>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
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
                    <span className="text-lg">
                      {getCategoryIcon(marker.category)}
                    </span>
                    <span className="font-medium text-sm">{marker.title}</span>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: getCategoryColor(marker.category),
                        color: 'white',
                      }}
                    >
                      {marker.category}
                    </Badge>
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
                {marker.description && (
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {marker.description}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
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
            <CardTitle className="text-lg">선택된 마커</CardTitle>
            <CardDescription>클릭한 마커의 상세 정보입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {getCategoryIcon(selectedMarker.category)}
                </span>
                <span className="font-medium">{selectedMarker.title}</span>
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: getCategoryColor(selectedMarker.category),
                    color: 'white',
                  }}
                >
                  {selectedMarker.category}
                </Badge>
              </div>
              {selectedMarker.description && (
                <div>
                  <span className="text-sm font-medium">설명:</span>
                  <p className="text-sm">{selectedMarker.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">위도:</span>
                  <p className="text-sm">
                    {selectedMarker.position.lat.toFixed(4)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">경도:</span>
                  <p className="text-sm">
                    {selectedMarker.position.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 지도 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">클러스터링 테스트 지도</CardTitle>
          <CardDescription>
            마커를 클릭하여 정보를 확인하고, 줌 레벨을 조정하여 클러스터링
            동작을 확인해보세요
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
