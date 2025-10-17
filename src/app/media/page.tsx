'use client';

import { useState, useEffect } from 'react';
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
import {
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  Image as ImageIcon,
  Video,
  Music,
  MapPin,
  Calendar,
  Tag,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  EyeOff,
} from 'lucide-react';
import Image from 'next/image';
import {
  getMediaFiles,
  getMediaStats,
  deleteMediaFile,
  updateMediaFile,
  MediaFile,
  MediaSearchParams,
  MediaStats,
} from '@/features/media/api';
import { toast } from '@/hooks/use-toast';
import FeatureAccess from '@/components/auth/feature-access';
import { UploadModal } from '@/components/media/upload-modal';
import { AdvancedSearch } from '@/components/media/advanced-search';
import { MetadataEditor } from '@/components/media/metadata-editor';

export default function MediaPage() {
  return (
    <FeatureAccess
      featureName="미디어 관리"
      description="여행 사진과 영상을 체계적으로 관리해보세요."
    >
      <MediaContent />
    </FeatureAccess>
  );
}

function MediaContent() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileType, setFileType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<MediaFile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMediaFiles();
    loadStats();
  }, []);

  const loadMediaFiles = async (params?: MediaSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      console.log('미디어 파일 로드 시작...');

      const { data, error } = await getMediaFiles(params);

      if (error) {
        console.error('API 오류:', error);
        // Supabase 연결 오류인 경우 더미 데이터 표시
        if (error.message?.includes('supabaseKey is required')) {
          console.log('Supabase 연결 오류, 더미 데이터 표시');
          setMediaFiles([
            {
              id: 'demo-1',
              user_id: '00000000-0000-0000-0000-000000000001',
              file_name: 'pohang_beach.jpg',
              file_type: 'image',
              mime_type: 'image/jpeg',
              file_size: 1500000,
              file_path: 'uploads/pohang_beach.jpg',
              url: 'https://picsum.photos/seed/pohang_beach/800/600',
              tags: ['pohang', 'beach', 'travel', 'summer'],
              metadata: { camera: 'Canon EOS R', aperture: 'f/4.0' },
              location_data: {
                lat: 36.0,
                lng: 129.0,
                location_name: '영일대 해수욕장',
              },
              is_public: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 'demo-2',
              user_id: '00000000-0000-0000-0000-000000000001',
              file_name: 'jookdo_market.mp4',
              file_type: 'video',
              mime_type: 'video/mp4',
              file_size: 10000000,
              file_path: 'uploads/jookdo_market.mp4',
              url: 'https://sample-videos.com/video123.mp4',
              tags: ['jookdo', 'market', 'food', 'vlog'],
              metadata: { duration: 30 },
              location_data: {
                lat: 36.03,
                lng: 129.37,
                location_name: '죽도시장',
              },
              is_public: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
          return;
        }
        throw error;
      }

      console.log('로드된 미디어 파일:', data);
      setMediaFiles(data || []);
    } catch (error) {
      console.error('미디어 파일 로드 오류:', error);
      setError('미디어 파일을 불러오는 중 오류가 발생했습니다.');
      toast({
        title: '미디어 파일 로드 실패',
        description:
          '미디어 파일을 불러오는 중 오류가 발생했습니다. 콘솔을 확인해주세요.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = () => {
    loadMediaFiles();
    loadStats();
  };

  const handleSearchResults = (results: MediaFile[]) => {
    setSearchResults(results);
  };

  const handleSearchStart = () => {
    setIsSearching(true);
  };

  const handleSearchEnd = () => {
    setIsSearching(false);
  };

  const handleFileUpdate = (updatedFile: MediaFile) => {
    setMediaFiles((prev) =>
      prev.map((file) => (file.id === updatedFile.id ? updatedFile : file))
    );

    // 검색 결과도 업데이트
    if (searchResults.length > 0) {
      setSearchResults((prev) =>
        prev.map((file) => (file.id === updatedFile.id ? updatedFile : file))
      );
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await getMediaStats();

      if (error) {
        // Supabase 연결 오류인 경우 더미 통계 표시
        if (
          error.message?.includes('supabaseKey is required') ||
          error.code === '42804'
        ) {
          console.log('Supabase 연결 오류, 더미 통계 표시');
          setStats({
            total_files: 2,
            total_size: 11500000,
            image_count: 1,
            video_count: 1,
            audio_count: 0,
            public_count: 1,
            private_count: 1,
          });
          return;
        }
        throw error;
      }

      setStats(data);
    } catch (error) {
      console.error('미디어 통계 로드 오류:', error);
    }
  };

  const handleSearch = () => {
    const params: MediaSearchParams = {
      search_term: searchTerm || undefined,
      file_type:
        fileType !== 'all'
          ? (fileType as 'image' | 'video' | 'audio')
          : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    };

    loadMediaFiles(params);
  };

  const handleDeleteFile = async (file: MediaFile) => {
    if (!confirm(`"${file.file_name}"을(를) 삭제하시겠습니까?`)) return;

    try {
      const { error } = await deleteMediaFile(file.id);
      if (error) throw error;

      setMediaFiles((prev) => prev.filter((f) => f.id !== file.id));
      loadStats(); // 통계 업데이트

      toast({
        title: '파일 삭제 완료',
        description: '파일이 성공적으로 삭제되었습니다.',
      });
    } catch (error) {
      console.error('파일 삭제 오류:', error);
      toast({
        title: '파일 삭제 실패',
        description: '파일 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePublic = async (file: MediaFile) => {
    try {
      const { error } = await updateMediaFile(file.id, {
        is_public: !file.is_public,
      });

      if (error) throw error;

      setMediaFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, is_public: !f.is_public } : f
        )
      );

      toast({
        title: '공개 설정 변경',
        description: `파일이 ${
          !file.is_public ? '공개' : '비공개'
        }로 설정되었습니다.`,
      });
    } catch (error) {
      console.error('공개 설정 변경 오류:', error);
      toast({
        title: '설정 변경 실패',
        description: '공개 설정 변경 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">미디어 파일을 불러오는 중...</p>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              오류가 발생했습니다
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
              <h3 className="font-medium text-yellow-800 mb-2">
                개발 환경 안내
              </h3>
              <p className="text-sm text-yellow-700">
                Supabase 연결이 설정되지 않았습니다. 실제 사용을 위해서는:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                <li>.env.local 파일에 Supabase URL과 키를 설정하세요</li>
                <li>데이터베이스 마이그레이션을 실행하세요</li>
                <li>Storage 버킷을 생성하세요</li>
              </ul>
            </div>
            <Button onClick={() => loadMediaFiles()}>다시 시도</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">미디어 관리</h1>
            <p className="text-gray-600">
              여행 사진과 영상을 체계적으로 관리해보세요.
            </p>
          </div>
          <UploadModal onUploadComplete={handleUploadComplete} />
        </div>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">총 파일</span>
              </div>
              <p className="text-2xl font-bold">{stats.total_files}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">이미지</span>
              </div>
              <p className="text-2xl font-bold">{stats.image_count}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Video className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">영상</span>
              </div>
              <p className="text-2xl font-bold">{stats.video_count}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Music className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">오디오</span>
              </div>
              <p className="text-2xl font-bold">{stats.audio_count}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 고급 검색 */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <AdvancedSearch
            onSearchResults={handleSearchResults}
            onSearchStart={handleSearchStart}
            onSearchEnd={handleSearchEnd}
          />
        </CardContent>
      </Card>

      {/* 뷰 모드 및 액션 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {searchResults.length > 0
              ? `검색 결과: ${searchResults.length}개`
              : `전체 파일: ${mediaFiles.length}개`}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* 뷰 모드 */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 파일 목록 */}
      {(searchResults.length > 0 ? searchResults : mediaFiles).length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">미디어 파일이 없습니다</h3>
            <p className="text-gray-600 mb-4">
              첫 번째 파일을 업로드하여 여행 추억을 정리해보세요.
            </p>
            <UploadModal onUploadComplete={handleUploadComplete} />
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-4'
          }
        >
          {(searchResults.length > 0 ? searchResults : mediaFiles).map(
            (file) => (
              <Card
                key={file.id}
                className="group overflow-hidden hover:shadow-lg transition-shadow"
              >
                {viewMode === 'grid' ? (
                  // 그리드 뷰
                  <>
                    <div className="aspect-video bg-gray-100 relative">
                      {file.file_type === 'image' ? (
                        <Image
                          src={
                            file.url ||
                            `https://picsum.photos/seed/${file.id}/800/600`
                          }
                          alt={file.file_name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getFileIcon(file.file_type)}
                        </div>
                      )}

                      {/* 공개/비공개 표시 */}
                      <div className="absolute top-2 right-2">
                        {file.is_public ? (
                          <Badge variant="default" className="bg-green-600">
                            <Eye className="h-3 w-3 mr-1" />
                            공개
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            비공개
                          </Badge>
                        )}
                      </div>

                      {/* 액션 버튼 */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePublic(file)}
                            className="h-6 w-6 p-0"
                          >
                            {file.is_public ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteFile(file)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file.file_type)}
                          <Badge variant="outline" className="text-xs">
                            {file.file_type}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="font-medium text-sm mb-1 truncate">
                        {file.file_name}
                      </h3>

                      <div className="text-xs text-gray-500 space-y-1">
                        <p>{formatFileSize(file.file_size)}</p>
                        <p>{formatDate(file.created_at)}</p>
                        {file.location_data && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{file.location_data.location_name}</span>
                          </div>
                        )}
                      </div>

                      {file.tags && file.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {file.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {file.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{file.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </>
                ) : (
                  // 리스트 뷰
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        {getFileIcon(file.file_type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium truncate">
                            {file.file_name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {file.file_type}
                          </Badge>
                          {file.is_public ? (
                            <Badge
                              variant="default"
                              className="bg-green-600 text-xs"
                            >
                              공개
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              비공개
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-gray-500 space-y-1">
                          <p>
                            {formatFileSize(file.file_size)} •{' '}
                            {formatDate(file.created_at)}
                          </p>
                          {file.location_data && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{file.location_data.location_name}</span>
                            </div>
                          )}
                        </div>

                        {file.tags && file.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {file.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <MetadataEditor
                          file={file}
                          onUpdate={handleFileUpdate}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTogglePublic(file)}
                        >
                          {file.is_public ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteFile(file)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}
