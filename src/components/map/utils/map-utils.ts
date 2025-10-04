/**
 * 🗺️ 지도 유틸리티 함수들
 * 지도 관련 공통 기능을 제공합니다.
 */

import { Coordinate, MapCenter, Marker, Route } from '../types';

/**
 * 두 좌표 간의 거리 계산 (하버사인 공식)
 */
export function calculateDistance(point1: Coordinate, point2: Coordinate): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 좌표 배열의 중심점 계산
 */
export function calculateCenter(coordinates: Coordinate[]): MapCenter {
  if (coordinates.length === 0) {
    return { lat: 36.019, lng: 129.3435 }; // 포항시 기본 중심점
  }

  const latSum = coordinates.reduce((sum, coord) => sum + coord.lat, 0);
  const lngSum = coordinates.reduce((sum, coord) => sum + coord.lng, 0);
  
  return {
    lat: latSum / coordinates.length,
    lng: lngSum / coordinates.length,
  };
}

/**
 * 좌표 배열의 경계 상자 계산
 */
export function calculateBounds(coordinates: Coordinate[]): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  if (coordinates.length === 0) {
    return {
      north: 36.019,
      south: 36.019,
      east: 129.3435,
      west: 129.3435,
    };
  }

  const lats = coordinates.map(coord => coord.lat);
  const lngs = coordinates.map(coord => coord.lng);

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
}

/**
 * 경로의 총 거리 계산
 */
export function calculateRouteDistance(waypoints: Coordinate[]): number {
  if (waypoints.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += calculateDistance(waypoints[i], waypoints[i + 1]);
  }
  
  return totalDistance;
}

/**
 * 경로의 예상 소요 시간 계산 (도보 기준)
 */
export function calculateRouteTime(waypoints: Coordinate[], walkingSpeed: number = 4): number {
  const distance = calculateRouteDistance(waypoints);
  return Math.round((distance / walkingSpeed) * 60); // 분 단위
}

/**
 * 경로 최적화 (TSP 근사 알고리즘)
 */
export function optimizeRoute(waypoints: Coordinate[]): Coordinate[] {
  if (waypoints.length <= 2) return waypoints;

  // 간단한 최근접 이웃 알고리즘
  const optimized: Coordinate[] = [waypoints[0]];
  const remaining = [...waypoints.slice(1)];
  
  while (remaining.length > 0) {
    const lastPoint = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    
    for (let i = 0; i < remaining.length; i++) {
      const distance = calculateDistance(lastPoint, remaining[i]);
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }
    
    optimized.push(remaining[nearestIndex]);
    remaining.splice(nearestIndex, 1);
  }
  
  return optimized;
}

/**
 * 마커 클러스터링
 */
