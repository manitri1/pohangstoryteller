'use client';

import { useState } from 'react';
import {
  X,
  Image as ImageIcon,
  Video,
  FileText,
  Stamp,
  Calendar,
  Tag,
  Plus,
  Upload,
  Trash2,
  QrCode,
  MapPin,
} from 'lucide-react';
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
import { addAlbumItem } from '@/features/albums/api';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (newItem: any) => void;
  albumId: string;
}

export function AddItemModal({
  isOpen,
  onClose,
  onAddItem,
  albumId,
}: AddItemModalProps) {
  const [type, setType] = useState<
    'image' | 'video' | 'stamp' | 'text' | 'location'
  >('image');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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
      // 파일이 있는 경우 URL 생성 (실제로는 서버에 업로드 후 URL 반환)
      let mediaUrl: string | undefined;

      if (type === 'image' && files.length > 0) {
        // 제목을 기반으로 일관된 시드 생성
        const seed =
          title
            .trim()
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000;
        mediaUrl = `https://picsum.photos/seed/${seed}/800/600`;
      } else if (type === 'video' && files.length > 0) {
        mediaUrl =
          'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4';
      } else if (type === 'image') {
        // 파일이 없어도 이미지 타입인 경우 제목 기반 이미지 제공
        const seed =
          title
            .trim()
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000;
        mediaUrl = `https://picsum.photos/seed/${seed}/800/600`;
      }

      // API를 통해 아이템 추가
      const itemData = {
        album_id: albumId,
        item_type: type,
        content: content.trim() || undefined,
        media_url: mediaUrl,
        metadata: JSON.stringify({
          title: title.trim(),
          location: location.trim() || undefined,
          date: date || undefined,
          tags: tags.length > 0 ? tags : undefined,
        }),
        position: 0,
      };

      console.log('전달할 데이터:', itemData);

      const { data, error } = await addAlbumItem(itemData);

      if (error) {
        console.error('API 오류 상세:', error);
        throw error;
      }

      console.log('아이템 추가 성공:', data);

      // 성공 시 콜백 호출
      onAddItem(data);

      toast({
        title: '아이템 추가 완료',
        description: '앨범에 새로운 아이템이 추가되었습니다.',
      });

      // 폼 초기화
      setTitle('');
      setContent('');
      setLocation('');
      setDate('');
      setTagInput('');
      setTags([]);
      setFiles([]);
      setPreviewUrls([]);
      onClose();
    } catch (error) {
      console.error('아이템 추가 실패:', error);
      toast({
        title: '아이템 추가 실패',
        description: '아이템 추가 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setContent('');
      setLocation('');
      setDate('');
      setTagInput('');
      setTags([]);
      setFiles([]);
      setPreviewUrls([]);
      onClose();
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // 파일 업로드 처리
  const handleFileUpload = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    const validFiles = fileArray.filter((file) => {
      if (type === 'image') {
        return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024; // 10MB 제한
      } else if (type === 'video') {
        return file.type.startsWith('video/') && file.size <= 100 * 1024 * 1024; // 100MB 제한
      }
      return false;
    });

    if (validFiles.length !== fileArray.length) {
      toast({
        title: '파일 크기 초과',
        description:
          type === 'image'
            ? '이미지는 10MB 이하만 업로드 가능합니다.'
            : '비디오는 100MB 이하만 업로드 가능합니다.',
        variant: 'destructive',
      });
    }

    if (validFiles.length > 0) {
      setFiles(validFiles);

      // 미리보기 생성
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrls((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });

      toast({
        title: '파일 업로드 완료',
        description: `${validFiles.length}개의 파일이 업로드되었습니다.`,
      });
    }
  };

  // 파일 제거
  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  // 드래그 앤 드롭 처리
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
    handleFileUpload(e.dataTransfer.files);
  };

  // QR 스캔 시뮬레이션
  const handleQRScan = () => {
    toast({
      title: 'QR 스캔',
      description:
        'QR 스캔 기능이 준비 중입니다. 실제로는 카메라로 QR 코드를 스캔합니다.',
    });

    // 시뮬레이션: 스탬프 데이터 추가
    const stampData = {
      id: `stamp-${Date.now()}`,
      location: '포항 영일대 해수욕장',
      timestamp: new Date().toISOString(),
    };

    setTitle('포항 영일대 해수욕장 스탬프');
    setContent('QR 코드 스캔으로 획득한 스탬프입니다.');
    setLocation('포항 영일대 해수욕장');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const getTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'stamp':
        return <Stamp className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'location':
        return <MapPin className="h-4 w-4" />;
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
      case 'text':
        return '텍스트나 이야기를 추가합니다';
      case 'location':
        return '위치 정보를 추가합니다';
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
                <SelectItem value="text">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon('text')}
                    <span>텍스트</span>
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

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              날짜 (선택사항)
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              태그 (선택사항)
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="태그를 입력하고 Enter를 누르세요"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || isSubmitting}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={`tag-${tag}-${Math.random()}`}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                      disabled={isSubmitting}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 파일 업로드 섹션 */}
          {(type === 'image' || type === 'video') && (
            <div className="space-y-2">
              <Label>파일 업로드</Label>
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
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  파일을 드래그하여 놓거나 클릭하여 선택하세요
                </p>
                <input
                  type="file"
                  multiple={type === 'image'}
                  accept={type === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  파일 선택
                </label>
              </div>

              {/* 업로드된 파일 미리보기 */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={`preview-${url}-${index}`} className="relative">
                      {type === 'image' ? (
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={url}
                          className="w-full h-24 object-cover rounded-lg"
                          controls
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 스탬프 QR 스캔 버튼 */}
          {type === 'stamp' && (
            <div className="space-y-2">
              <Label>스탬프 수집</Label>
              <Button
                type="button"
                variant="outline"
                onClick={handleQRScan}
                className="w-full"
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR 코드 스캔
              </Button>
            </div>
          )}

          {/* 타입별 추가 안내 */}
          {type === 'image' && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <ImageIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    이미지 추가 방법
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    • 파일 업로드 후 자동으로 추가됩니다
                    <br />
                    • JPG, PNG, GIF 형식을 지원합니다
                    <br />• 최대 10MB까지 업로드 가능합니다
                  </p>
                </div>
              </div>
            </div>
          )}

          {type === 'video' && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start space-x-2">
                <Video className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-700 font-medium">
                    비디오 추가 방법
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    • 파일 업로드 후 자동으로 추가됩니다
                    <br />
                    • MP4, MOV, AVI 형식을 지원합니다
                    <br />• 최대 100MB까지 업로드 가능합니다
                  </p>
                </div>
              </div>
            </div>
          )}

          {type === 'stamp' && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-2">
                <Stamp className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-700 font-medium">
                    스탬프 추가 방법
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    • QR 코드 스캔으로 자동 추가됩니다
                    <br />
                    • 포항 관광지의 QR 스탬프를 스캔하세요
                    <br />• 스탬프 수집 시 특별한 보상이 있습니다
                  </p>
                </div>
              </div>
            </div>
          )}

          {type === 'text' && (
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-2">
                <FileText className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-purple-700 font-medium">
                    스토리 추가 방법
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    • 텍스트 기반 스토리를 직접 작성합니다
                    <br />
                    • 여행 경험과 감상을 자유롭게 기록하세요
                    <br />• 마크다운 형식을 지원합니다
                  </p>
                </div>
              </div>
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
