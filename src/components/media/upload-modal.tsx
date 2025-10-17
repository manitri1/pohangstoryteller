'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Music,
  MapPin,
  Calendar,
  Tag,
  Camera,
  FileText,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  createMediaFile,
  uploadFile,
  CreateMediaFileData,
} from '@/features/media/api';

interface UploadModalProps {
  onUploadComplete?: () => void;
}

export function UploadModal({ onUploadComplete }: UploadModalProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string }>(
    {}
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [formData, setFormData] = useState({
    tags: '',
    location: '',
    description: '',
    is_public: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).filter((file) => {
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/mov',
        'audio/mp3',
        'audio/wav',
      ];
      return validTypes.includes(file.type);
    });

    if (newFiles.length !== selectedFiles.length) {
      toast({
        title: '지원하지 않는 파일 형식',
        description: 'JPG, PNG, GIF, MP4, MOV, MP3, WAV 형식만 지원됩니다.',
        variant: 'destructive',
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);

    // 파일 미리보기 생성
    newFiles.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      setFilePreviews((prev) => ({
        ...prev,
        [file.name]: previewUrl,
      }));
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove && filePreviews[fileToRemove.name]) {
      URL.revokeObjectURL(filePreviews[fileToRemove.name]);
      setFilePreviews((prev) => {
        const newPreviews = { ...prev };
        delete newPreviews[fileToRemove.name];
        return newPreviews;
      });
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/'))
      return <ImageIcon className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (file.type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (file: File): 'image' | 'video' | 'audio' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'image'; // 기본값
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: '파일을 선택해주세요',
        description: '업로드할 파일을 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `uploads/${Date.now()}-${file.name}`;

        // 파일을 Base64로 변환
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

        const base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        setUploadProgress((prev) => ({ ...prev, [file.name]: 50 }));

        // 미디어 파일 정보 저장 (Base64 데이터 포함)
        const mediaData: CreateMediaFileData = {
          file_name: file.name,
          file_type: getFileType(file),
          file_size: file.size,
          file_path: filePath,
          mime_type: file.type,
          storage_url: base64Data, // 실제 파일의 Base64 데이터 저장
          tags: [
            ...tags,
            new Date().getFullYear().toString(),
            `${new Date().getMonth() + 1}월`,
          ],
          metadata: {
            camera: 'Unknown',
          },
          is_public: formData.is_public,
        };

        // 위치 정보가 있으면 추가
        if (formData.location) {
          mediaData.location_data = {
            lat: 0, // 실제로는 GPS 좌표를 가져와야 함
            lng: 0,
            location_name: formData.location,
          };
        }

        const { error: createError } = await createMediaFile(mediaData);
        if (createError) throw createError;

        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
      }

      toast({
        title: '업로드 완료',
        description: `${files.length}개의 파일이 성공적으로 업로드되었습니다.`,
      });

      // 폼 초기화
      setFiles([]);
      // 미리보기 URL 정리
      Object.values(filePreviews).forEach((url) => URL.revokeObjectURL(url));
      setFilePreviews({});
      setFormData({
        tags: '',
        location: '',
        description: '',
        is_public: false,
      });
      setUploadProgress({});
      setOpen(false);

      // 콜백 실행
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('파일 업로드 오류:', error);

      // 모든 데이터베이스 및 Storage 관련 오류인 경우 특별한 메시지 표시
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorCode = (error as any)?.code;

      if (
        errorMessage?.includes('Bucket not found') ||
        errorMessage?.includes('row-level security policy') ||
        errorMessage?.includes('RLS') ||
        errorCode === '42501' ||
        errorCode === '57014' ||
        errorMessage?.includes('statement timeout') ||
        errorMessage?.includes('Internal Server Error')
      ) {
        toast({
          title: '개발 환경 설정 오류',
          description:
            'Supabase Storage 버킷 및 RLS 정책을 설정해주세요. 개발 환경에서는 더미 데이터가 표시됩니다.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '업로드 실패',
          description: '파일 업로드 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          파일 업로드
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>미디어 파일 업로드</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 파일 선택 영역 */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              파일을 드래그하거나 클릭하여 선택
            </p>
            <p className="text-sm text-gray-500 mb-4">
              JPG, PNG, GIF, MP4, MOV, MP3, WAV 형식 지원
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              파일 선택
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* 선택된 파일 목록 */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">선택된 파일 ({files.length}개)</h3>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      {/* 이미지 미리보기 */}
                      {file.type.startsWith('image/') &&
                      filePreviews[file.name] ? (
                        <img
                          src={filePreviews[file.name]}
                          alt={file.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      ) : (
                        getFileIcon(file)
                      )}
                      <span className="text-sm font-medium truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadProgress[file.name] !== undefined && (
                        <div className="flex items-center space-x-1">
                          {uploadProgress[file.name] === 100 ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 업로드 옵션 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tags">태그</Label>
                <Input
                  id="tags"
                  placeholder="태그를 쉼표로 구분하여 입력"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="location">위치</Label>
                <Input
                  id="location"
                  placeholder="촬영 위치"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="파일에 대한 설명을 입력하세요"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
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
              <Label htmlFor="is_public">공개 파일로 설정</Label>
            </div>
          </div>

          {/* 업로드 버튼 */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              취소
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  업로드
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
