'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Edit,
  Share,
  Plus,
  Grid3X3,
  Clock,
  MapPin,
  Image as ImageIcon,
  Video,
  FileText,
  MapPin as LocationIcon,
  Lock,
  Globe,
  MoreHorizontal,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { AddItemModal } from '@/components/albums/add-item-modal';
import {
  getAlbum,
  getAlbumItems,
  updateAlbum,
  deleteAlbum,
  reorderAlbumItems,
  deleteAlbumItem,
  Album,
  AlbumItem,
} from '@/features/albums/api';
import { toast } from '@/hooks/use-toast';
import FeatureAccess from '@/components/auth/feature-access';

export default function AlbumDetailPage() {
  return (
    <FeatureAccess
      featureName="나의 앨범"
      description="여행의 추억을 담은 앨범을 관리하세요."
      requireAuth={true}
    >
      <AlbumDetailContent />
    </FeatureAccess>
  );
}

function AlbumDetailContent() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;

  const [album, setAlbum] = useState<Album | null>(null);
  const [items, setItems] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    is_public: false,
    template_type: 'grid' as 'grid' | 'timeline' | 'travel',
  });
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    if (albumId) {
      loadAlbum();
      loadItems();
    }
  }, [albumId]);

  const loadAlbum = async () => {
    try {
      const { data, error } = await getAlbum(albumId);
      if (error) throw error;

      setAlbum(data);
      setEditData({
        title: data.title,
        description: data.description || '',
        is_public: data.is_public,
        template_type: data.template_type || 'grid',
      });
    } catch (error) {
      console.error('앨범 로드 오류:', error);
      toast({
        title: '앨범 로드 실패',
        description: '앨범을 불러오는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const loadItems = async () => {
    try {
      const { data, error } = await getAlbumItems(albumId);
      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      console.error('앨범 아이템 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { data, error } = await updateAlbum(albumId, editData);
      if (error) throw error;

      setAlbum(data);
      setIsEditing(false);
      toast({
        title: '앨범 수정 완료',
        description: '앨범 정보가 성공적으로 수정되었습니다.',
      });
    } catch (error) {
      console.error('앨범 수정 오류:', error);
      toast({
        title: '앨범 수정 실패',
        description: '앨범 수정 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditData({
      title: album?.title || '',
      description: album?.description || '',
      is_public: album?.is_public || false,
      template_type: album?.template_type || 'grid',
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 앨범을 삭제하시겠습니까?')) return;

    try {
      const { error } = await deleteAlbum(albumId);
      if (error) throw error;

      toast({
        title: '앨범 삭제 완료',
        description: '앨범이 성공적으로 삭제되었습니다.',
      });

      router.push('/albums');
    } catch (error) {
      console.error('앨범 삭제 오류:', error);
      toast({
        title: '앨범 삭제 실패',
        description: '앨범 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleItemAdded = (newItem: AlbumItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  // 드래그 앤 드롭 핸들러들
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetItemId) {
      setDraggedItem(null);
      return;
    }

    try {
      // 현재 아이템들의 순서를 가져옴
      const currentItems = [...items];
      const draggedIndex = currentItems.findIndex(
        (item) => item.id === draggedItem
      );
      const targetIndex = currentItems.findIndex(
        (item) => item.id === targetItemId
      );

      if (draggedIndex === -1 || targetIndex === -1) return;

      // 아이템 순서 변경
      const [draggedItemData] = currentItems.splice(draggedIndex, 1);
      currentItems.splice(targetIndex, 0, draggedItemData);

      // 새로운 position 값으로 업데이트
      const itemOrders = currentItems.map((item, index) => ({
        id: item.id,
        position: index,
      }));

      // API 호출
      const { error } = await reorderAlbumItems(albumId, itemOrders);
      if (error) throw error;

      // 로컬 상태 업데이트
      setItems(currentItems);

      toast({
        title: '순서 변경 완료',
        description: '아이템 순서가 성공적으로 변경되었습니다.',
      });
    } catch (error) {
      console.error('아이템 순서 변경 오류:', error);
      toast({
        title: '순서 변경 실패',
        description: '아이템 순서 변경 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setDraggedItem(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // 아이템 편집
  const handleEditItem = (item: AlbumItem) => {
    // TODO: 아이템 편집 모달 구현
    console.log('아이템 편집:', item);
    toast({
      title: '아이템 편집',
      description: '아이템 편집 기능은 준비 중입니다.',
    });
  };

  // 아이템 삭제
  const handleDeleteItem = async (item: AlbumItem) => {
    if (!confirm(`"${item.content || '아이템'}"을(를) 삭제하시겠습니까?`))
      return;

    try {
      const { error } = await deleteAlbumItem(item.id);
      if (error) throw error;

      setItems((prev) => prev.filter((i) => i.id !== item.id));

      toast({
        title: '아이템 삭제 완료',
        description: '아이템이 성공적으로 삭제되었습니다.',
      });
    } catch (error) {
      console.error('아이템 삭제 오류:', error);
      toast({
        title: '아이템 삭제 실패',
        description: '아이템 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'grid':
        return <Grid3X3 className="h-4 w-4" />;
      case 'timeline':
        return <Clock className="h-4 w-4" />;
      case 'travel':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Grid3X3 className="h-4 w-4" />;
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'location':
        return <LocationIcon className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            앨범을 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            요청하신 앨범이 존재하지 않거나 삭제되었습니다.
          </p>
          <Button onClick={() => router.push('/albums')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            앨범 목록으로
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={() => router.push('/albums')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            앨범 목록
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">앨범 제목</Label>
                  <Input
                    id="title"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">앨범 설명</Label>
                  <Textarea
                    id="description"
                    value={editData.description}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template_type">템플릿</Label>
                    <Select
                      value={editData.template_type}
                      onValueChange={(value: 'grid' | 'timeline' | 'travel') =>
                        setEditData((prev) => ({
                          ...prev,
                          template_type: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">
                          <div className="flex items-center space-x-2">
                            {getTemplateIcon('grid')}
                            <span>그리드</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="timeline">
                          <div className="flex items-center space-x-2">
                            {getTemplateIcon('timeline')}
                            <span>타임라인</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="travel">
                          <div className="flex items-center space-x-2">
                            {getTemplateIcon('travel')}
                            <span>여행</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_public"
                        checked={editData.is_public}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            is_public: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      <Label htmlFor="is_public">공개 앨범</Label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    저장
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    취소
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {album.title}
                </h1>
                {album.description && (
                  <p className="text-gray-600 mb-4">{album.description}</p>
                )}
                <div className="flex items-center gap-4">
                  <Badge variant="outline">
                    {getTemplateIcon(album.template_type)}
                    <span className="ml-1 capitalize">
                      {album.template_type}
                    </span>
                  </Badge>
                  <Badge variant={album.is_public ? 'default' : 'secondary'}>
                    {album.is_public ? (
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
                  <span className="text-sm text-gray-500">
                    {items.length}개 아이템
                  </span>
                </div>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleEdit} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                편집
              </Button>
              <Button onClick={() => setShowAddItem(true)}>
                <Plus className="h-4 w-4 mr-2" />
                아이템 추가
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                공유
              </Button>
              <Button variant="outline" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 앨범 아이템 */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            아직 아이템이 없습니다
          </h3>
          <p className="text-gray-600 mb-4">첫 번째 아이템을 추가해보세요!</p>
          <Button onClick={() => setShowAddItem(true)}>
            <Plus className="h-4 w-4 mr-2" />
            아이템 추가
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              className={`group overflow-hidden hover:shadow-lg transition-shadow cursor-move ${
                draggedItem === item.id ? 'opacity-50' : ''
              }`}
            >
              <div className="aspect-video bg-gray-100 relative">
                {item.media_url ? (
                  <Image
                    src={item.media_url}
                    alt={item.content || '앨범 아이템'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getItemIcon(item.item_type)}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getItemIcon(item.item_type)}
                    <Badge variant="outline" className="text-xs">
                      {item.item_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditItem(item)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteItem(item)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {item.content && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.content}
                  </p>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(item.created_at).toLocaleDateString('ko-KR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 아이템 추가 모달 */}
      <AddItemModal
        isOpen={showAddItem}
        onClose={() => setShowAddItem(false)}
        onAddItem={handleItemAdded}
        albumId={albumId}
      />
    </div>
  );
}
