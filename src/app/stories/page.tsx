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
        const allCourses = data.courses || data.courses || [];

        // 초기 로딩 시 랜덤 추천 (6개)
        const randomCourses = getRandomCourses(allCourses, 6);
        setRecommendedCourses(randomCourses);

        console.log('랜덤 추천 결과:', randomCourses.length, '개');
      } else {
        console.error('API response not ok:', response.status);
        setRecommendedCourses(fallbackCourses.slice(0, 6));
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setRecommendedCourses(fallbackCourses.slice(0, 6));
    } finally {
      setLoading(false);
    }
  };

  // 랜덤 코스 선택 함수 (중복 제거)
  const getRandomCourses = (courses: any[], count: number) => {
    if (courses.length <= count) return courses;

    // 중복 제거 (제목 기준)
    const uniqueCourses = courses.filter(
      (course, index, self) =>
        index === self.findIndex((c) => c.title === course.title)
    );

    const shuffled = [...uniqueCourses].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handlePreferencesSubmit = (prefs: any) => {
    setPreferences(prefs);
    console.log('사용자 선호도:', prefs);

    // 개인화된 추천 로직 구현
    fetchPersonalizedCourses(prefs);
  };

  // 개인화된 코스 추천 함수
  const fetchPersonalizedCourses = async (preferences: any) => {
    setLoading(true);
    try {
      // 선호도에 따른 필터링 로직
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        const allCourses = data.courses || data.courses || [];

        // 선호도 기반 필터링
        const filteredCourses = filterCoursesByPreferences(
          allCourses,
          preferences
        );
        setRecommendedCourses(filteredCourses);

        console.log('개인화된 추천 결과:', filteredCourses.length, '개');
        console.log(
          '추천된 코스:',
          filteredCourses.map((c) => c.title)
        );
      } else {
        console.error('API response not ok:', response.status);
        setRecommendedCourses([]);
      }
    } catch (error) {
      console.error('Failed to fetch personalized courses:', error);
      setRecommendedCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // 선호도 기반 코스 필터링 함수
  const filterCoursesByPreferences = (courses: any[], preferences: any) => {
    if (!preferences || !courses || courses.length === 0) {
      return courses.slice(0, 6); // 기본 6개
    }

    let filtered = [...courses];

    // 카테고리 필터링
    if (preferences.categories && preferences.categories.length > 0) {
      filtered = filtered.filter(
        (course) =>
          course.category && preferences.categories.includes(course.category)
      );
    }

    // 난이도 필터링
    if (preferences.difficulty) {
      filtered = filtered.filter(
        (course) => course.difficulty === preferences.difficulty
      );
    }

    // 시간 필터링
    if (preferences.duration) {
      const maxMinutes = preferences.duration * 60;
      filtered = filtered.filter((course) => {
        if (!course.duration) return true; // duration이 없으면 포함
        const courseMinutes =
          parseInt(course.duration.replace('시간', '')) * 60;
        return courseMinutes <= maxMinutes;
      });
    }

    // 평점 필터링
    if (preferences.minRating) {
      filtered = filtered.filter(
        (course) => (course.rating || 0) >= preferences.minRating
      );
    }

    // 결과가 6개 미만이면 부족한 만큼 추가
    if (filtered.length < 6) {
      const remaining = courses.filter(
        (course) => !filtered.some((f) => f.id === course.id)
      );
      filtered = [...filtered, ...remaining.slice(0, 6 - filtered.length)];
    }

    return filtered.slice(0, 6); // 최대 6개 반환
  };

  // Fallback 데이터 (마이그레이션 변경사항 반영)
  const fallbackCourses = [
    {
      id: '1',
      title: '포항 바다와 일몰의 만남',
      description:
        '영일대 해수욕장부터 구룡포까지, 포항의 바다를 만끽하는 코스',
      duration: '3시간',
      difficulty: '쉬움',
      rating: 4.8,
      image: 'https://picsum.photos/400/300?random=1',
      category: '자연경관',
      locations: ['영일대 해수욕장', '구룡포', '호미곶'],
    },
    {
      id: '2',
      title: '호미곶 일출 투어',
      description: '한반도 최동단에서 만나는 역사와 웅장한 일출',
      duration: '5시간',
      difficulty: '보통',
      rating: 4.6,
      image: 'https://picsum.photos/400/300?random=2',
      category: '자연경관',
      locations: ['호미곶', '국립등대박물관', '상생의 손'],
    },
    {
      id: '3',
      title: '포항 해수욕장 완전정복',
      description:
        '월포, 칠포, 화진, 용한 해수욕장을 모두 방문하는 해수욕장 투어',
      duration: '6시간',
      difficulty: '보통',
      rating: 4.7,
      image: 'https://picsum.photos/400/300?random=3',
      category: '자연경관',
      locations: [
        '월포해수욕장',
        '칠포해수욕장',
        '화진해수욕장',
        '용한해수욕장',
      ],
    },
    {
      id: '4',
      title: '포항 문화유적 탐방',
      description:
        '국립등대박물관, 구룡포 과메기문화관, 연오랑세오녀 테마파크를 연결하는 문화 코스',
      duration: '5시간',
      difficulty: '쉬움',
      rating: 4.5,
      image: 'https://picsum.photos/400/300?random=4',
      category: '역사여행',
      locations: [
        '국립등대박물관',
        '구룡포 과메기문화관',
        '연오랑세오녀 테마파크',
      ],
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
        {preferences && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
                당신을 위한 맞춤 코스
              </h2>
              <p className="text-neutral-600 mb-4">
                선택하신 취향을 바탕으로 추천하는 특별한 포항 여행 코스입니다.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => fetchPersonalizedCourses(preferences)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '🔄 추천 중...' : '🔄 다른 추천 보기'}
                </button>
                <button
                  onClick={() => setPreferences(null)}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✏️ 취향 다시 선택
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-neutral-600">맞춤 코스를 찾고 있습니다...</p>
              </div>
            ) : recommendedCourses.length > 0 ? (
              <CourseCardList courses={recommendedCourses} />
            ) : (
              <div className="text-center py-12">
                <div className="text-neutral-500 mb-4">
                  <p className="text-lg font-medium mb-2">
                    😔 추천할 코스를 찾을 수 없습니다
                  </p>
                  <p>다른 취향을 선택하거나 필터를 조정해보세요.</p>
                </div>
                <button
                  onClick={() => setPreferences(null)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ✏️ 취향 다시 선택하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
