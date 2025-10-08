'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SouvenirTemplateCard from '@/components/souvenirs/SouvenirTemplateCard';
import PhotoEditor from '@/components/souvenirs/PhotoEditor';
import {
  Palette,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Eye,
  Heart,
  Scissors,
  BookOpen,
  Sticker,
  Key,
  Mail,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SouvenirTemplate {
  id: string;
  name: string;
  description: string;
  templateType:
    | '포항4컷'
    | '롤링페이퍼'
    | '포토북'
    | '스티커'
    | '키링'
    | '엽서';
  category: 'nature' | 'history' | 'food' | 'culture' | 'general';
  previewImageUrl?: string;
  basePrice: number;
  projectCount: number;
  orderCount: number;
  averageRating: number;
  reviewCount: number;
  templateConfig: any;
}

interface SouvenirStats {
  totalTemplates: number;
  totalProjects: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function SouvenirsPage() {
  const [templates, setTemplates] = useState<SouvenirTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<
    SouvenirTemplate[]
  >([]);
  const [stats, setStats] = useState<SouvenirStats>({
    totalTemplates: 0,
    totalProjects: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<SouvenirTemplate | null>(null);

  // 템플릿 데이터 로드
  useEffect(() => {
    loadTemplates();
  }, []);

  // 필터링 및 정렬
  useEffect(() => {
    let filtered = [...templates];

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 타입 필터
    if (typeFilter !== 'all') {
      filtered = filtered.filter(
        (template) => template.templateType === typeFilter
      );
    }

    // 카테고리 필터
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (template) => template.category === categoryFilter
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.projectCount - a.projectCount;
        case 'price_low':
          return a.basePrice - b.basePrice;
        case 'price_high':
          return b.basePrice - a.basePrice;
        case 'rating':
          return b.averageRating - a.averageRating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredTemplates(filtered);
  }, [templates, searchTerm, typeFilter, categoryFilter, sortBy]);

  // 템플릿 데이터 로드
  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/souvenirs/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
        setStats(
          data.stats || {
            totalTemplates: 0,
            totalProjects: 0,
            totalOrders: 0,
            totalRevenue: 0,
          }
        );
      }
    } catch (error) {
      console.error('템플릿 데이터 로드 실패:', error);
      toast({
        title: '오류',
        description: '템플릿 데이터를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 템플릿 선택
  const handleTemplateSelect = (template: SouvenirTemplate) => {
    setSelectedTemplate(template);
    setShowEditor(true);
  };

  // 템플릿 미리보기
  const handleTemplatePreview = (template: SouvenirTemplate) => {
    console.log('템플릿 미리보기:', template);
    // 미리보기 모달 표시
  };

  // 템플릿 좋아요
  const handleTemplateLike = (template: SouvenirTemplate) => {
    console.log('템플릿 좋아요:', template);
    // 좋아요 API 호출
  };

  // 에디터 닫기
  const handleEditorClose = () => {
    setShowEditor(false);
    setSelectedTemplate(null);
  };

  // 프로젝트 저장
  const handleProjectSave = (projectData: any) => {
    console.log('프로젝트 저장:', projectData);
    // 프로젝트 저장 API 호출
    toast({
      title: '저장 완료',
      description: '프로젝트가 성공적으로 저장되었습니다.',
    });
    handleEditorClose();
  };

  const getTemplateTypeIcon = (type: string) => {
    switch (type) {
      case '포항4컷':
        return <Scissors className="h-5 w-5" />;
      case '롤링페이퍼':
        return <BookOpen className="h-5 w-5" />;
      case '포토북':
        return <BookOpen className="h-5 w-5" />;
      case '스티커':
        return <Sticker className="h-5 w-5" />;
      case '키링':
        return <Key className="h-5 w-5" />;
      case '엽서':
        return <Mail className="h-5 w-5" />;
      default:
        return <Palette className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (showEditor && selectedTemplate) {
    return (
      <PhotoEditor
        template={selectedTemplate}
        onSave={handleProjectSave}
        onClose={handleEditorClose}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              DIY 기념품 제작
            </h1>
            <p className="text-gray-600 mt-1">
              포항 여행의 소중한 순간들을 특별한 기념품으로 만들어보세요
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />새 프로젝트
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalTemplates}
              </div>
              <div className="text-sm text-gray-600">총 템플릿</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalProjects}
              </div>
              <div className="text-sm text-gray-600">총 프로젝트</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalOrders}
              </div>
              <div className="text-sm text-gray-600">총 주문</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalRevenue.toLocaleString()}원
              </div>
              <div className="text-sm text-gray-600">총 매출</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="템플릿 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="타입 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="포항4컷">포항4컷</SelectItem>
              <SelectItem value="롤링페이퍼">롤링페이퍼</SelectItem>
              <SelectItem value="포토북">포토북</SelectItem>
              <SelectItem value="스티커">스티커</SelectItem>
              <SelectItem value="키링">키링</SelectItem>
              <SelectItem value="엽서">엽서</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="카테고리 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="nature">자연</SelectItem>
              <SelectItem value="history">역사</SelectItem>
              <SelectItem value="food">맛집</SelectItem>
              <SelectItem value="culture">문화</SelectItem>
              <SelectItem value="general">일반</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">인기순</SelectItem>
              <SelectItem value="price_low">가격 낮은순</SelectItem>
              <SelectItem value="price_high">가격 높은순</SelectItem>
              <SelectItem value="rating">평점순</SelectItem>
              <SelectItem value="name">이름순</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 템플릿 목록 */}
      {filteredTemplates.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              아직 템플릿이 없습니다
            </h3>
            <p className="text-gray-600 mb-4">
              새로운 템플릿을 추가하거나 다른 필터를 시도해보세요!
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />첫 템플릿 만들기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredTemplates.map((template) => (
            <SouvenirTemplateCard
              key={template.id}
              template={template}
              onSelect={handleTemplateSelect}
              onPreview={handleTemplatePreview}
              onLike={handleTemplateLike}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
