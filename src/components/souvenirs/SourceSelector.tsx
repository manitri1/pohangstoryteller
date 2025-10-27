'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ImageIcon,
  Upload,
  QrCode,
  Album,
  Folder,
  Check,
  X,
  Search,
  Filter,
} from 'lucide-react';
import Image from 'next/image';

interface SourceItem {
  id: string;
  type: 'image' | 'video' | 'stamp';
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
}

interface SourceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (items: SourceItem[]) => void;
  sourceType: 'album' | 'media' | 'stamps' | 'upload';
}

export default function SourceSelector({
  isOpen,
  onClose,
  onSelect,
  sourceType,
}: SourceSelectorProps) {
  const [selectedItems, setSelectedItems] = useState<SourceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [items, setItems] = useState<SourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 소스 타입별 데이터 로드
  useEffect(() => {
    if (isOpen) {
      loadSourceData();
    }
  }, [isOpen, sourceType]);

  const loadSourceData = async () => {
    setIsLoading(true);
    try {
      // 실제로는 API에서 데이터를 가져옴
      const sampleData: SourceItem[] = getSampleData(sourceType);
      setItems(sampleData);
    } catch (error) {
      console.error('소스 데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleData = (type: string): SourceItem[] => {
    switch (type) {
      case 'album':
        return [
          {
            id: '1',
            type: 'image',
            title: '포항 바다 사진',
            description: '영일대 해수욕장에서 촬영',
            url: 'https://picsum.photos/400/300?random=1',
            thumbnail: 'https://picsum.photos/200/150?random=1',
            category: 'nature',
            tags: ['바다', '해수욕장', '포항'],
            createdAt: '2024-01-15',
          },
          {
            id: '2',
            type: 'image',
            title: '포항 시내',
            description: '포항 시내 중심가',
            url: 'https://picsum.photos/400/300?random=2',
            thumbnail: 'https://picsum.photos/200/150?random=2',
            category: 'city',
            tags: ['시내', '도시', '포항'],
            createdAt: '2024-01-14',
          },
        ];
      case 'media':
        return [
          {
            id: '3',
            type: 'image',
            title: '여행 사진 1',
            description: '포항 여행 중 촬영한 사진',
            url: 'https://picsum.photos/400/300?random=3',
            thumbnail: 'https://picsum.photos/200/150?random=3',
            category: 'travel',
            tags: ['여행', '포항'],
            createdAt: '2024-01-13',
          },
          {
            id: '4',
            type: 'image',
            title: '맛집 사진',
            description: '포항 맛집에서 촬영',
            url: 'https://picsum.photos/400/300?random=4',
            thumbnail: 'https://picsum.photos/200/150?random=4',
            category: 'food',
            tags: ['맛집', '음식', '포항'],
            createdAt: '2024-01-12',
          },
        ];
      case 'stamps':
        return [
          {
            id: '5',
            type: 'stamp',
            title: '포항 스탬프 1',
            description: 'QR 스탬프 디자인',
            url: 'https://picsum.photos/400/300?random=5',
            thumbnail: 'https://picsum.photos/200/150?random=5',
            category: 'stamp',
            tags: ['스탬프', 'QR', '포항'],
            createdAt: '2024-01-11',
          },
          {
            id: '6',
            type: 'stamp',
            title: '포항 스탬프 2',
            description: 'QR 스탬프 디자인',
            url: 'https://picsum.photos/400/300?random=6',
            thumbnail: 'https://picsum.photos/200/150?random=6',
            category: 'stamp',
            tags: ['스탬프', 'QR', '포항'],
            createdAt: '2024-01-10',
          },
        ];
      case 'upload':
        return [];
      default:
        return [];
    }
  };

  const handleItemSelect = (item: SourceItem) => {
    const isSelected = selectedItems.some(
      (selected) => selected.id === item.id
    );
    if (isSelected) {
      setSelectedItems(
        selectedItems.filter((selected) => selected.id !== item.id)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedItems);
    onClose();
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getSourceTitle = () => {
    switch (sourceType) {
      case 'album':
        return '나의 앨범';
      case 'media':
        return '미디어 관리';
      case 'stamps':
        return '스탬프 활용';
      case 'upload':
        return '새로 업로드';
      default:
        return '소스 선택';
    }
  };

  const getSourceIcon = () => {
    switch (sourceType) {
      case 'album':
        return <Album className="h-5 w-5" />;
      case 'media':
        return <Folder className="h-5 w-5" />;
      case 'stamps':
        return <QrCode className="h-5 w-5" />;
      case 'upload':
        return <Upload className="h-5 w-5" />;
      default:
        return <ImageIcon className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getSourceIcon()}
            {getSourceTitle()}
          </DialogTitle>
          <DialogDescription>
            기념품에 사용할 {getSourceTitle().toLowerCase()}를 선택하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 검색 및 필터 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="nature">자연</SelectItem>
                <SelectItem value="city">도시</SelectItem>
                <SelectItem value="food">음식</SelectItem>
                <SelectItem value="travel">여행</SelectItem>
                <SelectItem value="stamp">스탬프</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 선택된 항목 표시 */}
          {selectedItems.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedItems.length}개 항목 선택됨
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* 항목 목록 */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">로딩 중...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">선택 가능한 항목이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const isSelected = selectedItems.some(
                    (selected) => selected.id === item.id
                  );
                  return (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleItemSelect(item)}
                    >
                      <CardContent className="p-4">
                        <div className="relative">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                            <Image
                              src={item.thumbnail || item.url}
                              alt={item.title}
                              width={200}
                              height={150}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm truncate">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {item.tags?.slice(0, 2).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
            >
              선택 완료 ({selectedItems.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
