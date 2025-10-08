'use client';

import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PostOptionsMenu } from './post-options-menu';
import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  title?: string;
  content: string;
  images?: string[];
  location?: string;
  hashtags?: string[];
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isOwner?: boolean;
  onComment?: () => void;
}

export function PostCard({
  id,
  author,
  title,
  content,
  images = [],
  location,
  hashtags = [],
  createdAt,
  likes,
  comments,
  shares,
  isLiked = false,
  isBookmarked = false,
  isOwner = false,
  onComment,
}: PostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${author.name}의 게시물`,
        text: content,
        url: `${window.location.origin}/community/${id}`,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>
                {author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm truncate">
                  {author.name}
                </h3>
                {author.verified && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    인증
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{createdAt}</span>
                </div>
              </div>
            </div>
          </div>
          <PostOptionsMenu
            postId={id}
            isOwner={isOwner}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* 게시물 제목 */}
        {title && (
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
        )}

        {/* 게시물 내용 */}
        <div className="mb-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>

          {/* 해시태그 */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {hashtags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/community?hashtag=${encodeURIComponent(tag)}`}
                  className="text-primary hover:underline text-sm"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 이미지 */}
        {images.length > 0 && (
          <div className="mb-4">
            {images.length === 1 ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={images[0]}
                  alt="게시물 이미지"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative h-32 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`게시물 이미지 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {index === 3 && images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          +{images.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                liked ? 'text-red-500' : 'text-muted-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onComment}
              className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{comments}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <Share className="h-4 w-4" />
              <span className="text-sm">{shares}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`${
              bookmarked ? 'text-yellow-500' : 'text-muted-foreground'
            }`}
          >
            <Bookmark
              className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
