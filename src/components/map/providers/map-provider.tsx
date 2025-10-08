'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import {
  MapState,
  MapCenter,
  Marker,
  Route,
  Stamp,
  ExperienceRecord,
} from '../types';

/**
 * 🗺️ 지도 컨텍스트 타입 정의
 */
interface MapContextType {
  // 상태
  state: MapState;

  // 지도 제어
  setCenter: (center: MapCenter) => void;
  setZoom: (level: number) => void;
  fitBounds: (markers: Marker[]) => void;

  // 마커 관리
  addMarker: (marker: Marker) => void;
  updateMarker: (markerId: string, updates: Partial<Marker>) => void;
  removeMarker: (markerId: string) => void;
  selectMarker: (marker: Marker) => void;

  // 경로 관리
  addRoute: (route: Route) => void;
  updateRoute: (routeId: string, updates: Partial<Route>) => void;
  removeRoute: (routeId: string) => void;
  selectRoute: (route: Route) => void;

  // 스탬프 관리
  collectStamp: (stampId: string) => void;
  getCollectedStamps: () => Stamp[];

  // 경험 기록
  addExperienceRecord: (record: ExperienceRecord) => void;
  getExperienceRecords: () => ExperienceRecord[];

  // 에러 처리
  setError: (error: string) => void;
  clearError: () => void;
}

/**
 * 🗺️ 지도 액션 타입
 */
type MapAction =
  | { type: 'SET_CENTER'; payload: MapCenter }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_LOADED'; payload: boolean }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'ADD_MARKER'; payload: Marker }
  | { type: 'UPDATE_MARKER'; payload: { id: string; updates: Partial<Marker> } }
  | { type: 'REMOVE_MARKER'; payload: string }
  | { type: 'SELECT_MARKER'; payload: Marker }
  | { type: 'ADD_ROUTE'; payload: Route }
  | { type: 'UPDATE_ROUTE'; payload: { id: string; updates: Partial<Route> } }
  | { type: 'REMOVE_ROUTE'; payload: string }
  | { type: 'SELECT_ROUTE'; payload: Route }
  | { type: 'COLLECT_STAMP'; payload: string }
  | { type: 'ADD_EXPERIENCE_RECORD'; payload: ExperienceRecord }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER_LOCATION'; payload: { lat: number; lng: number } };

/**
 * 🗺️ 지도 리듀서
 */
function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_CENTER':
      return { ...state, currentCenter: action.payload };

    case 'SET_ZOOM':
      return { ...state, currentLevel: action.payload };

    case 'SET_LOADED':
      return { ...state, isLoaded: action.payload };

    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };

    case 'ADD_MARKER':
      return {
        ...state,
        visibleMarkers: [...state.visibleMarkers, action.payload],
      };

    case 'UPDATE_MARKER':
      return {
        ...state,
        visibleMarkers: state.visibleMarkers.map((marker) =>
          marker.id === action.payload.id
            ? { ...marker, ...action.payload.updates }
            : marker
        ),
      };

    case 'REMOVE_MARKER':
      return {
        ...state,
        visibleMarkers: state.visibleMarkers.filter(
          (marker) => marker.id !== action.payload
        ),
      };

    case 'SELECT_MARKER':
      return { ...state, selectedMarker: action.payload };

    case 'ADD_ROUTE':
      return {
        ...state,
        routes: [...(state.routes || []), action.payload],
      };

    case 'UPDATE_ROUTE':
      return {
        ...state,
        routes: (state.routes || []).map((route) =>
          route.id === action.payload.id
            ? { ...route, ...action.payload.updates }
            : route
        ),
      };

    case 'REMOVE_ROUTE':
      return {
        ...state,
        routes: (state.routes || []).filter(
          (route) => route.id !== action.payload
        ),
      };

    case 'SELECT_ROUTE':
      return { ...state, selectedRoute: action.payload };

    case 'COLLECT_STAMP':
      return {
        ...state,
        collectedStamps: [
          ...state.collectedStamps,
          {
            id: action.payload,
            locationId: '',
            name: '',
            description: '',
            icon: '',
            isCollected: true,
          },
        ],
      };

    case 'ADD_EXPERIENCE_RECORD':
      return {
        ...state,
        experienceRecords: [...(state.experienceRecords || []), action.payload],
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: undefined };

    case 'SET_USER_LOCATION':
      return { ...state, userLocation: action.payload };

    default:
      return state;
  }
}

