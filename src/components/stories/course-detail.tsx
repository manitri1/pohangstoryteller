'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  QrCode,
  Camera,
  Play,
  Navigation,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { KakaoMap } from '@/components/map/kakao-map';
import { MapMarker, MapRoute } from '@/types/map';

interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  qrCode: string;
  image: string;
  media: Array<{
    id: string;
    type: 'image' | 'video' | 'text';
    url: string;
    title: string;
  }>;
}

interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  duration: string;
  difficulty: string;
  rating: number;
  image: string;
  category: string;
  locations: Location[];
  tips: string[];
  transportation: string;
  bestTime: string;
  cost: string;
}

interface CourseDetailProps {
  course: Course;
}

export function CourseDetail({ course }: CourseDetailProps) {
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '쉬움':
        return 'bg-green-100 text-green-700';
      case '보통':
        return 'bg-yellow-100 text-yellow-700';
      case '어려움':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '자연경관':
        return 'bg-primary-100 text-primary-700';
      case '역사여행':
        return 'bg-secondary-100 text-secondary-700';
      case '맛집탐방':
        return 'bg-accent-100 text-accent-700';
      case '골목산책':
        return 'bg-neutral-100 text-neutral-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const toggleLocation = (locationId: string) => {
    setExpandedLocation(expandedLocation === locationId ? null : locationId);
  };

  // 지도 마커 데이터 생성
  const getMapMarkers = (): MapMarker[] => {
    if (!course.locations || !Array.isArray(course.locations)) {
      return [];
    }
    return course.locations.map((location, index) => ({
      id: location.id,
      position: location.coordinates,
      title: location.name,
      content: location.description,
      type:
        index === 0
          ? 'start'
          : index === course.locations.length - 1
            ? 'end'
            : 'waypoint',
    }));
  };

  // 지도 경로 데이터 생성
  const getMapRoute = (): MapRoute => {
    if (!course.locations || !Array.isArray(course.locations)) {
      return {
        id: course.id,
        name: course.title,
        waypoints: [],
        color: '#3B82F6',
        strokeWeight: 5,
        strokeOpacity: 0.7,
      };
    }
    return {
      id: course.id,
      name: course.title,
      waypoints: course.locations.map((location) => location.coordinates),
      color: '#3B82F6',
      strokeWeight: 5,
      strokeOpacity: 0.7,
    };
  };

  // 지도 중심점 계산
  const getMapCenter = () => {
    if (
      !course.locations ||
      !Array.isArray(course.locations) ||
      course.locations.length === 0
    ) {
      return { lat: 36.019, lng: 129.3435 };
    }

    const lats = course.locations.map((l) => l.coordinates.lat);
    const lngs = course.locations.map((l) => l.coordinates.lng);

    return {
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  };

  // 마커 클릭 핸들러
  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedLocation(marker.id);
    setExpandedLocation(marker.id);
  };

  return (
    <div className="space-y-8">
      {/* 뒤로가기 버튼 */}
      <div>
        <Button variant="ghost" asChild>
          <Link href="/stories">← 스토리 탐험으로 돌아가기</Link>
        </Button>
      </div>

      {/* 코스 헤더 */}
      <div className="relative">
        <div className="relative h-96 w-full overflow-hidden rounded-2xl">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Badge className={getCategoryColor(course.category)}>
                {course.category}
              </Badge>
              <Badge className={getDifficultyColor(course.difficulty)}>
                {course.difficulty}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              {course.description}
            </p>
          </div>
        </div>
      </div>

      {/* 코스 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 코스 소개 */}
          <Card>
            <CardHeader>
              <CardTitle>코스 소개</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-700 leading-relaxed">
                {course.fullDescription}
              </p>
            </CardContent>
          </Card>

          {/* 지도 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-500" />
                코스 지도
              </CardTitle>
              <CardDescription>
                방문지 위치와 이동 경로를 확인하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowMap(!showMap)}
                    variant={showMap ? 'default' : 'outline'}
                    className="flex items-center gap-2"
                  >
                    <Navigation className="h-4 w-4" />
                    {showMap ? '지도 숨기기' : '지도 보기'}
                  </Button>
                </div>

                <div
                  className={`h-80 sm:h-96 lg:h-[500px] w-full rounded-lg overflow-hidden border-2 border-gray-200 ${!showMap ? 'hidden' : ''}`}
                >
                  <KakaoMap
                    center={getMapCenter()}
                    level={12}
                    markers={getMapMarkers()}
                    routes={[getMapRoute()]}
                    onMarkerClick={handleMarkerClick}
                    className="w-full h-full"
                    style={{ minHeight: '320px' }}
                    shouldInitialize={showMap}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 방문지 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-500" />
                방문지 ({course.locations?.length || 0}개)
              </CardTitle>
              <CardDescription>
                코스에 포함된 주요 방문지들을 확인해보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.locations && course.locations.length > 0 ? (
                course.locations.map((location, index) => (
                  <div
                    key={location.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className="w-full p-3 sm:p-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                      onClick={() => toggleLocation(location.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs sm:text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg">
                              {location.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-600 line-clamp-1">
                              {location.description}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs w-fit"
                              >
                                {location.coordinates.lat.toFixed(4)},{' '}
                                {location.coordinates.lng.toFixed(4)}
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLocation(location.id);
                                  setShowMap(true);
                                }}
                                className="text-xs h-5 sm:h-6 px-2 w-fit"
                              >
                                <MapPin className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">
                                  지도에서 보기
                                </span>
                                <span className="sm:hidden">지도</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                        {expandedLocation === location.id ? (
                          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>

                    {expandedLocation === location.id && (
                      <div className="px-4 pb-4 border-t bg-neutral-50">
                        <div className="pt-4 space-y-4">
                          <div className="relative h-48 w-full rounded-lg overflow-hidden">
                            <Image
                              src={location.image}
                              alt={location.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-neutral-700">
                            {location.description}
                          </p>

                          {/* 미디어 콘텐츠 */}
                          {location.media.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm text-neutral-600">
                                관련 콘텐츠
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {location.media.map((media) => (
                                  <div
                                    key={media.id}
                                    className="relative h-24 rounded-lg overflow-hidden"
                                  >
                                    <Image
                                      src={media.url}
                                      alt={media.title}
                                      fill
                                      className="object-cover"
                                    />
                                    {media.type === 'video' && (
                                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Play className="h-6 w-6 text-white" />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* QR 코드 스캔 버튼 */}
                          <div className="flex gap-2">
                            <Button size="sm" className="btn-primary">
                              <QrCode className="h-4 w-4 mr-2" />
                              QR 스캔
                            </Button>
                            <Button size="sm" variant="outline">
                              <Camera className="h-4 w-4 mr-2" />
                              사진 촬영
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>방문지 정보가 없습니다.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 여행 팁 */}
          <Card>
            <CardHeader>
              <CardTitle>여행 팁</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.tips && course.tips.length > 0 ? (
                  course.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary-500 mt-1">•</span>
                      <span className="text-neutral-700">{tip}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">여행 팁이 없습니다.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 정보 */}
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>코스 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-neutral-500" />
                <div>
                  <div className="font-medium">소요 시간</div>
                  <div className="text-sm text-neutral-600">
                    {course.duration}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-neutral-500" />
                <div>
                  <div className="font-medium">난이도</div>
                  <div className="text-sm text-neutral-600">
                    {course.difficulty}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-secondary-500" />
                <div>
                  <div className="font-medium">평점</div>
                  <div className="text-sm text-neutral-600">
                    {course.rating}/5.0
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 교통편 */}
          <Card>
            <CardHeader>
              <CardTitle>교통편</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700">
                {course.transportation}
              </p>
            </CardContent>
          </Card>

          {/* 최적 시간 */}
          <Card>
            <CardHeader>
              <CardTitle>최적 시간</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700">{course.bestTime}</p>
            </CardContent>
          </Card>

          {/* 비용 */}
          <Card>
            <CardHeader>
              <CardTitle>예상 비용</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700">{course.cost}</p>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          <div className="space-y-3">
            <Button className="w-full btn-primary">
              코스 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full">
              즐겨찾기 추가
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
