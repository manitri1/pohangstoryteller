'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  qrCode: string;
  image: string;
  media: Array<{
    id: string;
    type: string;
    url: string;
    title: string;
  }>;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  rating: number;
  image: string;
  category?: string;
  tags?: string[];
  reviewCount?: number;
  locations: Location[];
}

interface CourseCardListProps {
  courses: Course[];
}

export function CourseCardList({ courses }: CourseCardListProps) {
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

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-neutral-500">
          <p className="text-lg">추천할 수 있는 코스가 없습니다.</p>
          <p className="text-sm mt-2">다른 취향으로 다시 시도해보세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card
          key={course.id}
          className="card-course group hover:scale-105 transition-transform duration-200"
        >
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={course.image}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <Badge
                className={getCategoryColor(
                  course.category || course.tags?.[0] || '기타'
                )}
              >
                {course.category || course.tags?.[0] || '기타'}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className={getDifficultyColor(course.difficulty)}>
                {course.difficulty}
              </Badge>
            </div>
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                <Star className="h-4 w-4 text-secondary-500 fill-current" />
                <span className="text-sm font-medium">{course.rating}</span>
              </div>
            </div>
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold line-clamp-2">
              {course.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {course.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 코스 정보 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <MapPin className="h-4 w-4" />
                <span>{course.locations.length}개 방문지</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Users className="h-4 w-4" />
                <span>모든 연령대</span>
              </div>
            </div>

            {/* 방문지 목록 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-neutral-700">
                주요 방문지
              </h4>
              <div className="flex flex-wrap gap-1">
                {course.locations.slice(0, 3).map((location, index) => (
                  <Badge
                    key={location.id || index}
                    variant="outline"
                    className="text-xs"
                  >
                    {location.name}
                  </Badge>
                ))}
                {course.locations.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{course.locations.length - 3}개 더
                  </Badge>
                )}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="pt-2">
              <Button asChild className="w-full btn-primary">
                <Link href={`/stories/${course.id}`}>
                  코스 자세히 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
