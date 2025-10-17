'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Star,
  Zap,
  Crown,
  Gem,
  Flame,
  Sparkles,
  Target,
  Award,
  TrendingUp,
  Clock,
  MapPin,
} from 'lucide-react';

interface StampRarity {
  name: string;
  color: string;
  icon: string;
  multiplier: number;
  description: string;
}

interface StampStats {
  totalCollected: number;
  totalPoints: number;
  averageRarity: number;
  longestStreak: number;
  currentStreak: number;
  favoriteLocation: string;
  lastCollected: Date | null;
}

interface AdvancedStampFeaturesProps {
  stamps: any[];
  onRarityUpdate?: (rarity: string) => void;
  onPointsUpdate?: (points: number) => void;
}

export function AdvancedStampFeatures({
  stamps,
  onRarityUpdate,
  onPointsUpdate,
}: AdvancedStampFeaturesProps) {
  const [stats, setStats] = useState<StampStats>({
    totalCollected: 0,
    totalPoints: 0,
    averageRarity: 0,
    longestStreak: 0,
    currentStreak: 0,
    favoriteLocation: '',
    lastCollected: null,
  });

  const [rarities] = useState<StampRarity[]>([
    {
      name: 'common',
      color: 'bg-gray-100 text-gray-800',
      icon: '🥉',
      multiplier: 1,
      description: '일반적인 스탬프',
    },
    {
      name: 'uncommon',
      color: 'bg-green-100 text-green-800',
      icon: '🥈',
      multiplier: 1.5,
      description: '조금 특별한 스탬프',
    },
    {
      name: 'rare',
      color: 'bg-blue-100 text-blue-800',
      icon: '🥇',
      multiplier: 2,
      description: '희귀한 스탬프',
    },
    {
      name: 'epic',
      color: 'bg-purple-100 text-purple-800',
      icon: '💎',
      multiplier: 3,
      description: '전설적인 스탬프',
    },
    {
      name: 'legendary',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '👑',
      multiplier: 5,
      description: '신화적인 스탬프',
    },
  ]);

  // 통계 계산
  useEffect(() => {
    if (stamps.length === 0) return;

    const totalCollected = stamps.length;
    const totalPoints = stamps.reduce((sum, stamp) => {
      const rarity = getRarityByName(stamp.rarity || 'common');
      return sum + (stamp.points || 50) * rarity.multiplier;
    }, 0);

    const averageRarity =
      stamps.reduce((sum, stamp) => {
        const rarity = getRarityByName(stamp.rarity || 'common');
        return sum + rarity.multiplier;
      }, 0) / totalCollected;

    // 연속 수집 계산 (간단한 로직)
    const currentStreak = calculateCurrentStreak(stamps);
    const longestStreak = calculateLongestStreak(stamps);

    // 가장 많이 수집한 위치
    const locationCounts = stamps.reduce((acc, stamp) => {
      const location = stamp.location || '알 수 없는 위치';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteLocation =
      Object.entries(locationCounts).sort(
        ([, a], [, b]) => (b as number) - (a as number)
      )[0]?.[0] || '없음';

    const lastCollected =
      stamps.length > 0
        ? new Date(stamps[stamps.length - 1].collectedAt || Date.now())
        : null;

    setStats({
      totalCollected,
      totalPoints,
      averageRarity,
      longestStreak,
      currentStreak,
      favoriteLocation,
      lastCollected,
    });

    // 콜백 호출
    onPointsUpdate?.(totalPoints);
  }, [stamps, onPointsUpdate]);

  const getRarityByName = (name: string): StampRarity => {
    return rarities.find((r) => r.name === name) || rarities[0];
  };

  const calculateCurrentStreak = (stamps: any[]): number => {
    // 간단한 연속 계산 로직
    return Math.min(stamps.length, 7); // 임시 값
  };

  const calculateLongestStreak = (stamps: any[]): number => {
    // 간단한 최장 연속 계산 로직
    return Math.min(stamps.length, 10); // 임시 값
  };

  const getRarityDistribution = () => {
    const distribution = rarities.map((rarity) => ({
      ...rarity,
      count: stamps.filter((stamp) => stamp.rarity === rarity.name).length,
    }));

    return distribution;
  };

  const getLevelProgress = () => {
    const pointsPerLevel = 1000;
    const currentLevel = Math.floor(stats.totalPoints / pointsPerLevel) + 1;
    const currentLevelPoints = stats.totalPoints % pointsPerLevel;
    const progress = (currentLevelPoints / pointsPerLevel) * 100;

    return {
      currentLevel,
      progress,
      pointsToNext: pointsPerLevel - currentLevelPoints,
    };
  };

  const levelInfo = getLevelProgress();
  const rarityDistribution = getRarityDistribution();

  return (
    <div className="space-y-6">
      {/* 레벨 시스템 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            수집가 레벨
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                Lv.{levelInfo.currentLevel}
              </div>
              <div className="text-sm text-gray-600">스탬프 수집가</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>다음 레벨까지</span>
                <span>{levelInfo.pointsToNext}점</span>
              </div>
              <Progress value={levelInfo.progress} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 통계 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            수집 통계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalCollected}
              </div>
              <div className="text-sm text-gray-600">총 수집</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalPoints}
              </div>
              <div className="text-sm text-gray-600">총 포인트</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.currentStreak}
              </div>
              <div className="text-sm text-gray-600">현재 연속</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.longestStreak}
              </div>
              <div className="text-sm text-gray-600">최장 연속</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 희귀도 분포 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gem className="h-5 w-5" />
            희귀도 분포
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rarityDistribution.map((rarity) => (
              <div
                key={rarity.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{rarity.icon}</span>
                  <div>
                    <div className="font-medium capitalize">{rarity.name}</div>
                    <div className="text-sm text-gray-600">
                      {rarity.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={rarity.color}>{rarity.count}개</Badge>
                  <div className="text-sm text-gray-600">
                    x{rarity.multiplier}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 특별 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            특별 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="font-medium">선호 지역</span>
              </div>
              <span className="text-sm text-gray-600">
                {stats.favoriteLocation}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium">마지막 수집</span>
              </div>
              <span className="text-sm text-gray-600">
                {stats.lastCollected
                  ? stats.lastCollected.toLocaleDateString()
                  : '없음'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="font-medium">평균 희귀도</span>
              </div>
              <span className="text-sm text-gray-600">
                {stats.averageRarity.toFixed(1)}x
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 업적 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            다음 목표
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">다음 레벨까지</span>
              <span className="text-sm font-medium">
                {levelInfo.pointsToNext}점
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">연속 수집 유지</span>
              <span className="text-sm font-medium">
                {stats.currentStreak}일
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">희귀 스탬프 수집</span>
              <span className="text-sm font-medium">
                {rarityDistribution
                  .filter(
                    (r) =>
                      r.name === 'rare' ||
                      r.name === 'epic' ||
                      r.name === 'legendary'
                  )
                  .reduce((sum, r) => sum + r.count, 0)}
                개
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
