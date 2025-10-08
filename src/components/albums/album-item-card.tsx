'use client';

import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Video,
  FileText,
  Stamp,
  Play,
  Eye,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface AlbumItem {
  id: string;
  type: 'image' | 'video' | 'stamp' | 'story';
  title: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  location?: string;
  createdAt: Date;
  likes?: number;
  comments?: number;
}

interface AlbumItemCardProps {
  item: AlbumItem;
  viewMode: 'grid' | 'list';
}

export function AlbumItemCard({ item, viewMode }: AlbumItemCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes || 0);
  const [imageError, setImageError] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'stamp':
        return <Stamp className="h-4 w-4" />;
      case 'story':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-100 text-blue-700';
      case 'video':
        return 'bg-red-100 text-red-700';
      case 'stamp':
        return 'bg-yellow-100 text-yellow-700';
      case 'story':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (viewMode === 'list') {
    return (
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* 썸네일 */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              {item.imageUrl && !imageError ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  {getTypeIcon(item.type)}
                </div>
              )}
            </div>

            {/* 아이템 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                  <span className="ml-1 capitalize">{item.type}</span>
                </Badge>
                <h3 className="font-semibold text-lg truncate">{item.title}</h3>
              </div>

              {item.content && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {item.content}
                </p>
              )}

              {/* 위치 */}
              {item.location && (
                <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                </div>
              )}

              {/* 통계 */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{likeCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{item.comments || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={liked ? 'text-red-500' : 'text-gray-500'}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-200 group">
      <div className="relative">
        {/* 미디어 컨텐츠 */}
        <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
          {item.type === 'video' && item.videoUrl ? (
            <div className="relative w-full h-full bg-black">
              <video
                src={item.videoUrl}
                className="w-full h-full object-cover"
                poster={item.imageUrl}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full w-12 h-12"
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            </div>
          ) : item.imageUrl && !imageError ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              {getTypeIcon(item.type)}
            </div>
          )}

          {/* 타입 배지 */}
          <div className="absolute top-3 left-3">
            <Badge className={`text-xs ${getTypeColor(item.type)}`}>
              {getTypeIcon(item.type)}
              <span className="ml-1 capitalize">{item.type}</span>
            </Badge>
          </div>

          {/* 좋아요 수 */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-1 bg-black/50 text-white rounded-full px-2 py-1 text-sm">
              <Heart className="h-3 w-3" />
              <span>{likeCount}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* 제목 */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>

          {/* 내용 */}
          {item.content && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {item.content}
            </p>
          )}

          {/* 위치 */}
          {item.location && (
            <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
              <MapPin className="h-4 w-4" />
              <span>{item.location}</span>
            </div>
          )}

          {/* 통계 */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(item.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{item.comments || 0}</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                liked ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              보기
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
