'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Marker, Location } from '../types';

/**
 * 🎯 지도 마커 컴포넌트
 * 개별 마커의 표시와 상호작용을 담당합니다.
 */
interface MapMarkerProps {
  marker: Marker;
  mapInstance?: any;
  onClick?: (marker: Marker) => void;
  onHover?: (marker: Marker) => void;
  className?: string;
}

export function MapMarker({
  marker,
  mapInstance,
  onClick,
  onHover,
  className = '',
}: MapMarkerProps) {
  const markerRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  // 카카오맵 마커 생성
  useEffect(() => {
    if (!mapInstance || !window.kakao) return;

    const position = new window.kakao.maps.LatLng(
      marker.position.lat,
      marker.position.lng
    );

    // 마커 이미지 설정
    let imageSrc = '';
    let imageSize = new window.kakao.maps.Size(24, 24);
    let imageOption = { offset: new window.kakao.maps.Point(12, 12) };

    switch (marker.type) {
      case 'start':
        imageSrc =
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerRed.png';
        break;
      case 'end':
        imageSrc =
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerBlue.png';
        break;
      case 'stamp':
        imageSrc = marker.isStampCollected
          ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerGreen.png'
          : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
        break;
      case 'photo':
        imageSrc =
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerYellow.png';
        break;
      default:
        imageSrc =
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    }

    // 마커 크기 조정
    if (marker.size === 'small') {
      imageSize = new window.kakao.maps.Size(16, 16);
      imageOption = { offset: new window.kakao.maps.Point(8, 8) };
    } else if (marker.size === 'large') {
      imageSize = new window.kakao.maps.Size(32, 32);
      imageOption = { offset: new window.kakao.maps.Point(16, 16) };
    }

    const markerImage = new window.kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );

    const kakaoMarker = new window.kakao.maps.Marker({
      position,
      image: markerImage,
    });

    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(kakaoMarker, 'click', () => {
      onClick?.(marker);
    });

    // 마커 호버 이벤트
    window.kakao.maps.event.addListener(kakaoMarker, 'mouseover', () => {
      onHover?.(marker);
    });

    // 지도에 마커 표시
    kakaoMarker.setMap(mapInstance);
    markerRef.current = kakaoMarker;

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [marker, mapInstance, onClick, onHover]);

  // 마커 가시성 제어
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setMap(isVisible ? mapInstance : null);
    }
  }, [isVisible, mapInstance]);

  // 마커 위치 업데이트
  useEffect(() => {
    if (markerRef.current) {
      const position = new window.kakao.maps.LatLng(
        marker.position.lat,
        marker.position.lng
      );
      markerRef.current.setPosition(position);
    }
  }, [marker.position]);

  // 마커 상태 업데이트 (방문, 스탬프 수집 등)
  useEffect(() => {
    if (markerRef.current && marker.type === 'stamp') {
      const imageSrc = marker.isStampCollected
        ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerGreen.png'
        : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        new window.kakao.maps.Size(24, 24),
        { offset: new window.kakao.maps.Point(12, 12) }
      );

      markerRef.current.setImage(markerImage);
    }
  }, [marker.isStampCollected, marker.type]);

  return null; // 이 컴포넌트는 DOM 요소를 직접 렌더링하지 않음
}

/**
 * 🎯 마커 팝업 컴포넌트
 * 마커 클릭 시 표시되는 정보 팝업입니다.
 */
interface MarkerPopupProps {
  marker: Marker;
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

export function MarkerPopup({
  marker,
  isVisible,
  onClose,
  className = '',
}: MarkerPopupProps) {
  if (!isVisible) return null;

  return (
    <div
      className={`absolute z-10 bg-white rounded-lg shadow-lg p-4 min-w-64 max-w-80 ${className}`}
    >
      {/* 팝업 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              marker.type === 'start'
                ? 'bg-red-500'
                : marker.type === 'end'
                  ? 'bg-blue-500'
                  : marker.type === 'stamp'
                    ? marker.isStampCollected
                      ? 'bg-green-500'
                      : 'bg-yellow-500'
                    : 'bg-gray-500'
            }`}
          />
          <h3 className="font-semibold text-gray-900">
            {marker.location.name}
          </h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      {/* 팝업 내용 */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">{marker.location.description}</p>

        {marker.location.category && (
          <div className="flex items-center gap-1">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {marker.location.category}
            </span>
          </div>
        )}

        {marker.location.estimatedTime && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>⏱️</span>
            <span>예상 소요시간: {marker.location.estimatedTime}분</span>
          </div>
        )}

        {marker.location.difficulty && (
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>📊</span>
            <span>난이도: {marker.location.difficulty}</span>
          </div>
        )}

        {/* 스탬프 상태 */}
        {marker.type === 'stamp' && (
          <div
            className={`text-sm font-medium ${
              marker.isStampCollected ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {marker.isStampCollected
              ? '✅ 스탬프 수집 완료'
              : '🎯 스탬프 수집 가능'}
          </div>
        )}

        {/* 방문 상태 */}
        {marker.isVisited && (
          <div className="text-sm text-green-600 font-medium">✅ 방문 완료</div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex gap-2 pt-2">
          {marker.location.qrCode && (
            <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
              QR 스캔
            </button>
          )}

          {marker.location.media && marker.location.media.length > 0 && (
            <button className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
              미디어 보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