export function clusterMarkers(
  markers: Marker[], 
  maxZoom: number = 10,
  clusterDistance: number = 0.01
): { center: Coordinate; markers: Marker[] }[] {
  const clusters: { center: Coordinate; markers: Marker[] }[] = [];

  markers.forEach(marker => {
    let addedToCluster = false;
    
    for (const cluster of clusters) {
      const distance = calculateDistance(marker.position, cluster.center);
      
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
}

/**
 * 좌표가 경계 상자 내에 있는지 확인
 */
export function isCoordinateInBounds(
  coordinate: Coordinate,
  bounds: { north: number; south: number; east: number; west: number }
): boolean {
  return (
    coordinate.lat >= bounds.south &&
    coordinate.lat <= bounds.north &&
    coordinate.lng >= bounds.west &&
    coordinate.lng <= bounds.east
  );
}

/**
 * 좌표를 지도 타일 좌표로 변환
 */
export function coordinateToTile(
  coordinate: Coordinate,
  zoom: number
): { x: number; y: number } {
  const latRad = coordinate.lat * Math.PI / 180;
  const n = Math.pow(2, zoom);
  
  const x = Math.floor((coordinate.lng + 180) / 360 * n);
  const y = Math.floor((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n);
  
  return { x, y };
}

/**
 * 지도 타일 좌표를 좌표로 변환
 */
export function tileToCoordinate(
  tile: { x: number; y: number },
  zoom: number
): Coordinate {
  const n = Math.pow(2, zoom);
  
  const lng = (tile.x / n) * 360 - 180;
  const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * tile.y / n))) * 180 / Math.PI;
  
  return { lat, lng };
}

/**
 * 줌 레벨에 따른 스케일 계산
 */
export function getScaleFromZoom(zoom: number): number {
  return 1000000 / Math.pow(2, zoom - 1);
}

/**
 * 거리에 따른 적절한 줌 레벨 계산
 */
export function getZoomFromDistance(distance: number): number {
  if (distance <= 0.1) return 18; // 매우 가까운 거리
  if (distance <= 0.5) return 16; // 가까운 거리
  if (distance <= 1) return 14; // 근거리
  if (distance <= 5) return 12; // 중거리
  if (distance <= 10) return 10; // 원거리
  if (distance <= 50) return 8; // 매우 원거리
  return 6; // 극도로 원거리
}

/**
 * 좌표 배열을 GeoJSON LineString으로 변환
 */
export function coordinatesToGeoJSON(coordinates: Coordinate[]): any {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: coordinates.map(coord => [coord.lng, coord.lat]),
    },
    properties: {},
  };
}

/**
 * GeoJSON LineString을 좌표 배열로 변환
 */
export function geoJSONToCoordinates(geoJSON: any): Coordinate[] {
  if (geoJSON.type !== 'Feature' || geoJSON.geometry.type !== 'LineString') {
    return [];
  }
  
  return geoJSON.geometry.coordinates.map((coord: number[]) => ({
    lat: coord[1],
    lng: coord[0],
  }));
}

/**
 * 좌표를 주소로 변환 (카카오맵 API 사용)
 */
export async function coordinateToAddress(coordinate: Coordinate): Promise<string> {
  if (!window.kakao || !window.kakao.maps) {
    throw new Error('카카오맵 API가 로드되지 않았습니다.');
  }

  return new Promise((resolve, reject) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const latlng = new window.kakao.maps.LatLng(coordinate.lat, coordinate.lng);
    
    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0].address.address_name;
        resolve(address);
      } else {
        reject(new Error('주소 변환에 실패했습니다.'));
      }
    });
  });
}

/**
 * 주소를 좌표로 변환 (카카오맵 API 사용)
 */
export async function addressToCoordinate(address: string): Promise<Coordinate> {
  if (!window.kakao || !window.kakao.maps) {
    throw new Error('카카오맵 API가 로드되지 않았습니다.');
  }

  return new Promise((resolve, reject) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    
    geocoder.addressSearch(address, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const lat = parseFloat(result[0].y);
        const lng = parseFloat(result[0].x);
        resolve({ lat, lng });
      } else {
        reject(new Error('좌표 변환에 실패했습니다.'));
      }
    });
  });
}

/**
 * 현재 위치 가져오기
 */
export function getCurrentLocation(): Promise<Coordinate> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('지리적 위치를 지원하지 않는 브라우저입니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`위치 정보를 가져올 수 없습니다: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * 좌표 유효성 검사
 */
export function isValidCoordinate(coordinate: Coordinate): boolean {
  return (
    typeof coordinate.lat === 'number' &&
    typeof coordinate.lng === 'number' &&
    coordinate.lat >= -90 &&
    coordinate.lat <= 90 &&
    coordinate.lng >= -180 &&
    coordinate.lng <= 180 &&
    !isNaN(coordinate.lat) &&
    !isNaN(coordinate.lng)
  );
}

/**
 * 좌표 배열 유효성 검사
 */
export function isValidCoordinateArray(coordinates: Coordinate[]): boolean {
  return coordinates.length > 0 && coordinates.every(isValidCoordinate);
}
