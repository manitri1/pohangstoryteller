'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
import {
  Clock,
  MapPin,
  Star,
  Trophy,
  ArrowRight,
  CheckCircle,
  PlayCircle,
} from 'lucide-react';
import { StampTour } from '@/types/stamp-tour';

interface TourSelectionProps {
  tours: StampTour[];
  onSelectTour: (tour: StampTour) => void;
  onStartTour: (tour: StampTour) => void;
}

export function TourSelection({
  tours,
  onSelectTour,
  onStartTour,
}: TourSelectionProps) {
  const [selectedTour, setSelectedTour] = useState<StampTour | null>(null);

  const handleTourSelect = (tour: StampTour) => {
    setSelectedTour(tour);
    onSelectTour(tour);
  };

  const handleStartTour = (tour: StampTour) => {
    onStartTour(tour);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '쉬움';
      case 'medium':
        return '보통';
      case 'hard':
        return '어려움';
      default:
        return '알 수 없음';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          QR 스탬프 투어
        </h2>
        <p className="text-gray-600">
          포항의 매력을 담은 다양한 스탬프 투어를 선택하고 시작해보세요!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {tours.map((tour) => (
          <Card
            key={tour.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTour?.id === tour.id
                ? 'ring-2 ring-blue-500 shadow-lg'
                : ''
            }`}
            onClick={() => handleTourSelect(tour)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-lg ${tour.color} flex items-center justify-center text-2xl`}
                  >
                    {tour.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tour.name}</CardTitle>
                    <p className="text-sm text-gray-600">{tour.description}</p>
                  </div>
                </div>
                {tour.isCompleted && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 투어 정보 */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(tour.estimatedDuration)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{tour.totalStamps}개 장소</span>
                  </div>
                </div>
                <Badge className={getDifficultyColor(tour.difficulty)}>
                  {getDifficultyLabel(tour.difficulty)}
                </Badge>
              </div>

              {/* 진행률 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">진행률</span>
                  <span className="font-medium">{tour.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${tour.completionRate}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {tour.collectedStamps}/{tour.totalStamps} 스탬프 수집
                  </span>
                  {tour.isCompleted && (
                    <span className="text-green-600 font-medium">완료!</span>
                  )}
                </div>
              </div>

              {/* 보상 정보 */}
              {tour.rewards && tour.rewards.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">완료 보상</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tour.rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                          reward.isUnlocked
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span>{reward.icon}</span>
                        <span>{reward.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTourSelect(tour);
                  }}
                >
                  <Star className="h-4 w-4 mr-1" />
                  자세히 보기
                </Button>
                <Button
                  size="sm"
                  className={`flex-1 ${
                    tour.isCompleted
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartTour(tour);
                  }}
                >
                  {tour.isCompleted ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      다시 시작
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-1" />
                      투어 시작
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 선택된 투어 상세 정보 */}
      {selectedTour && (
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">{selectedTour.icon}</span>
              <span>{selectedTour.name} 상세 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">투어 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">소요 시간:</span>
                      <span>
                        {formatDuration(selectedTour.estimatedDuration)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">방문 장소:</span>
                      <span>{selectedTour.totalStamps}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">난이도:</span>
                      <Badge
                        className={getDifficultyColor(selectedTour.difficulty)}
                      >
                        {getDifficultyLabel(selectedTour.difficulty)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">방문 장소</h4>
                  <div className="space-y-2">
                    {selectedTour.stamps.map((stamp, index) => (
                      <div
                        key={stamp.id}
                        className="flex items-center space-x-3 text-sm"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{stamp.name}</div>
                          <div className="text-gray-600">{stamp.location}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {stamp.rarity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
