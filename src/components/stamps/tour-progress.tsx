'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
import {
  MapPin,
  Clock,
  Trophy,
  Star,
  CheckCircle,
  Circle,
  QrCode,
  Navigation,
} from 'lucide-react';
import { StampTour, StampInTour } from '@/types/stamp-tour';

interface TourProgressProps {
  tour: StampTour;
  onStampClick: (stamp: StampInTour) => void;
  onQRScan: (stamp: StampInTour) => void;
  onNavigate: (stamp: StampInTour) => void;
}

export function TourProgress({
  tour,
  onStampClick,
  onQRScan,
  onNavigate,
}: TourProgressProps) {
  const [selectedStamp, setSelectedStamp] = useState<StampInTour | null>(null);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800';
      case 'rare':
        return 'bg-blue-100 text-blue-800';
      case 'epic':
        return 'bg-purple-100 text-purple-800';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '일반';
      case 'rare':
        return '희귀';
      case 'epic':
        return '영웅';
      case 'legendary':
        return '전설';
      default:
        return '알 수 없음';
    }
  };

  const getNextUncollectedStamp = () => {
    return tour.stamps.find((stamp) => !stamp.isCollected);
  };

  const nextStamp = getNextUncollectedStamp();

  return (
    <div className="space-y-6">
      {/* 투어 헤더 */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-xl ${tour.color} flex items-center justify-center text-3xl`}
              >
                {tour.icon}
              </div>
              <div>
                <CardTitle className="text-2xl">{tour.name}</CardTitle>
                <p className="text-gray-600 mt-1">{tour.description}</p>
              </div>
            </div>
            {tour.isCompleted && (
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-1" />
                <span className="text-sm font-medium text-green-600">
                  완료!
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* 진행률 정보 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                투어 진행률
              </span>
              <span className="text-lg font-bold text-blue-600">
                {tour.completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${tour.completionRate}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {tour.collectedStamps}/{tour.totalStamps} 스탬프 수집
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>예상 {Math.ceil(tour.estimatedDuration / 60)}시간</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{tour.totalStamps}개 장소</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 다음 방문지 안내 */}
      {nextStamp && !tour.isCompleted && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Navigation className="h-5 w-5" />
              <span>다음 방문지</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                  <span className="text-2xl">{nextStamp.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {nextStamp.name}
                  </h3>
                  <p className="text-sm text-gray-600">{nextStamp.location}</p>
                  <Badge className={`mt-1 ${getRarityColor(nextStamp.rarity)}`}>
                    {getRarityLabel(nextStamp.rarity)} • {nextStamp.points}점
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigate(nextStamp)}
                >
                  <Navigation className="h-4 w-4 mr-1" />
                  길찾기
                </Button>
                <Button size="sm" onClick={() => onQRScan(nextStamp)}>
                  <QrCode className="h-4 w-4 mr-1" />
                  QR 스캔
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 스탬프 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>스탬프 목록</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tour.stamps.map((stamp, index) => (
              <div
                key={stamp.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  stamp.isCollected
                    ? 'border-green-200 bg-green-50'
                    : selectedStamp?.id === stamp.id
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedStamp(stamp);
                  onStampClick(stamp);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        stamp.isCollected
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {stamp.isCollected ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {stamp.name}
                        </h3>
                        <Badge className={getRarityColor(stamp.rarity)}>
                          {getRarityLabel(stamp.rarity)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {stamp.points}점
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {stamp.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{stamp.location}</span>
                        </div>
                        {stamp.isCollected && stamp.collectedAt && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(stamp.collectedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stamp.isCollected ? (
                      <div className="text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(stamp);
                          }}
                        >
                          <Navigation className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQRScan(stamp);
                          }}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 완료 보상 */}
      {tour.rewards && tour.rewards.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <Trophy className="h-5 w-5" />
              <span>완료 보상</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tour.rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`p-4 rounded-lg border-2 ${
                    reward.isUnlocked
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{reward.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {reward.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {reward.description}
                      </p>
                      {reward.isUnlocked && (
                        <Badge className="mt-1 bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          획득 완료
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
