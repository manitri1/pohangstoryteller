'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  Target,
  Calendar,
  QrCode,
} from 'lucide-react';
import { StampTour } from '@/types/stamp-tour';

interface StampDashboardProps {
  tours: StampTour[];
  onStartTour: (tour: StampTour) => void;
  onViewAllTours: () => void;
}

export function StampDashboard({
  tours,
  onStartTour,
  onViewAllTours,
}: StampDashboardProps) {
  const [stats, setStats] = useState({
    totalTours: 0,
    completedTours: 0,
    totalStamps: 0,
    collectedStamps: 0,
    totalPoints: 0,
    collectedPoints: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const totalTours = tours.length;
    const completedTours = tours.filter((tour) => tour.isCompleted).length;
    const totalStamps = tours.reduce((sum, tour) => sum + tour.totalStamps, 0);
    const collectedStamps = tours.reduce(
      (sum, tour) => sum + tour.collectedStamps,
      0
    );
    const totalPoints = tours.reduce(
      (sum, tour) =>
        sum +
        tour.stamps.reduce((stampSum, stamp) => stampSum + stamp.points, 0),
      0
    );
    const collectedPoints = tours.reduce(
      (sum, tour) =>
        sum +
        tour.stamps
          .filter((stamp) => stamp.isCollected)
          .reduce((stampSum, stamp) => stampSum + stamp.points, 0),
      0
    );
    const completionRate =
      totalStamps > 0 ? Math.round((collectedStamps / totalStamps) * 100) : 0;

    setStats({
      totalTours,
      completedTours,
      totalStamps,
      collectedStamps,
      totalPoints,
      collectedPoints,
      completionRate,
    });
  }, [tours]);

  const getRecentTours = () => {
    return tours
      .filter((tour) => tour.collectedStamps > 0)
      .sort((a, b) => {
        const aLastCollected = Math.max(
          ...a.stamps
            .filter((stamp) => stamp.isCollected && stamp.collectedAt)
            .map((stamp) => new Date(stamp.collectedAt!).getTime())
        );
        const bLastCollected = Math.max(
          ...b.stamps
            .filter((stamp) => stamp.isCollected && stamp.collectedAt)
            .map((stamp) => new Date(stamp.collectedAt!).getTime())
        );
        return bLastCollected - aLastCollected;
      })
      .slice(0, 3);
  };

  const getTopTours = () => {
    return tours
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 3);
  };

  const recentTours = getRecentTours();
  const topTours = getTopTours();

  return (
    <div className="space-y-6">
      {/* 전체 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">완료된 투어</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedTours}/{stats.totalTours}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  수집한 스탬프
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.collectedStamps}/{stats.totalStamps}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">완료율</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completionRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">획득 포인트</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.collectedPoints.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 전체 진행률 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>전체 진행률</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">스탬프 수집 진행률</span>
              <span className="text-2xl font-bold text-blue-600">
                {stats.completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{stats.collectedStamps}개 수집 완료</span>
              <span>{stats.totalStamps - stats.collectedStamps}개 남음</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 활동 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>최근 활동</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTours.length > 0 ? (
                recentTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-lg ${tour.color} flex items-center justify-center text-sm`}
                      >
                        {tour.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {tour.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {tour.collectedStamps}/{tour.totalStamps} 스탬프
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {tour.completionRate}%
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${tour.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>아직 수집한 스탬프가 없습니다.</p>
                  <p className="text-sm">첫 번째 투어를 시작해보세요!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 인기 투어 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>인기 투어</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTours.map((tour, index) => (
                <div
                  key={tour.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div
                      className={`w-8 h-8 rounded-lg ${tour.color} flex items-center justify-center text-sm`}
                    >
                      {tour.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{tour.name}</h4>
                      <p className="text-sm text-gray-600">
                        {tour.collectedStamps}/{tour.totalStamps} 스탬프
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {tour.completionRate}%
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${tour.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onStartTour(tour)}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-center space-x-4">
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={onViewAllTours}
        >
          <MapPin className="h-5 w-5 mr-2" />
          모든 투어 보기
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            // QR 스캔 기능 (추후 구현)
            console.log('QR 스캔 시작');
          }}
        >
          <QrCode className="h-5 w-5 mr-2" />
          QR 스캔하기
        </Button>
      </div>
    </div>
  );
}
