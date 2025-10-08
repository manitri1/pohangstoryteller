'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import MediaUploader from '@/components/media/MediaUploader';
import {
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Image as ImageIcon,
  Video,
  FileText,
  Calendar,
  MapPin,
  Tag,
  Download,
  Share2,
  Trash2,
  Edit,
  Eye,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import ClientOnly from '@/components/common/ClientOnly';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'text';
  title: string;
  description: string;
  location?: string;
  tags: string[];
  url: string;
  thumbnailUrl?: string;
  fileSize: number;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    coordinates?: { lat: number; lng: number };
    timestamp?: Date;
    camera?: string;
    resolution?: string;
    format?: string;
  };
}

interface MediaStats {
  totalFiles: number;
  totalSize: number;
  imageCount: number;
  videoCount: number;
  textCount: number;
  recentUploads: number;
}

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [stats, setStats] = useState<MediaStats>({
    totalFiles: 0,
    totalSize: 0,
    imageCount: 0,
    videoCount: 0,
    textCount: 0,
    recentUploads: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  // 미디어 데이터 로드
  const loadMediaItems = useCallback(async () => {
    try {
      setIsLoading(true);
      // 실제 API 호출 대신 목업 데이터 사용
      const mockData: MediaItem[] = [
        {
          id: '1',
          type: 'image',
          title: '포항 해변 일출',
          description: '아름다운 해변에서의 일출 사진',
          location: '영일대 해수욕장',
          tags: ['일출', '해변', '자연'],
          url: 'https://picsum.photos/800/600?random=10',
          thumbnailUrl: 'https://picsum.photos/400/300?random=10',
          fileSize: 2048576,
          createdAt: new Date('2024-12-19T06:00:00Z'),
          updatedAt: new Date('2024-12-19T06:00:00Z'),
          metadata: {
            coordinates: { lat: 36.0195, lng: 129.3435 },
            timestamp: new Date('2024-12-19T06:00:00Z'),
            camera: 'iPhone 15 Pro',
            resolution: '4032x3024',
            format: 'JPEG',
          },
        },
        {
          id: '2',
          type: 'video',
          title: '포항 시내 관광',
          description: '포항 시내 관광지들을 둘러본 영상',
          location: '포항 시내',
          tags: ['관광', '시내', '문화'],
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnailUrl: 'https://picsum.photos/400/300?random=11',
          fileSize: 1048576,
          duration: 120,
          createdAt: new Date('2024-12-19T14:00:00Z'),
          updatedAt: new Date('2024-12-19T14:00:00Z'),
          metadata: {
            coordinates: { lat: 36.0195, lng: 129.3435 },
            timestamp: new Date('2024-12-19T14:00:00Z'),
            camera: 'iPhone 15 Pro',
            resolution: '1920x1080',
            format: 'MP4',
          },
        },
        {
          id: '3',
          type: 'text',
          title: '포항 여행 일기',
          description: '포항 여행 중 작성한 일기',
          location: '포항',
          tags: ['일기', '여행', '추억'],
          url: '/documents/travel-diary.txt',
          fileSize: 1024,
          createdAt: new Date('2024-12-19T20:00:00Z'),
          updatedAt: new Date('2024-12-19T20:00:00Z'),
          metadata: {
            timestamp: new Date('2024-12-19T20:00:00Z'),
            format: 'TXT',
          },
        },
      ];

      setMediaItems(mockData);
      updateStats(mockData);
    } catch (error) {
      console.error('미디어 데이터 로드 실패:', error);
      toast({
        title: '오류',
        description: '미디어 데이터를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 미디어 데이터 로드
  useEffect(() => {
    loadMediaItems();
  }, [loadMediaItems]);

  // 필터링 및 정렬
  useEffect(() => {
    let filtered = [...mediaItems];

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // 타입 필터
    if (typeFilter !== 'all') {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'title':
          return a.title.localeCompare(b.title);
        case 'size':
          return b.fileSize - a.fileSize;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [mediaItems, searchTerm, typeFilter, sortBy]);

  // 통계 업데이트
  const updateStats = (items: MediaItem[]) => {
    const stats: MediaStats = {
      totalFiles: items.length,
      totalSize: items.reduce((sum, item) => sum + item.fileSize, 0),
      imageCount: items.filter((item) => item.type === 'image').length,
      videoCount: items.filter((item) => item.type === 'video').length,
      textCount: items.filter((item) => item.type === 'text').length,
      recentUploads: items.filter((item) => {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        return new Date(item.createdAt) > oneDayAgo;
      }).length,
    };
    setStats(stats);
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 날짜 포맷팅
  const formatDate = (date: Date): string => {
    // 서버와 클라이언트 간의 시간 차이를 방지하기 위해 안전한 포맷팅 사용
    if (typeof window === 'undefined') {
      return date.toISOString();
    }

    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // 미디어 아이템 보기
  const handleViewItem = (item: MediaItem) => {
    console.log('미디어 아이템 보기:', item);
    // 미디어 뷰어 모달 또는 페이지로 이동
  };

  // 미디어 아이템 편집
  const handleEditItem = (item: MediaItem) => {
    console.log('미디어 아이템 편집:', item);
    // 편집 모달 표시
  };

  // 미디어 아이템 공유
  const handleShareItem = (item: MediaItem) => {
    console.log('미디어 아이템 공유:', item);
    // 공유 모달 표시
  };

  // 미디어 아이템 다운로드
  const handleDownloadItem = (item: MediaItem) => {
    console.log('미디어 아이템 다운로드:', item);
    // 다운로드 실행
  };

  // 미디어 아이템 삭제
  const handleDeleteItem = (item: MediaItem) => {
    console.log('미디어 아이템 삭제:', item);
    // 삭제 확인 후 실행
  };

  // 업로드 완료
  const handleUploadComplete = (files: any[]) => {
    console.log('업로드 완료:', files);
    setShowUploader(false);
    loadMediaItems(); // 데이터 새로고침
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">미디어 관리</h1>
            <p className="text-gray-600 mt-1">
              포항 여행의 소중한 순간들을 관리하고 정리하세요
            </p>
          </div>
          <Button
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            파일 업로드
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalFiles}
              </div>
              <div className="text-sm text-gray-600">총 파일</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatFileSize(stats.totalSize)}
              </div>
              <div className="text-sm text-gray-600">총 용량</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.imageCount}
              </div>
              <div className="text-sm text-gray-600">이미지</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.videoCount}
              </div>
              <div className="text-sm text-gray-600">비디오</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.recentUploads}
              </div>
              <div className="text-sm text-gray-600">최근 업로드</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="미디어 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="타입 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="image">이미지</SelectItem>
              <SelectItem value="video">비디오</SelectItem>
              <SelectItem value="text">텍스트</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">최신순</SelectItem>
              <SelectItem value="title">제목순</SelectItem>
              <SelectItem value="size">크기순</SelectItem>
              <SelectItem value="type">타입순</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 미디어 목록 */}
      {filteredItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              아직 업로드된 미디어가 없습니다
            </h3>
            <p className="text-gray-600 mb-4">
              파일을 업로드하여 포항 여행의 소중한 순간들을 저장하세요!
            </p>
            <Button onClick={() => setShowUploader(true)}>
              <Upload className="h-4 w-4 mr-2" />첫 파일 업로드
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                {/* 썸네일 */}
                <div className="relative h-48 bg-gray-100">
                  {item.type === 'image' ? (
                    <Image
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : item.type === 'video' ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Video className="h-12 w-12 text-white" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* 타입 배지 */}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-black/50 text-white"
                    >
                      {item.type === 'image' && (
                        <ImageIcon className="h-3 w-3 mr-1" />
                      )}
                      {item.type === 'video' && (
                        <Video className="h-3 w-3 mr-1" />
                      )}
                      {item.type === 'text' && (
                        <FileText className="h-3 w-3 mr-1" />
                      )}
                      {item.type.toUpperCase()}
                    </Badge>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewItem(item)}
                      className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadItem(item)}
                      className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>

                    {/* 메타데이터 */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatFileSize(item.fileSize)}</span>
                        {item.duration && (
                          <span>{Math.round(item.duration)}초</span>
                        )}
                      </div>

                      {item.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <ClientOnly fallback={<span>로딩 중...</span>}>
                          <span>{formatDate(item.createdAt)}</span>
                        </ClientOnly>
                      </div>

                      {item.tags.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Tag className="h-3 w-3" />
                          <div className="flex gap-1">
                            {item.tags.slice(0, 2).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 2 && (
                              <span>+{item.tags.length - 2}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 업로더 모달 */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>파일 업로드</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploader(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* <MediaUploader onUpload={handleUploadComplete} /> */}
              <div className="text-center py-8">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  미디어 업로더 컴포넌트가 준비 중입니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
