'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trophy, Search, QrCode } from 'lucide-react';
import Image from 'next/image';

interface Stamp {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  acquiredDate: string;
  location: string;
  rarity: 'common' | 'rare' | 'epic';
  points: number;
}

export default function StampsPage() {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('전체');

  useEffect(() => {
    // Mock 데이터 로드
    const mockStamps: Stamp[] = [
      {
        id: 'stamp_homigot_sunrise',
        name: '호미곶 일출 스탬프',
        description:
          '한반도 최동단 호미곶에서 웅장한 일출을 감상하고 획득한 스탬프입니다.',
        imageUrl: 'https://picsum.photos/200/200?random=101',
        acquiredDate: '2023-10-26',
        location: '호미곶',
        rarity: 'common',
        points: 100,
      },
      {
        id: 'stamp_yeongildae_beach',
        name: '영일대 해수욕장 스탬프',
        description:
          '포항의 대표 해수욕장, 영일대 해수욕장에서 시원한 바다를 만끽하고 획득한 스탬프입니다.',
        imageUrl: 'https://picsum.photos/200/200?random=102',
        acquiredDate: '2023-10-26',
        location: '영일대 해수욕장',
        rarity: 'common',
        points: 80,
      },
      {
        id: 'stamp_jookdo_market',
        name: '죽도시장 맛집 스탬프',
        description:
          '활기 넘치는 죽도시장에서 신선한 해산물과 포항 특미를 맛보고 획득한 스탬프입니다.',
        imageUrl: 'https://picsum.photos/200/200?random=103',
        acquiredDate: '2023-10-27',
        location: '죽도시장',
        rarity: 'common',
        points: 120,
      },
      {
        id: 'stamp_posco_tour',
        name: '포항제철소 견학 스탬프',
        description:
          '대한민국 산업 발전의 상징, 포항제철소를 견학하고 획득한 스탬프입니다.',
        imageUrl: 'https://picsum.photos/200/200?random=104',
        acquiredDate: '2023-10-27',
        location: '포항제철소',
        rarity: 'rare',
        points: 200,
      },
      {
        id: 'stamp_guryongpo_modern',
        name: '구룡포 근대문화거리 스탬프',
        description:
          '시간이 멈춘 듯한 구룡포 근대문화거리에서 역사와 문화를 체험하고 획득한 스탬프입니다.',
        imageUrl: 'https://picsum.photos/200/200?random=105',
        acquiredDate: '2023-10-28',
        location: '구룡포 근대문화거리',
        rarity: 'common',
        points: 90,
      },
    ];

    setStamps(mockStamps);
    setLoading(false);
  }, []);

  const filteredStamps = stamps.filter((stamp) => {
    const matchesSearch =
      stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === '전체' || stamp.rarity === filter;
    return matchesSearch && matchesFilter;
  });

  const totalStamps = stamps.length;
  const totalPoints = stamps.reduce((sum, stamp) => sum + stamp.points, 0);
  const rareStamps = stamps.filter(
    (stamp) => stamp.rarity === 'rare' || stamp.rarity === 'epic'
  ).length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800';
      case 'rare':
        return 'bg-blue-100 text-blue-800';
      case 'epic':
        return 'bg-purple-100 text-purple-800';
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
        return '전설';
      default:
        return '일반';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">스탬프를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">나의 스탬프</h1>
        <p className="text-gray-600">포항 여행의 소중한 기록들을 모아보세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 스탬프</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStamps}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 포인트</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">희귀 스탬프</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rareStamps}</div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="스탬프 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="전체">전체</option>
          <option value="common">일반</option>
          <option value="rare">희귀</option>
          <option value="epic">전설</option>
        </select>
      </div>

      {/* 스탬프 목록 */}
      {filteredStamps.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            아직 획득한 스탬프가 없습니다
          </h3>
          <p className="text-gray-600 mb-4">
            QR 코드를 스캔하여 첫 번째 스탬프를 획득해보세요!
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <QrCode className="h-4 w-4 mr-2" />
            QR 스캔하기
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStamps.map((stamp) => (
            <Card
              key={stamp.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <Image
                  src={stamp.imageUrl}
                  alt={stamp.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge
                  className={`absolute top-2 right-2 ${getRarityColor(
                    stamp.rarity
                  )}`}
                >
                  {getRarityLabel(stamp.rarity)}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{stamp.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {stamp.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{stamp.location}</span>
                  <span className="font-medium text-blue-600">
                    {stamp.points}점
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  획득일:{' '}
                  {new Date(stamp.acquiredDate).toLocaleDateString('ko-KR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
