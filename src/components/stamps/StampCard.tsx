'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Star, Trophy, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Stamp {
  id: string;
  locationId: string;
  locationName: string;
  locationImage: string;
  acquiredAt: Date;
  stampImage: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface StampCardProps {
  stamp: Stamp;
  onViewDetails?: (stamp: Stamp) => void;
  showDetails?: boolean;
}

export default function StampCard({
  stamp,
  onViewDetails,
  showDetails = false,
}: StampCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '⭐';
      case 'rare':
        return '🌟';
      case 'epic':
        return '💫';
      case 'legendary':
        return '👑';
      default:
        return '⭐';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
        isHovered ? 'scale-105' : 'scale-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {stamp.locationName}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getRarityColor(stamp.rarity)}>
                {getRarityIcon(stamp.rarity)} {stamp.rarity.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stamp.points}점
              </Badge>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(stamp.acquiredAt)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* 스탬프 이미지 */}
        <div className="relative">
          <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
            <Image
              src={stamp.stampImage}
              alt={`${stamp.locationName} 스탬프`}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 획득 애니메이션 효과 */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg flex items-end justify-center pb-2">
              <div className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                획득 완료!
              </div>
            </div>
          )}
        </div>

        {/* 설명 */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {stamp.description}
        </p>

        {/* 상세 정보 */}
        {showDetails && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>위치: {stamp.locationName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>획득 시간: {formatDate(stamp.acquiredAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Trophy className="h-4 w-4" />
              <span>포인트: {stamp.points}점</span>
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(stamp)}
            className="w-full"
          >
            상세 보기
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