/**
 * 🗺️ 지도 컨텍스트 생성
 */
const MapContext = createContext<MapContextType | undefined>(undefined);

/**
 * 🗺️ 지도 프로바이더 컴포넌트
 */
interface MapProviderProps {
  children: React.ReactNode;
  initialCenter: MapCenter;
}

export function MapProvider({ children, initialCenter }: MapProviderProps) {
  const [state, dispatch] = useReducer(mapReducer, {
    isLoaded: false,
    isInitialized: false,
    currentCenter: initialCenter,
    currentLevel: initialCenter.level || 12,
    visibleMarkers: [],
    routes: [],
    collectedStamps: [],
    experienceRecords: [],
  });

  // 지도 제어 함수들
  const setCenter = useCallback((center: MapCenter) => {
    dispatch({ type: 'SET_CENTER', payload: center });
  }, []);

  const setZoom = useCallback((level: number) => {
    dispatch({ type: 'SET_ZOOM', payload: level });
  }, []);

  const fitBounds = useCallback((markers: Marker[]) => {
    if (markers.length === 0) return;

    // 모든 마커를 포함하는 중심점 계산
    const latSum = markers.reduce(
      (sum, marker) => sum + marker.position.lat,
      0
    );
    const lngSum = markers.reduce(
      (sum, marker) => sum + marker.position.lng,
      0
    );
    const center = {
      lat: latSum / markers.length,
      lng: lngSum / markers.length,
    };

    dispatch({ type: 'SET_CENTER', payload: center });
  }, []);

  // 마커 관리 함수들
  const addMarker = useCallback((marker: Marker) => {
    dispatch({ type: 'ADD_MARKER', payload: marker });
  }, []);

  const updateMarker = useCallback(
    (markerId: string, updates: Partial<Marker>) => {
      dispatch({ type: 'UPDATE_MARKER', payload: { id: markerId, updates } });
    },
    []
  );

  const removeMarker = useCallback((markerId: string) => {
    dispatch({ type: 'REMOVE_MARKER', payload: markerId });
  }, []);

  const selectMarker = useCallback((marker: Marker) => {
    dispatch({ type: 'SELECT_MARKER', payload: marker });
  }, []);

  // 경로 관리 함수들
  const addRoute = useCallback((route: Route) => {
    dispatch({ type: 'ADD_ROUTE', payload: route });
  }, []);

  const updateRoute = useCallback(
    (routeId: string, updates: Partial<Route>) => {
      dispatch({ type: 'UPDATE_ROUTE', payload: { id: routeId, updates } });
    },
    []
  );

  const removeRoute = useCallback((routeId: string) => {
    dispatch({ type: 'REMOVE_ROUTE', payload: routeId });
  }, []);

  const selectRoute = useCallback((route: Route) => {
    dispatch({ type: 'SELECT_ROUTE', payload: route });
  }, []);

  // 스탬프 관리 함수들
  const collectStamp = useCallback((stampId: string) => {
    dispatch({ type: 'COLLECT_STAMP', payload: stampId });
  }, []);

  const getCollectedStamps = useCallback(() => {
    return state.collectedStamps;
  }, [state.collectedStamps]);

  // 경험 기록 관리 함수들
  const addExperienceRecord = useCallback((record: ExperienceRecord) => {
    dispatch({ type: 'ADD_EXPERIENCE_RECORD', payload: record });
  }, []);

  const getExperienceRecords = useCallback(() => {
    return state.experienceRecords || [];
  }, [state.experienceRecords]);

  // 에러 처리 함수들
  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const contextValue: MapContextType = {
    state,
    setCenter,
    setZoom,
    fitBounds,
    addMarker,
    updateMarker,
    removeMarker,
    selectMarker,
    addRoute,
    updateRoute,
    removeRoute,
    selectRoute,
    collectStamp,
    getCollectedStamps,
    addExperienceRecord,
    getExperienceRecords,
    setError,
    clearError,
  };

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
}

/**
 * 🗺️ 지도 컨텍스트 훅
 */
export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
}
