'use client';

import { useState, useCallback } from 'react';
import { StampTour, StampInTour } from '@/types/stamp-tour';

interface StampCollectionState {
  tours: StampTour[];
  collectedStamps: string[];
  totalPoints: number;
  completionRate: number;
}

interface UseStampCollectionReturn {
  tours: StampTour[];
  collectedStamps: string[];
  totalPoints: number;
  completionRate: number;
  collectStamp: (stampId: string, tourId: string) => Promise<boolean>;
  isStampCollected: (stampId: string) => boolean;
  getTourProgress: (tourId: string) => number;
  getTourCompletion: (tourId: string) => boolean;
  updateTourProgress: (tourId: string) => void;
  resetCollection: () => void;
}

export function useStampCollection(
  initialTours: StampTour[]
): UseStampCollectionReturn {
  const [state, setState] = useState<StampCollectionState>(() => {
    // 로컬 스토리지에서 저장된 데이터 로드
    const savedData = localStorage.getItem('stampCollection');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return {
          tours: parsed.tours || initialTours,
          collectedStamps: parsed.collectedStamps || [],
          totalPoints: parsed.totalPoints || 0,
          completionRate: parsed.completionRate || 0,
        };
      } catch (error) {
        console.error('저장된 데이터 파싱 실패:', error);
      }
    }

    return {
      tours: initialTours,
      collectedStamps: [],
      totalPoints: 0,
      completionRate: 0,
    };
  });

  const saveToLocalStorage = useCallback((newState: StampCollectionState) => {
    try {
      localStorage.setItem('stampCollection', JSON.stringify(newState));
    } catch (error) {
      console.error('로컬 스토리지 저장 실패:', error);
    }
  }, []);

  const collectStamp = useCallback(
    async (stampId: string, tourId: string): Promise<boolean> => {
      console.log('collectStamp 호출:', {
        stampId,
        tourId,
        currentState: state,
      });

      try {
        // 이미 수집된 스탬프인지 확인
        if (state.collectedStamps.includes(stampId)) {
          console.log('이미 수집된 스탬프:', stampId);
          return false;
        }

        // 스탬프 수집 처리
        const updatedTours = state.tours.map((tour) => {
          if (tour.id === tourId) {
            const updatedStamps = tour.stamps.map((stamp) => {
              if (stamp.id === stampId) {
                return {
                  ...stamp,
                  isCollected: true,
                  collectedAt: new Date().toISOString(),
                };
              }
              return stamp;
            });

            const collectedCount = updatedStamps.filter(
              (stamp) => stamp.isCollected
            ).length;
            const completionRate = Math.round(
              (collectedCount / tour.totalStamps) * 100
            );
            const isCompleted = collectedCount === tour.totalStamps;

            return {
              ...tour,
              stamps: updatedStamps,
              collectedStamps: collectedCount,
              completionRate,
              isCompleted,
            };
          }
          return tour;
        });

        // 전체 통계 계산
        const allCollectedStamps = updatedTours.flatMap((tour) =>
          tour.stamps
            .filter((stamp) => stamp.isCollected)
            .map((stamp) => stamp.id)
        );

        const totalPoints = updatedTours.reduce(
          (sum, tour) =>
            sum +
            tour.stamps
              .filter((stamp) => stamp.isCollected)
              .reduce((stampSum, stamp) => stampSum + stamp.points, 0),
          0
        );

        const totalStamps = updatedTours.reduce(
          (sum, tour) => sum + tour.totalStamps,
          0
        );
        const overallCompletionRate =
          totalStamps > 0
            ? Math.round((allCollectedStamps.length / totalStamps) * 100)
            : 0;

        const newState: StampCollectionState = {
          tours: updatedTours,
          collectedStamps: allCollectedStamps,
          totalPoints,
          completionRate: overallCompletionRate,
        };

        console.log('새로운 상태 설정:', newState);
        setState(newState);
        saveToLocalStorage(newState);

        // 서버에 동기화 (실제 구현에서는 API 호출)
        console.log('서버 동기화 시작');
        await syncWithServer(stampId, tourId);
        console.log('서버 동기화 완료');

        return true;
      } catch (error) {
        console.error('스탬프 수집 실패:', error);
        return false;
      }
    },
    [state, saveToLocalStorage]
  );

  const syncWithServer = async (stampId: string, tourId: string) => {
    try {
      // Next-Auth 세션에서 토큰 가져오기
      const sessionResponse = await fetch('/api/auth/session');
      const session = await sessionResponse.json();

      if (!session?.user) {
        console.log('인증되지 않은 사용자 - 오프라인 모드로 작동');
        return; // 인증되지 않은 경우 조용히 넘어감
      }

      // 실제 구현에서는 Supabase API 호출
      const response = await fetch('/api/stamps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken || ''}`,
        },
        body: JSON.stringify({
          locationId: stampId,
          qrCodeData: `STAMP_${stampId}`,
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
          },
          coordinates: {
            lat: 0, // 실제로는 현재 위치 사용
            lng: 0,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.warn(
          '서버 동기화 실패 (오프라인 모드로 계속):',
          errorData.error
        );
        return; // 오프라인 모드로 계속 진행
      }

      console.log('서버 동기화 성공');
    } catch (error) {
      console.warn('서버 동기화 실패 (오프라인 모드로 계속):', error);
      // 오프라인 모드에서는 로컬 스토리지만 사용
    }
  };

  const isStampCollected = useCallback(
    (stampId: string): boolean => {
      return state.collectedStamps.includes(stampId);
    },
    [state.collectedStamps]
  );

  const getTourProgress = useCallback(
    (tourId: string): number => {
      const tour = state.tours.find((t) => t.id === tourId);
      return tour ? tour.completionRate : 0;
    },
    [state.tours]
  );

  const getTourCompletion = useCallback(
    (tourId: string): boolean => {
      const tour = state.tours.find((t) => t.id === tourId);
      return tour ? tour.isCompleted : false;
    },
    [state.tours]
  );

  const updateTourProgress = useCallback(
    (tourId: string) => {
      setState((prevState) => {
        const updatedTours = prevState.tours.map((tour) => {
          if (tour.id === tourId) {
            const collectedCount = tour.stamps.filter(
              (stamp) => stamp.isCollected
            ).length;
            const completionRate = Math.round(
              (collectedCount / tour.totalStamps) * 100
            );
            const isCompleted = collectedCount === tour.totalStamps;

            return {
              ...tour,
              collectedStamps: collectedCount,
              completionRate,
              isCompleted,
            };
          }
          return tour;
        });

        const newState = {
          ...prevState,
          tours: updatedTours,
        };

        saveToLocalStorage(newState);
        return newState;
      });
    },
    [saveToLocalStorage]
  );

  const resetCollection = useCallback(() => {
    const resetState: StampCollectionState = {
      tours: initialTours,
      collectedStamps: [],
      totalPoints: 0,
      completionRate: 0,
    };

    setState(resetState);
    saveToLocalStorage(resetState);
  }, [initialTours, saveToLocalStorage]);

  return {
    tours: state.tours,
    collectedStamps: state.collectedStamps,
    totalPoints: state.totalPoints,
    completionRate: state.completionRate,
    collectStamp,
    isStampCollected,
    getTourProgress,
    getTourCompletion,
    updateTourProgress,
    resetCollection,
  };
}
