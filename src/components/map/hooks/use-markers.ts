'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Marker, Location, Coordinate } from '../types';

// Kakao Maps API 타입 선언
declare global {
  interface Window {
    kakao: any;
  }
}

const kakao = typeof window !== 'undefined' ? window.kakao : null;

/**
 * 🎯 마커 관리 훅
 * 지도상의 마커들을 생성, 업데이트, 삭제하는 기능을 제공합니다.
 */
export function useMarkers() {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [kakaoMarkers, setKakaoMarkers] = useState<any[]>([]);
  const mapInstanceRef = useRef<any>(null);

  // 마커 생성
  const createMarker = useCallback((markerData: Omit<Marker, 'id'>): Marker => {
    const marker: Marker = {
      id: `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...markerData,
    };
    return marker;
  }, []);

  // 위치에서 마커 생성
  const createMarkerFromLocation = useCallback(
    (location: Location, type: Marker['type'] = 'waypoint'): Marker => {
      return createMarker({
        location,
        position: location.coordinates,
        type,
        isVisited: false,
        isStampCollected: false,
      });
    },
    [createMarker]
  );

  // 마커 추가
  const addMarker = useCallback((marker: Marker) => {
    setMarkers((prev) => [...prev, marker]);
  }, []);

  // 마커들 추가
  const addMarkers = useCallback((newMarkers: Marker[]) => {
    setMarkers((prev) => [...prev, ...newMarkers]);
  }, []);

  // 마커 업데이트
  const updateMarker = useCallback(
    (markerId: string, updates: Partial<Marker>) => {
      setMarkers((prev) =>
        prev.map((marker) =>
          marker.id === markerId ? { ...marker, ...updates } : marker
        )
      );
    },
    []
  );

  // 마커 삭제
  const removeMarker = useCallback((markerId: string) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== markerId));
  }, []);

  // 모든 마커 삭제
  const clearMarkers = useCallback(() => {
    setMarkers([]);
  }, []);

  // 마커 방문 처리
  const markAsVisited = useCallback(
    (markerId: string) => {
      updateMarker(markerId, { isVisited: true });
    },
    [updateMarker]
  );

  // 스탬프 수집 처리
  const markStampCollected = useCallback(
    (markerId: string) => {
      updateMarker(markerId, { isStampCollected: true });
    },
    [updateMarker]
  );

  // 마커 아이콘 설정
  const setMarkerIcon = useCallback(
    (markerId: string, icon: string) => {
      updateMarker(markerId, { icon });
    },
    [updateMarker]
  );

  // 마커 크기 설정
  const setMarkerSize = useCallback(
    (markerId: string, size: Marker['size']) => {
      updateMarker(markerId, { size });
    },
    [updateMarker]
  );

  // 카카오맵 마커 생성
  const createKakaoMarker = useCallback((marker: Marker) => {
    if (!mapInstanceRef.current) return null;

    const position = new kakao.maps.LatLng(
      marker.position.lat,
      marker.position.lng
    );

    // 마커 이미지 설정
    let imageSrc = '';
    const imageSize = new kakao.maps.Size(24, 24);
    const imageOption = { offset: new kakao.maps.Point(12, 12) };

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

    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );
    const kakaoMarker = new kakao.maps.Marker({
      position,
      image: markerImage,
    });

    // 마커 클릭 이벤트
    kakao.maps.event.addListener(kakaoMarker, 'click', () => {
      // 마커 클릭 시 처리 로직
      console.log('마커 클릭:', marker);
    });

    return kakaoMarker;
  }, []);

  // 카카오맵에 마커 표시
  const showMarkersOnMap = useCallback(
    (mapInstance: any) => {
      if (!mapInstance) return;

      mapInstanceRef.current = mapInstance;

      // 기존 마커들 제거
      kakaoMarkers.forEach((marker) => marker.setMap(null));
      setKakaoMarkers([]);

      // 새 마커들 생성 및 표시
      const newKakaoMarkers = markers
        .map((marker) => createKakaoMarker(marker))
        .filter((marker) => marker !== null);

      newKakaoMarkers.forEach((marker) => {
        marker.setMap(mapInstance);
      });

      setKakaoMarkers(newKakaoMarkers);
    },
    [markers, createKakaoMarker, kakaoMarkers]
  );

  // 마커 클러스터링
  const clusterMarkers = useCallback(
    (markers: Marker[], maxZoom: number = 10) => {
      // 간단한 클러스터링 로직 (실제로는 더 복잡한 알고리즘 필요)
      const clusters: { center: Coordinate; markers: Marker[] }[] = [];
      const clusterDistance = 0.01; // 약 1km

      markers.forEach((marker) => {
        let addedToCluster = false;

        for (const cluster of clusters) {
          const distance = Math.sqrt(
            Math.pow(marker.position.lat - cluster.center.lat, 2) +
              Math.pow(marker.position.lng - cluster.center.lng, 2)
          );

          if (distance < clusterDistance) {
            cluster.markers.push(marker);
            addedToCluster = true;
            break;
          }
        }

        if (!addedToCluster) {
          clusters.push({
            center: marker.position,
            markers: [marker],
          });
        }
      });

      return clusters;
    },
    []
  );

  // 마커 필터링
  const filterMarkers = useCallback(
    (predicate: (marker: Marker) => boolean) => {
      return markers.filter(predicate);
    },
    [markers]
  );

  // 마커 검색
  const searchMarkers = useCallback(
    (query: string) => {
      return markers.filter(
        (marker) =>
          marker.location.name.toLowerCase().includes(query.toLowerCase()) ||
          marker.location.description
            .toLowerCase()
            .includes(query.toLowerCase())
      );
    },
    [markers]
  );

  // 마커 통계
  const getMarkerStats = useCallback(() => {
    const total = markers.length;
    const visited = markers.filter((m) => m.isVisited).length;
    const stampsCollected = markers.filter((m) => m.isStampCollected).length;
    const byType = markers.reduce(
      (acc, marker) => {
        acc[marker.type] = (acc[marker.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total,
      visited,
      stampsCollected,
      byType,
      completionRate: total > 0 ? (visited / total) * 100 : 0,
    };
  }, [markers]);

  return {
    markers,
    addMarker,
    addMarkers,
    updateMarker,
    removeMarker,
    clearMarkers,
    markAsVisited,
    markStampCollected,
    setMarkerIcon,
    setMarkerSize,
    createMarker,
    createMarkerFromLocation,
    showMarkersOnMap,
    clusterMarkers,
    filterMarkers,
    searchMarkers,
    getMarkerStats,
  };
}
