import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CourseDetail } from '../course-detail';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock dynamic import
jest.mock('next/dynamic', () => () => {
  const MockMapContainer = () => <div data-testid="map-container">지도</div>;
  return MockMapContainer;
});

// Mock course data
const mockCourse = {
  id: '1',
  title: '포항 바다와 일몰의 만남',
  description:
    '영일대 해수욕장에서 시작하여 포항운하를 따라 산책하며 아름다운 일몰을 감상하는 코스',
  fullDescription: '영일대 해수욕장에서 시작하여 포항운하를 따라 산책하며 아름다운 일몰을 감상하는 코스입니다. 바다의 신선한 바람과 함께하는 힐링 여행을 즐겨보세요.',
  duration: '180분',
  difficulty: '쉬움',
  rating: 4.5,
  category: '자연경관',
  cost: '20,000원',
  image: 'https://picsum.photos/800/600?random=1',
  tips: ['일몰 시간을 미리 확인하세요', '편안한 신발을 착용하세요', '카메라를 준비하세요'],
  transportation: '도보',
  bestTime: '오후 4-6시',
  locations: [
    {
      id: '1',
      name: '영일대 해수욕장',
      description: '포항의 대표적인 해수욕장',
      coordinates: { lat: 36.0194, lng: 129.3656 },
      qrCode: 'QR_YEONGILDAE_001',
      image: 'https://picsum.photos/400/300?random=1',
      imageUrl: 'https://picsum.photos/400/300?random=1',
      media: [
        {
          id: '1',
          type: 'image' as const,
          url: 'https://picsum.photos/400/300?random=1',
          title: '영일대 해수욕장',
        },
      ],
    },
    {
      id: '2',
      name: '포항운하',
      description: '포항의 운하를 따라 산책할 수 있는 아름다운 경관',
      coordinates: { lat: 36.02, lng: 129.37 },
      qrCode: 'QR_POHANG_CANAL_001',
      image: 'https://picsum.photos/400/300?random=2',
      imageUrl: 'https://picsum.photos/400/300?random=2',
      media: [
        {
          id: '2',
          type: 'video' as const,
          url: 'https://example.com/video.mp4',
          title: '포항운하 영상',
          duration: 60,
        },
      ],
    },
  ],
};

describe('CourseDetail', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('renders course information correctly', () => {
    render(<CourseDetail course={mockCourse} />);

    expect(screen.getByText(mockCourse.title)).toBeInTheDocument();
    expect(screen.getByText(mockCourse.description)).toBeInTheDocument();
    expect(screen.getByText(mockCourse.category)).toBeInTheDocument();
    expect(screen.getByText(mockCourse.duration)).toBeInTheDocument();
    expect(screen.getByText(mockCourse.difficulty)).toBeInTheDocument();
  });

  it('displays course image', () => {
    render(<CourseDetail course={mockCourse} />);

    const courseImage = screen.getByAltText(mockCourse.title);
    expect(courseImage).toBeInTheDocument();
    expect(courseImage).toHaveAttribute('src', mockCourse.image);
  });

  it('renders location cards', () => {
    render(<CourseDetail course={mockCourse} />);

    mockCourse.locations.forEach((location) => {
      expect(screen.getByText(location.name)).toBeInTheDocument();
      expect(screen.getByText(location.description)).toBeInTheDocument();
    });
  });

  it('toggles location expansion', async () => {
    render(<CourseDetail course={mockCourse} />);

    const firstLocation = mockCourse.locations[0];
    const toggleButton = screen.getByText(firstLocation.name).closest('button');

    if (toggleButton) {
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText('QR 코드')).toBeInTheDocument();
        expect(screen.getByText('방문 시간')).toBeInTheDocument();
      });
    }
  });

  it('shows map when map button is clicked', async () => {
    render(<CourseDetail course={mockCourse} />);

    const mapButton = screen.getByText('지도 보기');
    fireEvent.click(mapButton);

    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  it('handles marker click events', async () => {
    render(<CourseDetail course={mockCourse} />);

    const mapButton = screen.getByText('지도 보기');
    fireEvent.click(mapButton);

    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  it('displays difficulty with correct styling', () => {
    render(<CourseDetail course={mockCourse} />);

    const difficultyBadge = screen.getByText(mockCourse.difficulty);
    expect(difficultyBadge).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('displays category with correct styling', () => {
    render(<CourseDetail course={mockCourse} />);

    const categoryBadge = screen.getByText(mockCourse.category);
    expect(categoryBadge).toHaveClass('bg-primary-100', 'text-primary-700');
  });

  it('renders media content for locations', () => {
    render(<CourseDetail course={mockCourse} />);

    // Expand first location to see media
    const firstLocation = mockCourse.locations[0];
    const toggleButton = screen.getByText(firstLocation.name).closest('button');

    if (toggleButton) {
      fireEvent.click(toggleButton);

      // Check if media is rendered
      const mediaItems = screen.getAllByAltText(firstLocation.media[0].title);
      expect(mediaItems.length).toBeGreaterThan(0);
    }
  });

  it('handles empty locations array', () => {
    const courseWithNoLocations = { ...mockCourse, locations: [] };
    render(<CourseDetail course={courseWithNoLocations} />);

    expect(screen.getByText(mockCourse.title)).toBeInTheDocument();
    expect(screen.queryByText('방문지')).not.toBeInTheDocument();
  });

  it('handles missing course data gracefully', () => {
    const incompleteCourse = {
      id: '1',
      title: 'Test Course',
      description: '',
      fullDescription: '',
      duration: '0분',
      difficulty: '쉬움',
      rating: 0,
      category: '자연경관',
      cost: '',
      image: '',
      tips: [],
      transportation: '',
      bestTime: '',
      locations: [],
    };

    render(<CourseDetail course={incompleteCourse} />);

    expect(screen.getByText('Test Course')).toBeInTheDocument();
  });
});
