'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trophy, Search, QrCode, MapPin, Star, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { StampTour, StampInTour } from '@/types/stamp-tour';
import { TourSelection } from '@/components/stamps/tour-selection';
import { TourProgress } from '@/components/stamps/tour-progress';
import { StampDashboard } from '@/components/stamps/stamp-dashboard';
import { StampCollectionModal } from '@/components/stamps/stamp-collection-modal';
import { LocationTracker } from '@/components/stamps/location-tracker';
import { AchievementSystem } from '@/components/stamps/achievement-system';
import { AdvancedStampFeatures } from '@/components/stamps/advanced-stamp-features';
import FeatureAccess from '@/components/auth/feature-access';
import { stampTours } from '@/data/stamp-tours';
import { mockStamps, Stamp as StampType } from '@/data/mock-stamps';
import { useStampCollection } from '@/hooks/use-stamp-collection';

// Stamp interface는 이제 mock-stamps.ts에서 import

export default function StampsPage() {
  return (
    <FeatureAccess
      featureName="QR 스탬프"
      description="QR 스탬프 투어로 여행의 추억을 디지털로 남겨보세요."
      requireAuth={true}
    >
      <StampsContent />
    </FeatureAccess>
  );
}

function StampsContent() {
  const [stamps, setStamps] = useState<StampType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('전체');
  const [currentView, setCurrentView] = useState<
    'dashboard' | 'tours' | 'tour-detail' | 'achievements' | 'advanced'
  >('dashboard');
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState<StampInTour | null>(null);
  const [activeCourse, setActiveCourse] = useState<any>(null);

  // 스탬프 수집 훅 사용
  const {
    tours,
    collectedStamps,
    totalPoints: collectedPoints,
    completionRate,
    collectStamp,
    isStampCollected,
    getTourProgress,
    getTourCompletion,
    updateTourProgress,
  } = useStampCollection(stampTours);

  // selectedTour를 tours 배열의 최신 상태와 동기화
  const selectedTour =
    tours.find((tour) => tour.id === selectedTourId) || tours[0] || null;

  useEffect(() => {
    // 데이터 로드 (import 방식으로 안정적으로 로드)
    setStamps(mockStamps);
    setLoading(false);

    // 활성 코스 확인
    const storedCourse = localStorage.getItem('activeCourse');
    if (storedCourse) {
      try {
        const courseData = JSON.parse(storedCourse);
        setActiveCourse(courseData);
        console.log('활성 코스 감지:', courseData);
      } catch (error) {
        console.error('활성 코스 데이터 파싱 오류:', error);
      }
    }
  }, []);

  // tours가 로드되면 첫 번째 투어를 기본 선택
  useEffect(() => {
    if (tours.length > 0 && !selectedTourId) {
      setSelectedTourId(tours[0].id);
    }
  }, [tours, selectedTourId]);

  const handleTourSelect = (tour: StampTour) => {
    setSelectedTourId(tour.id);
    setCurrentView('tour-detail');
  };

  const handleStartTour = (tour: StampTour) => {
    setSelectedTourId(tour.id);
    setCurrentView('tour-detail');
  };

  const handleStampClick = (stamp: StampInTour) => {
    setSelectedStamp(stamp);
    setShowCollectionModal(true);
  };

  const handleQRScan = (stamp: StampInTour) => {
    setSelectedStamp(stamp);
    setShowCollectionModal(true);
  };

  const handleNavigate = (stamp: StampInTour) => {
    // 카카오맵 길찾기 URL 생성
    const url = `https://map.kakao.com/link/to/${stamp.name},${stamp.coordinates.lat},${stamp.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleCollectStamp = async (stamp: StampInTour) => {
    console.log('스탬프 수집 처리 시작:', {
      stampId: stamp.id,
      stampName: stamp.name,
      selectedTour: selectedTour?.id,
      selectedTourName: selectedTour?.name,
    });

    if (selectedTour) {
      const success = await collectStamp(stamp.id, selectedTour.id);
      console.log('스탬프 수집 결과:', success);

      if (success) {
        updateTourProgress(selectedTour.id);
        setShowCollectionModal(false);
        setSelectedStamp(null);
        console.log('스탬프 수집 완료');
      } else {
        console.warn('스탬프 수집 실패: 이미 수집된 스탬프입니다');
        // 이미 수집된 스탬프인 경우 모달을 닫지 않고 사용자에게 알림
        alert('이미 수집된 스탬프입니다!');
      }
    } else {
      console.error('선택된 투어가 없습니다');
    }
  };

  const handleViewAllTours = () => {
    setCurrentView('tours');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTour(null);
  };

  const handleBackToTours = () => {
    setCurrentView('tours');
    setSelectedTour(null);
  };

  const filteredStamps = stamps.filter((stamp) => {
    const matchesSearch =
      stamp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stamp.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === '전체' || stamp.rarity === filter;
    return matchesSearch && matchesFilter;
  });

  const totalStamps = stamps.length;
  const legacyTotalPoints = stamps.reduce(
    (sum, stamp) => sum + stamp.points,
    0
  );
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
      {/* 활성 코스 알림 */}
      {activeCourse && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-3"></div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  🎯 활성 코스 진행 중
                </h3>
                <p className="text-blue-700">
                  코스 ID: {activeCourse.id} | 시작 시간:{' '}
                  {new Date(activeCourse.startedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem('activeCourse');
                setActiveCourse(null);
              }}
            >
              코스 종료
            </Button>
          </div>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('dashboard')}
            className="flex-1"
          >
            <Trophy className="h-4 w-4 mr-2" />
            대시보드
          </Button>
          <Button
            variant={currentView === 'tours' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('tours')}
            className="flex-1"
          >
            <MapPin className="h-4 w-4 mr-2" />
            투어
          </Button>
          <Button
            variant={currentView === 'achievements' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('achievements')}
            className="flex-1"
          >
            <Star className="h-4 w-4 mr-2" />
            업적
          </Button>
          <Button
            variant={currentView === 'advanced' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('advanced')}
            className="flex-1"
          >
            <QrCode className="h-4 w-4 mr-2" />
            고급
          </Button>
        </div>
      </div>

      {/* 네비게이션 */}
      {currentView === 'tour-detail' && (
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackToTours}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            투어 목록으로
          </Button>
        </div>
      )}

      {/* 대시보드 뷰 */}
      {currentView === 'dashboard' && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              QR 스탬프 투어
            </h1>
            <p className="text-gray-600">
              포항의 매력을 담은 스탬프 투어를 시작해보세요!
            </p>
          </div>
          <StampDashboard
            tours={tours}
            onStartTour={handleStartTour}
            onViewAllTours={handleViewAllTours}
          />
        </>
      )}

      {/* 투어 선택 뷰 */}
      {currentView === 'tours' && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              스탬프 투어 선택
            </h1>
            <p className="text-gray-600">
              원하는 투어를 선택하고 시작해보세요!
            </p>
          </div>
          <TourSelection
            tours={tours}
            onSelectTour={handleTourSelect}
            onStartTour={handleStartTour}
          />
        </>
      )}

      {/* 투어 상세 뷰 */}
      {currentView === 'tour-detail' && selectedTour && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedTour.name}
            </h1>
            <p className="text-gray-600">{selectedTour.description}</p>
          </div>
          <TourProgress
            tour={selectedTour}
            onStampClick={handleStampClick}
            onQRScan={handleQRScan}
            onNavigate={handleNavigate}
          />
        </>
      )}

      {/* 기존 스탬프 목록 (대시보드에서만 표시) */}
      {currentView === 'dashboard' && (
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              수집한 스탬프
            </h2>
            <p className="text-gray-600">
              지금까지 수집한 스탬프들을 확인해보세요
            </p>
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
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{collectedPoints}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  희귀 스탬프
                </CardTitle>
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
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleViewAllTours}
              >
                <QrCode className="h-4 w-4 mr-2" />
                투어 시작하기
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
      )}

      {/* 업적 시스템 뷰 */}
      {currentView === 'achievements' && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              업적 시스템
            </h1>
            <p className="text-gray-600">
              스탬프 수집 활동을 통해 다양한 업적을 달성해보세요!
            </p>
          </div>
          <AchievementSystem
            collectedStamps={collectedStamps.length}
            totalStamps={totalStamps}
            completedTours={
              tours.filter((tour) => tour.completionRate === 100).length
            }
            currentStreak={7} // 임시 값
            onAchievementUnlocked={(achievement) => {
              console.log('업적 해제:', achievement);
            }}
          />
        </>
      )}

      {/* 고급 기능 뷰 */}
      {currentView === 'advanced' && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              고급 스탬프 기능
            </h1>
            <p className="text-gray-600">
              상세한 통계와 고급 기능을 확인해보세요!
            </p>
          </div>
          <AdvancedStampFeatures
            stamps={stamps}
            onRarityUpdate={(rarity) => {
              console.log('희귀도 업데이트:', rarity);
            }}
            onPointsUpdate={(points) => {
              console.log('포인트 업데이트:', points);
            }}
          />
        </>
      )}

      {/* 스탬프 수집 모달 */}
      {selectedStamp && (
        <StampCollectionModal
          isOpen={showCollectionModal}
          onClose={() => {
            setShowCollectionModal(false);
            setSelectedStamp(null);
          }}
          stamp={selectedStamp}
          onCollect={handleCollectStamp}
        />
      )}
    </div>
  );
}
