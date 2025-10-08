'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Calendar,
  User,
  Image as ImageIcon,
  Video,
  FileText,
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ClientOnly from '@/components/common/ClientOnly';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  content: string;
  images?: string[];
  location?: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
  type: 'text' | 'image' | 'video' | 'album';
}

interface PostCardProps {
  post: Post;
  onLike?: (post: Post) => void;
  onComment?: (post: Post) => void;
  onShare?: (post: Post) => void;
  onBookmark?: (post: Post) => void;
  onView?: (post: Post) => void;
  showActions?: boolean;
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onView,
  showActions = true,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const formatDate = (date: Date): string => {
    // 서버와 클라이언트 간의 시간 차이를 방지하기 위해 안전한 포맷팅 사용
    if (typeof window === 'undefined') {
      return date.toISOString();
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onLike?.(post);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(post);
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'album':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-100 text-blue-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'album':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {post.author.name}
                  </h3>
                  {post.author.verified && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 text-xs"
                    >
                      인증
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <ClientOnly fallback={<span>로딩 중...</span>}>
                    <span>{formatDate(post.createdAt)}</span>
                  </ClientOnly>
                  {post.location && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{post.location}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getPostTypeColor(post.type)}>
                {getPostTypeIcon(post.type)}
                <span className="ml-1">{post.type.toUpperCase()}</span>
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 게시물 내용 */}
          <div className="space-y-3">
            <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>

            {/* 이미지 갤러리 */}
            {post.images && post.images.length > 0 && (
              <div
                className={`grid gap-2 ${
                  post.images.length === 1
                    ? 'grid-cols-1'
                    : post.images.length === 2
                      ? 'grid-cols-2'
                      : post.images.length === 3
                        ? 'grid-cols-2'
                        : 'grid-cols-2'
                }`}
              >
                {post.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg"
                  >
                    <Image
                      src={image}
                      alt={`게시물 이미지 ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                    />
                    {index === 3 && post.images!.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          +{post.images.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 태그 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          {showActions && (
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${
                    isLiked ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
                  />
                  <span>{likeCount}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onComment?.(post)}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShare?.(post)}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{post.shares}</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`${
                  isBookmarked ? 'text-yellow-500' : 'text-gray-500'
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
                />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
