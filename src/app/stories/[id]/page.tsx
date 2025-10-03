import { MainLayout } from '@/components/layout/main-layout';
import { CourseDetail } from '@/components/stories/course-detail';
import { notFound } from 'next/navigation';

// API에서 데이터 가져오기
async function getCourse(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/courses/${id}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch course:', error);
    return null;
  }
}

// 임시 데이터 - API 실패 시 fallback
const mockCourses = [
  {
    id: '1',
    title: '포항 바다 이야기',
    description:
      '영일대 해수욕장부터 포항운하까지, 포항의 바다를 만끽하는 코스',
    fullDescription:
      '포항의 아름다운 바다를 따라 걷는 특별한 여행입니다. 영일대 해수욕장의 모래사장에서 시작하여 포항운하의 운치 있는 풍경을 감상하고, 마지막으로 호미곶에서 일몰을 감상하는 로맨틱한 코스입니다.',
    duration: '3시간',
    difficulty: '쉬움',
    rating: 4.8,
    image: 'https://picsum.photos/800/400?random=1',
    category: '자연경관',
    locations: [
      {
        id: '1',
        name: '영일대 해수욕장',
        description:
          '포항의 대표적인 해수욕장으로 아름다운 모래사장과 맑은 바다를 자랑합니다.',
        coordinates: { lat: 36.0195, lng: 129.3435 },
        qrCode: 'QR001',
        image: 'https://picsum.photos/400/300?random=11',
        media: [
          {
            id: '1',
            type: 'image',
            url: 'https://picsum.photos/400/300?random=11',
            title: '영일대 해수욕장 전경',
          },
        ],
      },
      {
        id: '2',
        name: '포항운하',
        description: '포항의 운치 있는 운하로 산책하기 좋은 장소입니다.',
        coordinates: { lat: 36.019, lng: 129.34 },
        qrCode: 'QR002',
        image: 'https://picsum.photos/400/300?random=12',
        media: [
          {
            id: '2',
            type: 'image',
            url: 'https://picsum.photos/400/300?random=12',
            title: '포항운하 풍경',
          },
        ],
      },
      {
        id: '3',
        name: '호미곶',
        description:
          '한반도 최동단으로 일출과 일몰을 감상할 수 있는 명소입니다.',
        coordinates: { lat: 36.0761, lng: 129.5653 },
        qrCode: 'QR003',
        image: 'https://picsum.photos/400/300?random=13',
        media: [
          {
            id: '3',
            type: 'image',
            url: 'https://picsum.photos/400/300?random=13',
            title: '호미곶 등대',
          },
        ],
      },
    ],
    tips: [
      '해수욕장 방문 시 수영복과 선크림을 준비하세요.',
      '일몰 시간을 확인하여 호미곶에서 아름다운 일몰을 감상하세요.',
      '운하 주변에는 카페와 맛집이 많으니 여유롭게 즐기세요.',
    ],
    transportation: '대중교통 이용 가능 (시내버스, 택시)',
    bestTime: '봄, 가을 (3-5월, 9-11월)',
    cost: '무료 (교통비 별도)',
  },
  {
    id: '2',
    title: '호미곶 역사 기행',
    description: '한반도 최동단에서 만나는 역사와 웅장한 일출',
    fullDescription:
      '호미곶의 역사적 의미와 아름다운 자연을 함께 경험하는 코스입니다. 등대와 일출공원을 방문하여 포항의 역사와 문화를 느껴보세요.',
    duration: '4시간',
    difficulty: '보통',
    rating: 4.6,
    image: 'https://picsum.photos/800/400?random=2',
    category: '역사여행',
    locations: [
      {
        id: '4',
        name: '호미곶 등대',
        description: '한반도 최동단의 상징인 호미곶 등대입니다.',
        coordinates: { lat: 36.0761, lng: 129.5653 },
        qrCode: 'QR004',
        image: 'https://picsum.photos/400/300?random=21',
        media: [
          {
            id: '4',
            type: 'image',
            url: 'https://picsum.photos/400/300?random=21',
            title: '호미곶 등대',
          },
        ],
      },
      {
        id: '5',
        name: '일출공원',
        description: '아름다운 일출을 감상할 수 있는 공원입니다.',
        coordinates: { lat: 36.075, lng: 129.564 },
        qrCode: 'QR005',
        image: 'https://picsum.photos/400/300?random=22',
        media: [
          {
            id: '5',
            type: 'image',
            url: 'https://picsum.photos/400/300?random=22',
            title: '일출공원',
          },
        ],
      },
    ],
    tips: [
      '일출 시간을 미리 확인하여 일출공원에서 아름다운 일출을 감상하세요.',
      '등대 내부 관람은 시간 제한이 있으니 미리 확인하세요.',
      '역사적 의미를 더 잘 이해하려면 가이드 투어를 추천합니다.',
    ],
    transportation: '시내버스 또는 자가용 이용',
    bestTime: '일출 시간 (새벽 5-6시)',
    cost: '무료 (주차비 별도)',
  },
];

interface CourseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;

  // API에서 데이터 가져오기 시도
  let course = await getCourse(id);

  // API 실패 시 fallback 데이터 사용
  if (!course) {
    course = mockCourses.find((c) => c.id === id);
  }

  if (!course) {
    notFound();
  }

  return (
    <MainLayout>
      <CourseDetail course={course} />
    </MainLayout>
  );
}
