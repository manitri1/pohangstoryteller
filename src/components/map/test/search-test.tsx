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
import { MapMarker } from '@/types/map';
import { Search, MapPin, Star, Navigation, X } from 'lucide-react';

interface SearchResult {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  category_name: string;
  phone: string;
  place_url: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function SearchTest() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 36.019, lng: 129.3435 });
  const [mapLevel, setMapLevel] = useState(3);
  const psRef = useRef<any>(null);

  // 카카오 장소 검색 서비스 초기화
  useEffect(() => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      psRef.current = new window.kakao.maps.services.Places();
    }
  }, []);

  const searchPlaces = async () => {
    if (!searchQuery.trim() || !psRef.current) return;

    setIsSearching(true);
    setSearchResults([]);
    setMarkers([]);

    // 검색 히스토리에 추가
    if (!searchHistory.includes(searchQuery)) {
      setSearchHistory((prev) => [searchQuery, ...prev.slice(0, 9)]);
    }

    psRef.current.keywordSearch(searchQuery, (data: any[], status: any) => {
      setIsSearching(false);

      if (status === window.kakao.maps.services.Status.OK) {
        const results: SearchResult[] = data.map((place, index) => ({
          id: `search_${index}`,
          place_name: place.place_name,
          address_name: place.address_name,
          road_address_name: place.road_address_name,
          x: place.x,
          y: place.y,
          category_name: place.category_name,
          phone: place.phone,
          place_url: place.place_url,
        }));

        setSearchResults(results);

        // 검색 결과를 마커로 표시
        const newMarkers: MapMarker[] = results.map((result, index) => ({
          id: result.id,
          position: {
            lat: parseFloat(result.y),
            lng: parseFloat(result.x),
          },
          title: result.place_name,
        }));

        setMarkers(newMarkers);

        // 첫 번째 결과로 지도 중심 이동
        if (results.length > 0) {
          setMapCenter({
            lat: parseFloat(results[0].y),
            lng: parseFloat(results[0].x),
          });
          setMapLevel(3);
        }
      } else {
        console.error('검색 실패:', status);
        setSearchResults([]);
      }
    });
  };

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
    setMapCenter({
      lat: parseFloat(result.y),
      lng: parseFloat(result.x),
    });
    setMapLevel(2);
  };

  const handleMarkerClick = (marker: MapMarker) => {
    const result = searchResults.find((r) => r.id === marker.id);
    if (result) {
      setSelectedResult(result);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setMarkers([]);
    setSelectedResult(null);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const searchFromHistory = (query: string) => {
    setSearchQuery(query);
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('음식점')) return 'bg-red-100 text-red-800';
    if (category.includes('카페')) return 'bg-yellow-100 text-yellow-800';
    if (category.includes('병원')) return 'bg-green-100 text-green-800';
    if (category.includes('학교')) return 'bg-blue-100 text-blue-800';
    if (category.includes('관광')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* 검색 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">장소 검색</CardTitle>
          <CardDescription>
            원하는 장소를 검색하고 지도에서 확인해보세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="장소명을 입력하세요 (예: 포항 맛집, 카페, 병원)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchPlaces()}
              />
            </div>
            <Button
              onClick={searchPlaces}
              disabled={!searchQuery.trim() || isSearching}
            >
              <Search className="w-4 h-4 mr-2" />
              {isSearching ? '검색 중...' : '검색'}
            </Button>
            <Button variant="outline" onClick={clearSearch}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* 검색 히스토리 */}
          {searchHistory.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">최근 검색어</Label>
                <Button variant="ghost" size="sm" onClick={clearHistory}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => searchFromHistory(query)}
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 검색 결과 */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">검색 결과</CardTitle>
            <CardDescription>
              {searchResults.length}개의 장소를 찾았습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedResult?.id === result.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-sm">
                          {result.place_name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.road_address_name || result.address_name}
                      </div>
                      {result.category_name && (
                        <Badge
                          variant="secondary"
                          className={`text-xs mt-1 ${getCategoryColor(result.category_name)}`}
                        >
                          {result.category_name}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      ({parseFloat(result.y).toFixed(4)},{' '}
                      {parseFloat(result.x).toFixed(4)})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 선택된 장소 정보 */}
      {selectedResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">선택된 장소</CardTitle>
            <CardDescription>클릭한 장소의 상세 정보입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">장소명:</span>
                <p className="text-sm font-medium">
                  {selectedResult.place_name}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">주소:</span>
                <p className="text-sm">
                  {selectedResult.road_address_name ||
                    selectedResult.address_name}
                </p>
              </div>
              {selectedResult.category_name && (
                <div>
                  <span className="text-sm font-medium">카테고리:</span>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getCategoryColor(selectedResult.category_name)}`}
                  >
                    {selectedResult.category_name}
                  </Badge>
                </div>
              )}
              {selectedResult.phone && (
                <div>
                  <span className="text-sm font-medium">전화번호:</span>
                  <p className="text-sm">{selectedResult.phone}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">위도:</span>
                  <p className="text-sm">
                    {parseFloat(selectedResult.y).toFixed(4)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">경도:</span>
                  <p className="text-sm">
                    {parseFloat(selectedResult.x).toFixed(4)}
                  </p>
                </div>
              </div>
              {selectedResult.place_url && (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(selectedResult.place_url, '_blank')
                    }
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    카카오맵에서 보기
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 지도 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">검색 결과 지도</CardTitle>
          <CardDescription>
            검색된 장소들을 지도에서 확인하고, 마커를 클릭하여 상세 정보를
            확인해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <KakaoMap
              center={mapCenter}
              level={mapLevel}
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
