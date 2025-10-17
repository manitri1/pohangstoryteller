'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, MapPin, Clock, Star, Heart, Bookmark } from 'lucide-react';
import AuthGuard from '@/components/auth/auth-guard';
import PreferenceSelector from '@/components/stories/preference-selector';
import CourseRecommendations from '@/components/stories/course-recommendations';

const mockStories = [
  {
    id: 1,
    title: '포항의 숨겨진 바다 이야기',
    description: '동해의 푸른 바다와 함께하는 포항의 아름다운 해안가 스토리',
    duration: '2-3시간',
    difficulty: '쉬움',
    rating: 4.8,
    image: 'https://picsum.photos/400/300?random=1',
    tags: ['바다', '해안가', '자연'],
    isBookmarked: false,
    isLiked: false,
  },
  {
    id: 2,
    title: '포항의 역사를 따라 걷는 길',
    description: '포항의 유구한 역사와 문화를 체험할 수 있는 역사 탐방 코스',
    duration: '3-4시간',
    difficulty: '보통',
    rating: 4.6,
    image: 'https://picsum.photos/400/300?random=2',
    tags: ['역사', '문화', '박물관'],
    isBookmarked: false,
    isLiked: false,
  },
  {
    id: 3,
    title: '포항 맛집 투어',
    description: '포항의 대표적인 맛집들을 찾아가는 미식 여행',
    duration: '4-5시간',
    difficulty: '쉬움',
    rating: 4.9,
    image: 'https://picsum.photos/400/300?random=3',
    tags: ['맛집', '미식', '로컬'],
    isBookmarked: false,
    isLiked: false,
  },
];

export default function StoriesPage() {
  const { data: session } = useSession();
  const [stories, setStories] = useState(mockStories);
  const [currentStep, setCurrentStep] = useState<
    'preferences' | 'recommendations' | 'list'
  >('preferences');
  const [userPreferences, setUserPreferences] = useState<any>(null);

  const handleBookmark = (storyId: number) => {
    if (!session) {
      // 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트
      window.location.href = '/auth/signin';
      return;
    }

    setStories((prev) =>
      prev.map((story) =>
        story.id === storyId
          ? { ...story, isBookmarked: !story.isBookmarked }
          : story
      )
    );
  };

  const handleLike = (storyId: number) => {
    if (!session) {
      window.location.href = '/auth/signin';
      return;
    }

    setStories((prev) =>
      prev.map((story) =>
        story.id === storyId ? { ...story, isLiked: !story.isLiked } : story
      )
    );
  };

  const handlePreferencesSelected = (preferences: any) => {
    setUserPreferences(preferences);
    setCurrentStep('recommendations');
  };

  const handleBackToPreferences = () => {
    setCurrentStep('preferences');
  };

  const handleStartCourse = (courseId: number) => {
    // 코스 시작 로직 - 지도 페이지로 이동
    console.log(`코스 ${courseId} 시작`);

    // 선택된 코스 정보를 로컬 스토리지에 저장
    const selectedCourse = {
      id: courseId,
      startedAt: new Date().toISOString(),
      status: 'active',
    };
    localStorage.setItem('activeCourse', JSON.stringify(selectedCourse));

    // 지도 페이지로 이동 (스탬프 페이지가 지도 기능을 포함)
    window.location.href = '/stamps';
  };

  const handleShowAllStories = () => {
    setCurrentStep('list');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            포항 스토리 탐험
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            포항의 매력을 담은 스토리 기반 여행 코스를 탐험해보세요.
            {!session && (
              <span className="block mt-2 text-sm text-blue-600">
                로그인하면 개인화된 추천과 즐겨찾기 기능을 이용할 수 있습니다.
              </span>
            )}
          </p>
        </div>

        {/* 단계별 컨텐츠 렌더링 */}
        {currentStep === 'preferences' && (
          <PreferenceSelector
            onPreferencesSelected={handlePreferencesSelected}
          />
        )}

        {currentStep === 'recommendations' && userPreferences && (
          <CourseRecommendations
            preferences={userPreferences}
            onBackToPreferences={handleBackToPreferences}
            onStartCourse={handleStartCourse}
          />
        )}

        {currentStep === 'list' && (
          <div className="space-y-6">
            <div className="text-center">
              <Button variant="outline" onClick={handleBackToPreferences}>
                맞춤형 추천 받기
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Card
                  key={story.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Button
                        size="sm"
                        variant={story.isBookmarked ? 'default' : 'secondary'}
                        onClick={() => handleBookmark(story.id)}
                        className="rounded-full"
                      >
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={story.isLiked ? 'default' : 'secondary'}
                        onClick={() => handleLike(story.id)}
                        className="rounded-full"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{story.description}</p>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {story.duration}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {story.difficulty}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">
                          {story.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {story.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {session && currentStep === 'list' && (
          <div className="mt-8 text-center">
            <Button size="lg">
              <BookOpen className="w-5 h-5 mr-2" />
              나만의 스토리 만들기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
