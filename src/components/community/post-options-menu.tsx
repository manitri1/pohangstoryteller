'use client';

import { useState } from 'react';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Share,
  Bookmark,
  Flag,
  Copy,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface PostOptionsMenuProps {
  postId: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onReport?: () => void;
  onCopyLink?: () => void;
}

export function PostOptionsMenu({
  postId,
  isOwner = false,
  onEdit,
  onDelete,
  onShare,
  onBookmark,
  onReport,
  onCopyLink,
}: PostOptionsMenuProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleEdit = () => {
    onEdit?.();
    toast({
      title: '게시물 수정',
      description: '게시물을 수정할 수 있습니다.',
    });
  };

  const handleDelete = () => {
    if (confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      onDelete?.();
      toast({
        title: '게시물 삭제',
        description: '게시물이 삭제되었습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = () => {
    onShare?.();
    toast({
      title: '게시물 공유',
      description: '게시물을 공유했습니다.',
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
    toast({
      title: isBookmarked ? '북마크 해제' : '북마크 추가',
      description: isBookmarked
        ? '북마크에서 제거되었습니다.'
        : '북마크에 추가되었습니다.',
    });
  };

  const handleReport = () => {
    onReport?.();
    toast({
      title: '게시물 신고',
      description: '신고가 접수되었습니다. 검토 후 조치하겠습니다.',
    });
  };

  const handleCopyLink = () => {
    onCopyLink?.();
    navigator.clipboard.writeText(
      `${window.location.origin}/community/${postId}`
    );
    toast({
      title: '링크 복사',
      description: '게시물 링크가 클립보드에 복사되었습니다.',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">게시물 옵션 열기</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* 소유자 전용 옵션 */}
        {isOwner && (
          <>
            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              수정
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* 공통 옵션 */}
        <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
          <Share className="mr-2 h-4 w-4" />
          공유
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          링크 복사
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleBookmark} className="cursor-pointer">
          <Bookmark
            className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
          />
          {isBookmarked ? '북마크 해제' : '북마크'}
        </DropdownMenuItem>

        {/* 비소유자 전용 옵션 */}
        {!isOwner && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleReport}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Flag className="mr-2 h-4 w-4" />
              신고
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
