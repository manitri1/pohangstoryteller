'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  X,
  Plus,
  Grid3X3,
  Clock,
  MapPin,
  Image as ImageIcon,
  Lock,
  Globe,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createAlbum, AlbumTemplate } from '@/features/albums/api';

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlbumCreated?: (album: any) => void;
  templates?: AlbumTemplate[];
}

export function CreateAlbumModal({
  isOpen,
  onClose,
  onAlbumCreated,
  templates = [],
}: CreateAlbumModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [templateType, setTemplateType] = useState<
    'grid' | 'timeline' | 'travel'
  >('grid');
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setTemplateType('grid');
    setIsPublic(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: '제목을 입력해주세요',
        description: '앨범 제목을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await createAlbum({
        title: title.trim(),
        description: description.trim() || undefined,
        template_type: templateType,
        is_public: isPublic,
      });

      if (error) {
        throw error;
      }

      toast({
        title: '앨범 생성 완료',
        description: '새로운 앨범이 성공적으로 생성되었습니다.',
      });

      handleClose();
      onAlbumCreated?.(data);
    } catch (error) {
      console.error('앨범 생성 오류:', error);
      toast({
        title: '앨범 생성 실패',
        description: `앨범 생성 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'grid':
        return <Grid3X3 className="h-5 w-5" />;
      case 'timeline':
        return <Clock className="h-5 w-5" />;
      case 'travel':
        return <MapPin className="h-5 w-5" />;
      default:
        return <Grid3X3 className="h-5 w-5" />;
    }
  };

  const getTemplateDescription = (type: string) => {
    switch (type) {
      case 'grid':
        return '사진을 격자 형태로 배치하는 기본 템플릿';
      case 'timeline':
        return '시간 순서대로 콘텐츠를 배치하는 템플릿';
      case 'travel':
        return '여행 기록에 특화된 템플릿';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />새 앨범 만들기
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 앨범 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">앨범 제목 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="앨범 제목을 입력하세요"
              required
            />
          </div>

          {/* 앨범 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">앨범 설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="앨범에 대한 설명을 입력하세요 (선택사항)"
              rows={3}
            />
          </div>

          {/* 템플릿 선택 */}
          <div className="space-y-3">
            <Label>앨범 템플릿</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['grid', 'timeline', 'travel'] as const).map((type) => (
                <Card
                  key={type}
                  className={`cursor-pointer transition-all duration-200 ${
                    templateType === type
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setTemplateType(type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getTemplateIcon(type)}
                      <span className="font-medium capitalize">{type}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {getTemplateDescription(type)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 공개 설정 */}
          <div className="space-y-3">
            <Label>공개 설정</Label>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  !isPublic
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setIsPublic(false)}
              >
                <Lock className="h-4 w-4" />
                <div>
                  <div className="font-medium">비공개</div>
                  <div className="text-sm text-gray-600">
                    나만 볼 수 있습니다
                  </div>
                </div>
              </div>
              <div
                className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                  isPublic
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setIsPublic(true)}
              >
                <Globe className="h-4 w-4" />
                <div>
                  <div className="font-medium">공개</div>
                  <div className="text-sm text-gray-600">
                    누구나 볼 수 있습니다
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 미리보기 */}
          <div className="space-y-2">
            <Label>앨범 미리보기</Label>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{title || '앨범 제목'}</div>
                  <div className="text-sm text-gray-600">
                    {description || '앨범 설명이 여기에 표시됩니다'}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {getTemplateIcon(templateType)}
                      <span className="ml-1 capitalize">{templateType}</span>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {isPublic ? (
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
              </div>
            </Card>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '생성 중...' : '앨범 만들기'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
