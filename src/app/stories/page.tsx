'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { PreferenceForm } from '@/components/stories/preference-form';
import { CourseCardList } from '@/components/stories/course-card-list';
import { useState, useEffect } from 'react';

export default function StoriesPage() {
  const [preferences, setPreferences] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // API에서 코스 데이터 가져오기
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setRecommendedCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handlePreferencesSubmit = (prefs: any) => {
    setPreferences(prefs);
    // TODO: AI 추천 로직 구현
    // 현재는 전체 코스 목록 표시
    fetchCourses();
  };

  // Fallback 데이터
  const fallbackCourses = [
    {
      id: '1',
      title: '포항 바다 이야기',
      description:
        '영일대 해수욕장부터 포항운하까지, 포항의 바다를 만끽하는 코스',
      duration: '3시간',
      difficulty: '쉬움',
      rating: 4.8,
      image: 'https://picsum.photos/400/300?random=1',
      category: '자연경관',
      locations: ['영일대 해수욕장', '포항운하', '호미곶'],
    },
    {
      id: '2',
      title: '호미곶 역사 기행',
      description: '한반도 최동단에서 만나는 역사와 웅장한 일출',
      duration: '4시간',
      difficulty: '보통',
      rating: 4.6,
      image: 'https://picsum.photos/400/300?random=2',
      category: '역사여행',
      locations: ['호미곶', '등대', '일출공원'],
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* 페이지 헤더 */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900">
            스토리 탐험
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
            당신의 취향에 맞는 포항의 특별한 스토리 코스를 발견해보세요. AI가
            추천하는 맞춤형 여행 경험을 시작하세요.
          </p>
        </div>

        {/* 취향 입력 폼 */}
        {!preferences && <PreferenceForm onSubmit={handlePreferencesSubmit} />}

        {/* 추천 코스 목록 */}
        {preferences && recommendedCourses.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
                당신을 위한 맞춤 코스
              </h2>
              <p className="text-neutral-600">
                선택하신 취향을 바탕으로 추천하는 특별한 포항 여행 코스입니다.
              </p>
            </div>
            <CourseCardList courses={recommendedCourses} />
          </div>
        )}

        {/* 추천 결과가 없는 경우 */}
        {preferences && recommendedCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-neutral-500">
              <p className="text-lg">추천할 수 있는 코스가 없습니다.</p>
              <p className="text-sm mt-2">다른 취향으로 다시 시도해보세요.</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
