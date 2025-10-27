'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Grid3X3,
  Clock,
  MapPin,
  Image as ImageIcon,
  Lock,
  Globe,
  MoreHorizontal,
  Edit,
  Trash2,
  Share,
  Eye,
} from 'lucide-react';
import Image from 'next/image';
import { CreateAlbumModal } from './create-album-modal';
import { getAlbums, Album } from '@/features/albums/api';
import { toast } from '@/hooks/use-toast';

interface AlbumListProps {
  onAlbumSelect?: (album: Album) => void;
}

export function AlbumList({ onAlbumSelect }: AlbumListProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAlbums();

      if (error) {
        throw error;
      }

      setAlbums(data || []);
    } catch (error) {
      console.error('앨범 목록 로드 오류:', error);
      toast({
        title: '앨범 목록 로드 실패',
        description: '앨범 목록을 불러오는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAlbumCreated = (newAlbum: Album) => {
    setAlbums((prev) => [newAlbum, ...prev]);
    setShowCreateModal(false);
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'grid':
        return <Grid3X3 className="h-4 w-4" />;
      case 'timeline':
        return <Clock className="h-4 w-4" />;
      case 'travel':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Grid3X3 className="h-4 w-4" />;
    }
  };

  const getTemplateName = (type: string) => {
    switch (type) {
      case 'grid':
        return '그리드';
      case 'timeline':
        return '타임라인';
      case 'travel':
        return '여행';
      default:
        return type;
    }
  };

  const filteredAlbums = albums.filter((album) => {
    const matchesSearch =
      album.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (album.description &&
        album.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filter === 'all' ||
      (filter === 'public' && album.is_public) ||
      (filter === 'private' && !album.is_public);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">나의 앨범</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">나의 앨범</h2>
          <p className="text-gray-600">여행의 추억을 담은 앨범을 관리하세요</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />새 앨범 만들기
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="앨범 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            전체
          </Button>
          <Button
            variant={filter === 'public' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('public')}
          >
            <Globe className="h-4 w-4 mr-1" />
            공개
          </Button>
          <Button
            variant={filter === 'private' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('private')}
          >
            <Lock className="h-4 w-4 mr-1" />
            비공개
          </Button>
        </div>
      </div>

      {/* 앨범 목록 */}
      {filteredAlbums.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? '검색 결과가 없습니다' : '아직 앨범이 없습니다'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? '다른 검색어를 시도해보세요'
              : '첫 번째 앨범을 만들어보세요!'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              앨범 만들기
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <Card
              key={album.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => onAlbumSelect?.(album)}
            >
              {/* 앨범 커버 */}
              <div className="aspect-video bg-gray-100 relative">
                {album.cover_image_url ? (
                  <Image
                    src={album.cover_image_url}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                {/* 오버레이 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4 mr-2" />
                      보기
                    </Button>
                  </div>
                </div>

                {/* 공개 상태 */}
                <div className="absolute top-2 right-2">
                  <Badge variant={album.is_public ? 'default' : 'secondary'}>
                    {album.is_public ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" />
                        공개
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 mr-1" />
                        비공개
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {album.title}
                  </h3>

                  {album.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {album.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getTemplateIcon(album.template_type)}
                        <span className="ml-1">
                          {getTemplateName(album.template_type)}
                        </span>
                      </Badge>
                      {album.item_count && (
                        <Badge variant="outline" className="text-xs">
                          {album.item_count}개 아이템
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    {new Date(album.created_at).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 앨범 생성 모달 */}
      <CreateAlbumModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAlbumCreated={handleAlbumCreated}
      />
    </div>
  );
}
