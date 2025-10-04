'use client';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapRoute } from '@/types/map';
import { Plus, Trash2, Route, Square, Circle, Triangle } from 'lucide-react';

interface PolylineData {
  id: string;
  name: string;
  type: 'line' | 'polygon' | 'circle';
  points: { lat: number; lng: number }[];
  color: string;
  strokeWeight: number;
  strokeOpacity: number;
  fillColor?: string;
  fillOpacity?: number;
}

const colorOptions = [
  { name: '빨간색', value: '#FF0000' },
  { name: '파란색', value: '#0000FF' },
  { name: '초록색', value: '#00FF00' },
  { name: '노란색', value: '#FFFF00' },
  { name: '보라색', value: '#800080' },
  { name: '주황색', value: '#FFA500' },
];

const samplePolylines: PolylineData[] = [
  {
    id: '1',
    name: '포항시청 → 포항공대',
    type: 'line',
    points: [
      { lat: 36.019, lng: 129.3435 },
      { lat: 36.014, lng: 129.3485 },
    ],
    color: '#FF0000',
    strokeWeight: 5,
    strokeOpacity: 0.8,
  },
  {
    id: '2',
    name: '포항 관광지역',
    type: 'polygon',
    points: [
      { lat: 36.019, lng: 129.3435 },
      { lat: 36.014, lng: 129.3485 },
      { lat: 36.009, lng: 129.3535 },
      { lat: 36.014, lng: 129.3585 },
    ],
    color: '#0000FF',
    strokeWeight: 3,
    strokeOpacity: 0.8,
    fillColor: '#0000FF',
    fillOpacity: 0.2,
  },
];

