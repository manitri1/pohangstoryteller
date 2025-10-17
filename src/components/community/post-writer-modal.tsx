'use client';

import { useState, useRef } from 'react';
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
  Image as ImageIcon,
  MapPin,
  Hash,
  Smile,
  Send,
  Upload,
  Trash2,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createPost } from '@/features/community/api';

interface PostWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export function PostWriterModal({
  isOpen,
  onClose,
  onPostCreated,
}: PostWriterModalProps) {
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 해시태그 추가
  const handleAddHashtag = () => {
    const trimmedTag = hashtagInput.trim().replace('#', '');
    if (trimmedTag && !hashtags.includes(trimmedTag)) {
      setHashtags([...hashtags, trimmedTag]);
      setHashtagInput('');
    }
  };

  // 해시태그 삭제
  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  // 해시태그 입력 키 이벤트
  const handleHashtagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  // 이미지 파일 선택
  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - images.length); // 최대 5개
    const newImages = [...images, ...newFiles];
    setImages(newImages);

    // 미리보기 생성
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  // 이미지 삭제
  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // 드래그 앤 드롭
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    handleImageSelect(files);
  };

  // 게시글 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast({
        title: '내용을 입력해주세요',
        description: '게시글 내용을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('게시글 작성 시작:', { content, hashtags, location, mood });

      // TODO: 이미지 업로드 처리 (Supabase Storage)
      const mediaUrls: string[] = []; // 임시로 빈 배열

      const postData = {
        content: content.trim(),
        media_urls: mediaUrls,
        hashtags: hashtags,
        location_data: location
          ? {
              name: location,
              coordinates: [0, 0] as [number, number], // TODO: 실제 좌표로 변경
            }
          : undefined,
        mood: mood || undefined,
        is_public: true,
      };

      console.log('게시글 데이터:', postData);

      const { data, error } = await createPost(postData);

      console.log('API 응답:', { data, error });

      if (error) {
        console.error('API 오류:', error);
        throw error;
      }

      toast({
        title: '게시글 작성 완료',
        description: '게시글이 성공적으로 작성되었습니다.',
      });

      // 폼 초기화
      setContent('');
      setHashtags([]);
      setHashtagInput('');
      setLocation('');
      setMood('');
      setImages([]);
      setImagePreviews([]);

      onClose();
      onPostCreated?.();
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      toast({
        title: '게시글 작성 실패',
        description: `게시글 작성 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 모달 닫기
  const handleClose = () => {
    if (!isSubmitting) {
      setContent('');
      setHashtags([]);
      setHashtagInput('');
      setLocation('');
      setMood('');
      setImages([]);
      setImagePreviews([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />새 게시글 작성
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 게시글 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content">게시글 내용 *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="포항 여행의 소중한 순간을 공유해보세요..."
              rows={4}
              className="resize-none"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <Label>사진 추가 (최대 5장)</Label>

            {/* 드래그 앤 드롭 영역 */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                사진을 드래그하거나 클릭하여 업로드
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                사진 선택
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {/* 이미지 미리보기 */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`미리보기 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 해시태그 */}
          <div className="space-y-2">
            <Label htmlFor="hashtags">해시태그</Label>
            <div className="flex gap-2">
              <Input
                id="hashtags"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                placeholder="#포항 #여행 #맛집"
                onKeyPress={handleHashtagKeyPress}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddHashtag}
                disabled={!hashtagInput.trim() || isSubmitting}
              >
                <Hash className="h-4 w-4" />
              </Button>
            </div>

            {/* 해시태그 목록 */}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    #{tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveHashtag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 위치 */}
          <div className="space-y-2">
            <Label htmlFor="location">위치 (선택사항)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="방문한 장소를 입력하세요"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* 기분 */}
          <div className="space-y-2">
            <Label htmlFor="mood">기분 (선택사항)</Label>
            <div className="flex gap-2">
              {['😊', '😍', '🤩', '😌', '😋', '🤔', '😢', '😴'].map((emoji) => (
                <Button
                  key={emoji}
                  type="button"
                  variant={mood === emoji ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMood(mood === emoji ? '' : emoji)}
                  disabled={isSubmitting}
                  className="text-lg"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={!content.trim() || isSubmitting}>
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  게시하기
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
