'use client';

import React from 'react';
import type { MapControls } from '../types';

/**
 * 🎛️ 지도 컨트롤 컴포넌트
 * 지도의 줌, 스케일, 전체화면 등의 컨트롤을 제공합니다.
 */
interface MapControlsProps {
  controls: MapControls;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
  onLocation: () => void;
  onLayerToggle: (layerId: string) => void;
  onSearch: (query: string) => void;
  currentZoom: number;
  maxZoom?: number;
  minZoom?: number;
  className?: string;
}

export function MapControls({
  controls,
  onZoomIn,
  onZoomOut,
  onFullscreen,
  onLocation,
  onLayerToggle,
  onSearch,
  currentZoom,
  maxZoom = 20,
  minZoom = 1,
  className = '',
}: MapControlsProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    onFullscreen();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className={`absolute top-4 right-4 flex flex-col gap-2 ${className}`}>
      {/* 줌 컨트롤 */}
      {controls.showZoom && (
        <div className="bg-white rounded-lg shadow-lg p-1">
          <button
            onClick={onZoomIn}
            disabled={currentZoom >= maxZoom}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="확대"
          >
            +
          </button>
          <div className="w-full h-px bg-gray-200"></div>
          <button
            onClick={onZoomOut}
            disabled={currentZoom <= minZoom}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="축소"
          >
            −
          </button>
        </div>
      )}

      {/* 스케일 컨트롤 */}
      {controls.showScale && (
        <div className="bg-white rounded-lg shadow-lg px-3 py-2 text-xs text-gray-600">
          <div className="font-medium mb-1">스케일</div>
          <div>
            1:{(1000000 / Math.pow(2, currentZoom - 1)).toLocaleString()}
          </div>
        </div>
      )}

      {/* 전체화면 컨트롤 */}
      {controls.showFullscreen && (
        <button
          onClick={handleFullscreen}
          className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-100"
          title={isFullscreen ? '전체화면 종료' : '전체화면'}
        >
          {isFullscreen ? '⤓' : '⤢'}
        </button>
      )}

      {/* 내 위치 컨트롤 */}
      {controls.showLocation && (
        <button
          onClick={onLocation}
          className="w-8 h-8 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-100"
          title="내 위치"
        >
          📍
        </button>
      )}

      {/* 레이어 컨트롤 */}
      {controls.showLayers && (
        <div className="bg-white rounded-lg shadow-lg p-2">
          <div className="text-xs font-medium text-gray-600 mb-2">레이어</div>
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>마커</span>
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>경로</span>
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" defaultChecked className="rounded" />
              <span>스탬프</span>
            </label>
          </div>
        </div>
      )}

      {/* 검색 컨트롤 */}
      {controls.showSearch && (
        <div className="bg-white rounded-lg shadow-lg p-2 min-w-48">
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="text-xs font-medium text-gray-600 mb-1">검색</div>
            <div className="flex gap-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="장소 검색..."
                className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                검색
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/**
 * 🎛️ 지도 정보 패널 컴포넌트
 * 지도의 현재 상태와 통계 정보를 표시합니다.
 */
interface MapInfoPanelProps {
  totalMarkers: number;
  totalRoutes: number;
  visitedMarkers: number;
  collectedStamps: number;
  currentLocation?: { lat: number; lng: number };
  className?: string;
}

export function MapInfoPanel({
  totalMarkers,
  totalRoutes,
  visitedMarkers,
  collectedStamps,
  currentLocation,
  className = '',
}: MapInfoPanelProps) {
  const completionRate =
    totalMarkers > 0 ? (visitedMarkers / totalMarkers) * 100 : 0;
  const stampRate =
    totalMarkers > 0 ? (collectedStamps / totalMarkers) * 100 : 0;

  return (
    <div
      className={`absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 min-w-48 ${className}`}
    >
      <div className="text-sm font-medium text-gray-900 mb-2">지도 정보</div>

      <div className="space-y-2 text-xs text-gray-600">
        {/* 마커 정보 */}
        <div className="flex justify-between">
          <span>마커</span>
          <span>{totalMarkers}개</span>
        </div>

        <div className="flex justify-between">
          <span>방문 완료</span>
          <span className="text-green-600">{visitedMarkers}개</span>
        </div>

        <div className="flex justify-between">
          <span>스탬프 수집</span>
          <span className="text-blue-600">{collectedStamps}개</span>
        </div>

        {/* 진행률 바 */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>방문 진행률</span>
            <span>{completionRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-green-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span>스탬프 진행률</span>
            <span>{stampRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${stampRate}%` }}
            />
          </div>
        </div>

        {/* 경로 정보 */}
        <div className="flex justify-between">
          <span>경로</span>
          <span>{totalRoutes}개</span>
        </div>

        {/* 현재 위치 */}
        {currentLocation && (
          <div className="pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">현재 위치</div>
            <div className="text-xs">
              {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
