'use client';

import { useState, useCallback } from 'react';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  distance: number;
  cost: number;
  image: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  targetAudience: string[];
  activityLevel: string;
  category: string;
  recommendationScore: number;
  recommendationReason: string;
}

export interface RecommendationRequest {
  interests: string[];
  duration: string;
  companion: string;
  difficulty?: string;
  limit?: number;
}

export interface UseRecommendationsReturn {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  getRecommendations: (request: RecommendationRequest) => Promise<void>;
  trackInteraction: (courseId: string, action: string) => Promise<void>;
  refreshRecommendations: () => Promise<void>;
}

export function useRecommendations(): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<RecommendationRequest | null>(
    null
  );

  const getRecommendations = useCallback(
    async (request: RecommendationRequest) => {
      setLoading(true);
      setError(null);
      setLastRequest(request);

      try {
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '추천 요청에 실패했습니다.');
        }

        if (data.success) {
          setRecommendations(data.recommendations || []);
        } else {
          throw new Error('추천 데이터를 받아올 수 없습니다.');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('추천 요청 오류:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const trackInteraction = useCallback(
    async (courseId: string, action: string) => {
      try {
        await fetch('/api/recommendations', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId,
            action,
          }),
        });
      } catch (err) {
        console.error('상호작용 추적 오류:', err);
      }
    },
    []
  );

  const refreshRecommendations = useCallback(async () => {
    if (lastRequest) {
      await getRecommendations(lastRequest);
    }
  }, [lastRequest, getRecommendations]);

  return {
    recommendations,
    loading,
    error,
    getRecommendations,
    trackInteraction,
    refreshRecommendations,
  };
}