export default function PolylineTest() {
  const [polylines, setPolylines] = useState<PolylineData[]>(samplePolylines);
  const [routes, setRoutes] = useState<MapRoute[]>([]);
  const [newPolyline, setNewPolyline] = useState({
    name: '',
    type: 'line' as 'line' | 'polygon' | 'circle',
    color: '#FF0000',
    strokeWeight: 5,
    strokeOpacity: 0.8,
    fillColor: '#0000FF',
    fillOpacity: 0.2,
  });
  const [selectedPolyline, setSelectedPolyline] = useState<PolylineData | null>(
    null
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<
    { lat: number; lng: number }[]
  >([]);

  // 폴리라인을 MapRoute로 변환
  useEffect(() => {
    const newRoutes: MapRoute[] = polylines.map((polyline) => ({
      id: polyline.id,
      name: polyline.name || `Route ${polyline.id}`,
      waypoints: polyline.points,
      color: polyline.color,
      strokeWeight: polyline.strokeWeight,
      strokeOpacity: polyline.strokeOpacity,
    }));
    setRoutes(newRoutes);
  }, [polylines]);

  const addPolyline = () => {
    if (!newPolyline.name) return;

    const polyline: PolylineData = {
      id: Date.now().toString(),
      name: newPolyline.name,
      type: newPolyline.type,
      points:
        drawingPoints.length > 0
          ? drawingPoints
          : [
              { lat: 36.019, lng: 129.3435 },
              { lat: 36.014, lng: 129.3485 },
            ],
      color: newPolyline.color,
      strokeWeight: newPolyline.strokeWeight,
      strokeOpacity: newPolyline.strokeOpacity,
      fillColor:
        newPolyline.type === 'polygon' ? newPolyline.fillColor : undefined,
      fillOpacity:
        newPolyline.type === 'polygon' ? newPolyline.fillOpacity : undefined,
    };

    setPolylines((prev) => [...prev, polyline]);
    setNewPolyline({
      name: '',
      type: 'line',
      color: '#FF0000',
      strokeWeight: 5,
      strokeOpacity: 0.8,
      fillColor: '#0000FF',
      fillOpacity: 0.2,
    });
    setDrawingPoints([]);
    setIsDrawing(false);
  };

  const removePolyline = (id: string) => {
    setPolylines((prev) => prev.filter((polyline) => polyline.id !== id));
    if (selectedPolyline?.id === id) {
      setSelectedPolyline(null);
    }
  };

  const handleMapClick = (event: any) => {
    if (!isDrawing) return;

    const lat = event.latLng.getLat();
    const lng = event.latLng.getLng();
    const newPoint = { lat, lng };

    setDrawingPoints((prev) => [...prev, newPoint]);
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setDrawingPoints([]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearDrawing = () => {
    setDrawingPoints([]);
    setIsDrawing(false);
  };

  const clearAllPolylines = () => {
    setPolylines([]);
    setSelectedPolyline(null);
  };

  const addRandomPolyline = () => {
    const randomPoints = Array.from({ length: 4 }, () => ({
      lat: 36.0 + (Math.random() - 0.5) * 0.1,
      lng: 129.3 + (Math.random() - 0.5) * 0.1,
    }));

    const polyline: PolylineData = {
      id: `random_${Date.now()}`,
      name: `랜덤 ${polylines.length + 1}`,
      type: Math.random() > 0.5 ? 'line' : 'polygon',
      points: randomPoints,
      color:
        colorOptions[Math.floor(Math.random() * colorOptions.length)].value,
      strokeWeight: Math.floor(Math.random() * 5) + 2,
      strokeOpacity: 0.8,
      fillColor:
        Math.random() > 0.5
          ? colorOptions[Math.floor(Math.random() * colorOptions.length)].value
          : undefined,
      fillOpacity: 0.2,
    };

    setPolylines((prev) => [...prev, polyline]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'line':
        return <Route className="w-4 h-4" />;
      case 'polygon':
        return <Square className="w-4 h-4" />;
      case 'circle':
        return <Circle className="w-4 h-4" />;
      default:
        return <Route className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 폴리라인 추가 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">폴리라인 추가</CardTitle>
          <CardDescription>
            새로운 선이나 영역을 지도에 추가해보세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                placeholder="폴리라인 이름을 입력하세요"
                value={newPolyline.name}
                onChange={(e) =>
                  setNewPolyline((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">타입</Label>
              <Select
                value={newPolyline.type}
                onValueChange={(value: 'line' | 'polygon' | 'circle') =>
                  setNewPolyline((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">선 (Polyline)</SelectItem>
                  <SelectItem value="polygon">영역 (Polygon)</SelectItem>
                  <SelectItem value="circle">원 (Circle)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">색상</Label>
              <Select
                value={newPolyline.color}
                onValueChange={(value) =>
                  setNewPolyline((prev) => ({ ...prev, color: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="strokeWeight">선 두께</Label>
              <Input
                id="strokeWeight"
                type="number"
                min="1"
                max="10"
                value={newPolyline.strokeWeight}
                onChange={(e) =>
                  setNewPolyline((prev) => ({
                    ...prev,
                    strokeWeight: parseInt(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strokeOpacity">투명도</Label>
              <Input
                id="strokeOpacity"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={newPolyline.strokeOpacity}
                onChange={(e) =>
                  setNewPolyline((prev) => ({
                    ...prev,
                    strokeOpacity: parseFloat(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          {newPolyline.type === 'polygon' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fillColor">채우기 색상</Label>
                <Select
                  value={newPolyline.fillColor || '#0000FF'}
                  onValueChange={(value) =>
                    setNewPolyline((prev) => ({ ...prev, fillColor: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        {color.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fillOpacity">채우기 투명도</Label>
                <Input
                  id="fillOpacity"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={newPolyline.fillOpacity}
                  onChange={(e) =>
                    setNewPolyline((prev) => ({
                      ...prev,
                      fillOpacity: parseFloat(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={addPolyline} disabled={!newPolyline.name}>
              <Plus className="w-4 h-4 mr-2" />
              폴리라인 추가
            </Button>
            <Button
              variant="outline"
              onClick={startDrawing}
              disabled={isDrawing}
            >
              <Route className="w-4 h-4 mr-2" />
              그리기 시작
            </Button>
            <Button
              variant="outline"
              onClick={stopDrawing}
              disabled={!isDrawing}
            >
              그리기 중지
            </Button>
            <Button variant="outline" onClick={clearDrawing}>
              그리기 초기화
            </Button>
            <Button variant="outline" onClick={addRandomPolyline}>
              랜덤 폴리라인 추가
            </Button>
          </div>
          {isDrawing && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                지도를 클릭하여 점을 추가하세요. ({drawingPoints.length}개 점)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 폴리라인 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">폴리라인 목록</CardTitle>
              <CardDescription>
                현재 지도에 표시된 폴리라인들 ({polylines.length}개)
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearAllPolylines}>
              <Trash2 className="w-4 h-4 mr-2" />
              모두 삭제
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
            {polylines.map((polyline) => (
              <div
                key={polyline.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedPolyline?.id === polyline.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedPolyline(polyline)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(polyline.type)}
                    <span className="font-medium text-sm">{polyline.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {polyline.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePolyline(polyline.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {polyline.points.length}개 점 • {polyline.color} • 두께:{' '}
                  {polyline.strokeWeight}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 선택된 폴리라인 정보 */}
      {selectedPolyline && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">선택된 폴리라인</CardTitle>
            <CardDescription>클릭한 폴리라인의 상세 정보입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">이름:</span>
                  <p className="text-sm">{selectedPolyline.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">타입:</span>
                  <p className="text-sm">{selectedPolyline.type}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">색상:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: selectedPolyline.color }}
                    />
                    <span className="text-sm">{selectedPolyline.color}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">선 두께:</span>
                  <p className="text-sm">{selectedPolyline.strokeWeight}</p>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium">점 개수:</span>
                <p className="text-sm">{selectedPolyline.points.length}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 지도 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">폴리라인 테스트 지도</CardTitle>
          <CardDescription>
            지도를 클릭하여 폴리라인을 그려보고, 생성된 선과 영역을 확인해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <KakaoMap
              center={{ lat: 36.019, lng: 129.3435 }}
              level={3}
              routes={routes}
              onMapClick={handleMapClick}
              className="rounded-lg border"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
