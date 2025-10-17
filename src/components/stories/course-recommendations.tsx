'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Clock,
  Star,
  Heart,
  Bookmark,
  ArrowLeft,
  Navigation,
} from 'lucide-react';

interface CourseRecommendationsProps {
  preferences: UserPreferences;
  onBackToPreferences: () => void;
  onStartCourse: (courseId: number) => void;
}

interface UserPreferences {
  interests: string[];
  travelDuration: string;
  companion: string;
}

interface RecommendedCourse {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  rating: number;
  image: string;
  tags: string[];
  locations: string[];
  estimatedCost: number;
  isBookmarked: boolean;
  isLiked: boolean;
  matchScore: number;
}

// AI 추천 로직을 시뮬레이션하는 함수
const generateRecommendations = (
  preferences: UserPreferences
): RecommendedCourse[] => {
  const allCourses: RecommendedCourse[] = [
    {
      id: 1,
      title: '포항 바다와 일출의 만남',
      description: '호미곶에서 영일대까지 바다를 따라가는 아름다운 해안 코스',
      duration: '4-5시간',
      difficulty: '쉬움',
      rating: 4.8,
      image: 'https://picsum.photos/400/300?random=1',
      tags: ['바다', '해안가', '자연', '일출'],
      locations: ['호미곶', '영일대 해수욕장', '포항 제철소 전망대'],
      estimatedCost: 15000,
      isBookmarked: false,
      isLiked: false,
      matchScore: 0,
    },
    {
      id: 2,
      title: '포항 역사 탐방',
      description: '포항의 유구한 역사와 문화를 체험할 수 있는 역사 탐방 코스',
      duration: '3-4시간',
      difficulty: '보통',
      rating: 4.6,
      image: 'https://picsum.photos/400/300?random=2',
      tags: ['역사', '문화', '박물관', '전통'],
      locations: ['포항시립미술관', '포항역사관', '죽도시장'],
      estimatedCost: 20000,
      isBookmarked: false,
      isLiked: false,
      matchScore: 0,
    },
    {
      id: 3,
      title: '포항 맛집 투어',
      description: '포항의 대표적인 맛집들을 찾아가는 미식 여행',
      duration: '4-5시간',
      difficulty: '쉬움',
      rating: 4.9,
      image: 'https://picsum.photos/400/300?random=3',
      tags: ['맛집', '미식', '로컬', '과메기'],
      locations: ['죽도시장', '포항 과메기 거리', '로컬 맛집'],
      estimatedCost: 30000,
      isBookmarked: false,
      isLiked: false,
      matchScore: 0,
    },
    {
      id: 4,
      title: '포항 골목길 산책',
      description: '포항의 숨겨진 골목길을 걸어보는 로컬 문화 체험',
      duration: '2-3시간',
      difficulty: '쉬움',
      rating: 4.5,
      image: 'https://picsum.photos/400/300?random=4',
      tags: ['골목길', '로컬', '산책', '문화'],
      locations: ['포항 구도심', '전통 골목', '로컬 카페'],
      estimatedCost: 10000,
      isBookmarked: false,
      isLiked: false,
      matchScore: 0,
    },
    {
      id: 5,
      title: '포항 가족 체험',
      description: '모든 연령대가 즐길 수 있는 가족 친화적 코스',
      duration: '5-6시간',
      difficulty: '쉬움',
      rating: 4.7,
      image: 'https://picsum.photos/400/300?random=5',
      tags: ['가족', '체험', '교육', '안전'],
      locations: ['포항야생탐사관', '체험관', '가족공원'],
      estimatedCost: 25000,
      isBookmarked: false,
      isLiked: false,
      matchScore: 0,
    },
    {
      id: 6,
      title: '포항 로맨틱 데이트',
      description: '연인과 함께하는 로맨틱한 포항 데이트 코스',
      duration: '3-4시간',
      difficulty: '쉬움',
      rating: 4.8,
      image: 'https://picsum.photos/400/300?random=6',
      tags: ['로맨틱', '데이트', '커플', '아름다운'],
      locations: ['호미곶 일출', '해안 카페', '로맨틱 스팟'],
      estimatedCost: 20000,
      isBookmarked: false,
      isLiked: false,
      matchScore: 0,
    },
  ];

  // AI 추천 로직 시뮬레이션
  return allCourses
    .map((course) => {
      let matchScore = 0;

      // 관심사 매칭
      preferences.interests.forEach((interest) => {
        if (interest === 'nature' && course.tags.includes('바다'))
          matchScore += 30;
        if (interest === 'history' && course.tags.includes('역사'))
          matchScore += 30;
        if (interest === 'food' && course.tags.includes('맛집'))
          matchScore += 30;
        if (interest === 'culture' && course.tags.includes('골목길'))
          matchScore += 30;
      });

      // 여행 기간 매칭
      if (
        preferences.travelDuration === 'half_day' &&
        course.duration.includes('2-3')
      )
        matchScore += 20;
      if (
        preferences.travelDuration === 'full_day' &&
        course.duration.includes('4-6')
      )
        matchScore += 20;
      if (
        preferences.travelDuration === 'weekend' &&
        course.duration.includes('5-6')
      )
        matchScore += 20;
      if (preferences.travelDuration === 'long_term') matchScore += 10;

      // 동반자 매칭
      if (preferences.companion === 'family' && course.tags.includes('가족'))
        matchScore += 20;
      if (preferences.companion === 'couple' && course.tags.includes('로맨틱'))
        matchScore += 20;
      if (preferences.companion === 'solo' && course.difficulty === '쉬움')
        matchScore += 15;
      if (preferences.companion === 'friends' && course.tags.includes('체험'))
        matchScore += 15;

      return { ...course, matchScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);
};

export default function CourseRecommendations({
  preferences,
  onBackToPreferences,
  onStartCourse,
}: CourseRecommendationsProps) {
  const [courses, setCourses] = useState<RecommendedCourse[]>(() =>
    generateRecommendations(preferences)
  );

  const handleBookmark = (courseId: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? { ...course, isBookmarked: !course.isBookmarked }
          : course
      )
    );
  };

  const handleLike = (courseId: number) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? { ...course, isLiked: !course.isLiked }
          : course
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <Button variant="ghost" onClick={onBackToPreferences} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          취향 다시 선택하기
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          맞춤형 코스 추천
        </h2>
        <p className="text-gray-600">
          선택하신 취향을 바탕으로 AI가 추천하는 맞춤형 코스입니다.
        </p>
      </div>

      {/* 추천 코스 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  size="sm"
                  variant={course.isBookmarked ? 'default' : 'secondary'}
                  onClick={() => handleBookmark(course.id)}
                  className="rounded-full"
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={course.isLiked ? 'default' : 'secondary'}
                  onClick={() => handleLike(course.id)}
                  className="rounded-full"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90">
                  매칭도 {course.matchScore}%
                </Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <p className="text-gray-600 text-sm">{course.description}</p>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* 기본 정보 */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {course.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                </div>

                {/* 방문 장소 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    방문 장소:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {course.locations.map((location, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 태그 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    태그:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {course.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 예상 비용 */}
                <div className="text-sm text-gray-600">
                  예상 비용: {course.estimatedCost.toLocaleString()}원
                </div>

                {/* 시작하기 버튼 */}
                <Button
                  className="w-full"
                  onClick={() => onStartCourse(course.id)}
                >
                  <Navigation className="w-4 h-4 mr-2" />이 코스 시작하기
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 다른 추천 보기 */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          다른 추천 보기
        </Button>
      </div>
    </div>
  );
}
