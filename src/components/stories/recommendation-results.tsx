'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Users, RefreshCw } from 'lucide-react';
import {
  Recommendation,
  useRecommendations,
} from '@/hooks/use-recommendations';

interface RecommendationResultsProps {
  onCourseSelect: (courseId: string) => void;
  onBack: () => void;
}

export function RecommendationResults({
  onCourseSelect,
  onBack,
}: RecommendationResultsProps) {
  const { recommendations, loading, error, refreshRecommendations } =
    useRecommendations();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId);
    onCourseSelect(courseId);
  };

  const handleRefresh = async () => {
    await refreshRecommendations();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              맞춤형 코스를 찾고 있어요
            </h2>
            <p className="text-gray-600">잠시만 기다려주세요...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">추천 시스템 오류</p>
              <p>{error}</p>
            </div>
            <Button onClick={handleRefresh} className="mr-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            <Button variant="outline" onClick={onBack}>
              취향 다시 선택
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎯 당신을 위한 맞춤형 코스
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            AI가 분석한 당신의 취향에 맞는 포항 여행 코스입니다
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onBack}>
              취향 다시 선택
            </Button>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              다른 추천 보기
            </Button>
          </div>
        </div>

        {/* 추천 결과 */}
        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">추천할 코스가 없습니다</p>
              <p>다른 취향을 선택해보세요</p>
            </div>
            <Button onClick={onBack}>취향 다시 선택</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((course) => (
              <Card
                key={course.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedCourse === course.id
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleCourseClick(course.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {course.recommendationScore.toFixed(1)}점
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {course.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* 추천 이유 */}
                  <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium">
                      💡 {course.recommendationReason}
                    </p>
                  </div>

                  {/* 코스 정보 */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-2 h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="mr-2 h-4 w-4" />
                      {course.distance}km
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="mr-2 h-4 w-4" />
                      {course.targetAudience.join(', ')}
                    </div>
                  </div>

                  {/* 평점 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {course.rating}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({course.reviewCount}개 리뷰)
                      </span>
                    </div>
                    <Badge
                      variant={
                        course.difficulty === '쉬움'
                          ? 'default'
                          : course.difficulty === '보통'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className="text-xs"
                    >
                      {course.difficulty}
                    </Badge>
                  </div>

                  {/* 태그 */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {course.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{course.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* 시작 버튼 */}
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCourseClick(course.id);
                    }}
                  >
                    이 코스 시작하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 하단 안내 */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              💡 추천 시스템이 더 정확해지는 방법
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              코스를 시작하고 완료하면, 다음 추천이 더욱 정확해집니다
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span>• 코스 완료</span>
              <span>• 리뷰 작성</span>
              <span>• 좋아요 표시</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
