'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Edit,
  Save,
  X,
  Tag,
  MapPin,
  Camera,
  Calendar,
  Clock,
  Image as ImageIcon,
  Video,
  Music,
} from 'lucide-react';
import { MediaFile, updateMediaFile } from '@/features/media/api';
import { toast } from '@/hooks/use-toast';

interface MetadataEditorProps {
  file: MediaFile;
  onUpdate: (updatedFile: MediaFile) => void;
}

export function MetadataEditor({ file, onUpdate }: MetadataEditorProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    file_name: file.file_name,
    tags: file.tags || [],
    location_data: file.location_data || null,
    metadata: file.metadata || {},
    is_public: file.is_public,
  });
  const [newTag, setNewTag] = useState('');
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    setFormData({
      file_name: file.file_name,
      tags: file.tags || [],
      location_data: file.location_data || null,
      metadata: file.metadata || {},
      is_public: file.is_public,
    });
  }, [file]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const { data, error } = await updateMediaFile(file.id, {
        file_name: formData.file_name,
        tags: formData.tags,
        location_data: formData.location_data,
        metadata: formData.metadata,
        is_public: formData.is_public,
      });

      if (error) throw error;

      onUpdate({ ...file, ...data });
      setOpen(false);

      toast({
        title: '메타데이터 업데이트 완료',
        description: '파일 정보가 성공적으로 업데이트되었습니다.',
      });
    } catch (error) {
      console.error('메타데이터 업데이트 오류:', error);
      toast({
        title: '업데이트 실패',
        description: '메타데이터 업데이트 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setFormData((prev) => ({
        ...prev,
        location_data: {
          lat: 0, // 실제로는 GPS 좌표를 가져와야 함
          lng: 0,
          location_name: newLocation.trim(),
        },
      }));
      setNewLocation('');
    }
  };

  const handleRemoveLocation = () => {
    setFormData((prev) => ({
      ...prev,
      location_data: null,
    }));
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          편집
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getFileIcon(file.file_type)}
            <span>메타데이터 편집</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 파일 기본 정보 */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">기본 정보</h3>

            <div>
              <Label htmlFor="file_name">파일명</Label>
              <Input
                id="file_name"
                value={formData.file_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    file_name: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_public: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <Label htmlFor="is_public">공개 파일</Label>
            </div>
          </div>

          {/* 태그 관리 */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">태그</h3>

            {/* 기존 태그 */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="default"
                    className="flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* 새 태그 추가 */}
            <div className="flex gap-2">
              <Input
                placeholder="새 태그 입력"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                추가
              </Button>
            </div>
          </div>

          {/* 위치 정보 */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">위치 정보</h3>

            {formData.location_data ? (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span>{formData.location_data.location_name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRemoveLocation}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="위치명 입력"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
                />
                <Button
                  onClick={handleAddLocation}
                  disabled={!newLocation.trim()}
                >
                  추가
                </Button>
              </div>
            )}
          </div>

          {/* 메타데이터 */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">메타데이터</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="camera">카메라</Label>
                <Input
                  id="camera"
                  placeholder="촬영 기기"
                  value={formData.metadata.camera || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metadata: { ...prev.metadata, camera: e.target.value },
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="iso">ISO</Label>
                <Input
                  id="iso"
                  type="number"
                  placeholder="ISO 값"
                  value={formData.metadata.iso || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        iso: parseInt(e.target.value) || undefined,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="aperture">조리개</Label>
                <Input
                  id="aperture"
                  placeholder="f/2.8"
                  value={formData.metadata.aperture || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metadata: { ...prev.metadata, aperture: e.target.value },
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="shutter_speed">셔터 속도</Label>
                <Input
                  id="shutter_speed"
                  placeholder="1/125"
                  value={formData.metadata.shutter_speed || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        shutter_speed: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* 파일 정보 (읽기 전용) */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">파일 정보</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>
                  생성일:{' '}
                  {new Date(file.created_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>
                  수정일:{' '}
                  {new Date(file.updated_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Camera className="h-4 w-4 text-gray-500" />
                <span>
                  크기: {(file.file_size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {getFileIcon(file.file_type)}
                <span>타입: {file.file_type}</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
