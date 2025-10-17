'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Star,
  Target,
  Zap,
  Crown,
  Medal,
  Award,
  Flame,
  Sparkles,
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'collection' | 'streak' | 'exploration' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  points: number;
}

interface AchievementSystemProps {
  collectedStamps: number;
  totalStamps: number;
  completedTours: number;
  currentStreak: number;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export function AchievementSystem({
  collectedStamps,
  totalStamps,
  completedTours,
  currentStreak,
  onAchievementUnlocked,
}: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);

  // 업적 데이터 초기화
  useEffect(() => {
    const initialAchievements: Achievement[] = [
      {
        id: 'first_stamp',
        name: '첫 스탬프',
        description: '첫 번째 스탬프를 수집하세요',
        icon: '🎯',
        type: 'collection',
        rarity: 'common',
        progress: Math.min(collectedStamps, 1),
        maxProgress: 1,
        unlocked: collectedStamps >= 1,
        points: 10,
      },
      {
        id: 'stamp_collector',
        name: '스탬프 수집가',
        description: '10개의 스탬프를 수집하세요',
        icon: '📚',
        type: 'collection',
        rarity: 'rare',
        progress: Math.min(collectedStamps, 10),
        maxProgress: 10,
        unlocked: collectedStamps >= 10,
        points: 50,
      },
      {
        id: 'stamp_master',
        name: '스탬프 마스터',
        description: '50개의 스탬프를 수집하세요',
        icon: '👑',
        type: 'collection',
        rarity: 'epic',
        progress: Math.min(collectedStamps, 50),
        maxProgress: 50,
        unlocked: collectedStamps >= 50,
        points: 200,
      },
      {
        id: 'tour_completer',
        name: '투어 완주자',
        description: '첫 번째 투어를 완주하세요',
        icon: '🏁',
        type: 'exploration',
        rarity: 'rare',
        progress: Math.min(completedTours, 1),
        maxProgress: 1,
        unlocked: completedTours >= 1,
        points: 100,
      },
      {
        id: 'streak_starter',
        name: '연속 수집가',
        description: '3일 연속으로 스탬프를 수집하세요',
        icon: '🔥',
        type: 'streak',
        rarity: 'rare',
        progress: Math.min(currentStreak, 3),
        maxProgress: 3,
        unlocked: currentStreak >= 3,
        points: 75,
      },
      {
        id: 'streak_master',
        name: '연속 마스터',
        description: '7일 연속으로 스탬프를 수집하세요',
        icon: '⚡',
        type: 'streak',
        rarity: 'epic',
        progress: Math.min(currentStreak, 7),
        maxProgress: 7,
        unlocked: currentStreak >= 7,
        points: 300,
      },
      {
        id: 'perfect_collector',
        name: '완벽한 수집가',
        description: '모든 스탬프를 수집하세요',
        icon: '💎',
        type: 'special',
        rarity: 'legendary',
        progress: collectedStamps,
        maxProgress: totalStamps,
        unlocked: collectedStamps >= totalStamps && totalStamps > 0,
        points: 1000,
      },
    ];

    setAchievements(initialAchievements);
  }, [collectedStamps, totalStamps, completedTours, currentStreak]);

  // 새로 해제된 업적 감지
  useEffect(() => {
    const newlyUnlocked = achievements.filter(
      (achievement) =>
        achievement.unlocked &&
        !recentUnlocks.some((recent) => recent.id === achievement.id)
    );

    if (newlyUnlocked.length > 0) {
      setRecentUnlocks((prev) => [...prev, ...newlyUnlocked]);
      newlyUnlocked.forEach((achievement) => {
        onAchievementUnlocked?.(achievement);
      });
    }
  }, [achievements, recentUnlocks, onAchievementUnlocked]);

  const getRarityColor = (rarity: string): string => {
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

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return <Medal className="h-4 w-4" />;
      case 'rare':
        return <Star className="h-4 w-4" />;
      case 'epic':
        return <Crown className="h-4 w-4" />;
      case 'legendary':
        return <Trophy className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'collection':
        return <Target className="h-4 w-4" />;
      case 'streak':
        return <Flame className="h-4 w-4" />;
      case 'exploration':
        return <Zap className="h-4 w-4" />;
      case 'special':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, achievement) => sum + achievement.points, 0);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* 업적 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            업적 시스템
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {unlockedCount}
              </div>
              <div className="text-sm text-gray-600">해제된 업적</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalPoints}
              </div>
              <div className="text-sm text-gray-600">총 포인트</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {collectedStamps}
              </div>
              <div className="text-sm text-gray-600">수집한 스탬프</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {currentStreak}
              </div>
              <div className="text-sm text-gray-600">연속 일수</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>전체 진행률</span>
              <span>{Math.round((unlockedCount / totalCount) * 100)}%</span>
            </div>
            <Progress
              value={(unlockedCount / totalCount) * 100}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* 업적 목록 */}
      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`transition-all duration-200 ${
              achievement.unlocked ? 'ring-2 ring-green-200 bg-green-50' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      {achievement.unlocked && (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          해제됨
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {getRarityIcon(achievement.rarity)}
                        <span className="ml-1 capitalize">
                          {achievement.rarity}
                        </span>
                      </Badge>
                      <Badge variant="outline">
                        {getTypeIcon(achievement.type)}
                        <span className="ml-1">{achievement.points}점</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {achievement.progress} / {achievement.maxProgress}
                  </div>
                  <div className="w-20">
                    <Progress
                      value={
                        (achievement.progress / achievement.maxProgress) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 최근 해제된 업적 */}
      {recentUnlocks.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Sparkles className="h-5 w-5" />
              최근 해제된 업적
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentUnlocks.slice(-3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-2 p-2 bg-white rounded-lg"
                >
                  <span className="text-xl">{achievement.icon}</span>
                  <div>
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-sm text-gray-600">
                      +{achievement.points}점
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
