'use client';

import { useState } from 'react';
import { X, Image as ImageIcon, Video, FileText, Stamp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (data: {
    type: 'image' | 'video' | 'stamp' | 'story';
    title: string;
    content?: string;
    location?: string;
  }) => void;
}

export function AddItemModal({
  isOpen,
  onClose,
  onAddItem,
}: AddItemModalProps) {
  const [type, setType] = useState<'image' | 'video' | 'stamp' | 'story'>(
    'image'
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: '제목을 입력해주세요',
        description: '아이템 제목을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddItem({
        type,
        title: title.trim(),
        content: content.trim() || undefined,
        location: location.trim() || undefined,
      });

      // 폼 초기화
      setTitle('');
      setContent('');
      setLocation('');
    } catch (error) {
      console.error('아이템 추가 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setContent('');
      setLocation('');
      onClose();
    }
  };

  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
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

  const getTypeDescription = (itemType: string) => {
    switch (itemType) {
      case 'image':
        return '사진이나 이미지를 추가합니다';
      case 'video':
        return '동영상을 추가합니다';
      case 'stamp':
        return '스탬프를 추가합니다';
      case 'story':
        return '이야기나 텍스트를 추가합니다';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>아이템 추가</DialogTitle>
          <DialogDescription>
            앨범에 새로운 아이템을 추가해보세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">아이템 타입 *</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="아이템 타입을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon('image')}
                    <span>이미지</span>
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon('video')}
                    <span>비디오</span>
                  </div>
                </SelectItem>
                <SelectItem value="stamp">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon('stamp')}
                    <span>스탬프</span>
                  </div>
                </SelectItem>
                <SelectItem value="story">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon('story')}
                    <span>스토리</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">{getTypeDescription(type)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="아이템 제목을 입력하세요"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용 (선택사항)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="아이템에 대한 설명을 입력하세요"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">위치 (선택사항)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="위치를 입력하세요"
              disabled={isSubmitting}
            />
          </div>

          {/* 타입별 추가 안내 */}
          {type === 'image' && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 이미지는 업로드 후 자동으로 추가됩니다.
              </p>
            </div>
          )}

          {type === 'video' && (
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">
                💡 비디오는 업로드 후 자동으로 추가됩니다.
              </p>
            </div>
          )}

          {type === 'stamp' && (
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">
                💡 QR 스탬프 스캔으로 자동으로 추가됩니다.
              </p>
            </div>
          )}

          {type === 'story' && (
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">
                💡 텍스트 기반 스토리를 추가합니다.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '추가 중...' : '아이템 추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
