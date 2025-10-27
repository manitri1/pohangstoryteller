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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import SouvenirTemplateCard from '@/components/souvenirs/SouvenirTemplateCard';
import SouvenirEditor from '@/components/souvenirs/SouvenirEditor';
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
    | '엽서'
    | '머그컵'
    | '마그넷'
    | '포스터';
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
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // 템플릿 데이터 로드
  useEffect(() => {
    loadTemplates();
  }, []);

  // showEditor 상태 변화 감지
  useEffect(() => {
    // 상태 변화 감지
  }, [showEditor]);

  // selectedTemplate 상태 변화 감지
  useEffect(() => {
    // 선택된 템플릿 상태 변화 감지
  }, [selectedTemplate]);

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

      // 샘플 템플릿 데이터
      const sampleTemplates: SouvenirTemplate[] = [
        {
          id: '1',
          name: '포항4컷 기본',
          description: '포항 여행의 추억을 4컷으로 담아보세요',
          templateType: '포항4컷',
          category: 'general',
          basePrice: 5000,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: '10x15cm', pages: 1 },
        },
        {
          id: '2',
          name: '포항4컷 해변',
          description: '바다 풍경이 돋보이는 4컷 템플릿',
          templateType: '포항4컷',
          category: 'nature',
          basePrice: 5500,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: '10x15cm', pages: 1 },
        },
        {
          id: '3',
          name: '롤링페이퍼 클래식',
          description: '전통적인 스타일의 롤링페이퍼',
          templateType: '롤링페이퍼',
          category: 'culture',
          basePrice: 8000,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: 'A4', pages: 1 },
        },
        {
          id: '4',
          name: '롤링페이퍼 모던',
          description: '현대적인 디자인의 롤링페이퍼',
          templateType: '롤링페이퍼',
          category: 'general',
          basePrice: 8500,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: 'A4', pages: 1 },
        },
        {
          id: '5',
          name: '포토북 미니',
          description: '소형 포토북으로 여행 추억을 담아보세요',
          templateType: '포토북',
          category: 'general',
          basePrice: 15000,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: 'A5', pages: 20 },
        },
        {
          id: '6',
          name: '포토북 라지',
          description: '대형 포토북으로 더 많은 추억을 담아보세요',
          templateType: '포토북',
          category: 'general',
          basePrice: 25000,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: 'A4', pages: 30 },
        },
        {
          id: '7',
          name: '스티커 세트',
          description: '포항 명소 스티커 세트',
          templateType: '스티커',
          category: 'general',
          basePrice: 3000,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: '5x5cm', pages: 1 },
        },
        {
          id: '8',
          name: '키링 세트',
          description: '포항 기념 키링 세트',
          templateType: '키링',
          category: 'general',
          basePrice: 4000,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: '3x3cm', pages: 1 },
        },
        {
          id: '9',
          name: '엽서 세트',
          description: '포항 명소 엽서 세트',
          templateType: '엽서',
          category: 'nature',
          basePrice: 6000,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: '10x15cm', pages: 5 },
        },
        {
          id: '10',
          name: '머그컵 클래식',
          description: '포항 사진이 인쇄된 머그컵',
          templateType: '머그컵',
          category: 'general',
          basePrice: 12000,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: '350ml', pages: 1 },
        },
        {
          id: '11',
          name: '마그넷 세트',
          description: '냉장고용 포항 기념 마그넷',
          templateType: '마그넷',
          category: 'general',
          basePrice: 5000,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: '5x5cm', pages: 3 },
        },
        {
          id: '12',
          name: '포스터 A3',
          description: '포항 풍경 포스터 (A3 사이즈)',
          templateType: '포스터',
          category: 'nature',
          basePrice: 18000,
          projectCount: 0,
          orderCount: 0,
          averageRating: 0,
          reviewCount: 0,
          templateConfig: { size: 'A3', pages: 1 },
        },
      ];

      setTemplates(sampleTemplates);
      setStats({
        totalTemplates: sampleTemplates.length,
        totalProjects: 0,
        totalOrders: 0,
        totalRevenue: 0,
      });
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
    console.log('템플릿 선택됨:', template);
    console.log('현재 showEditor 상태:', showEditor);
    console.log('현재 selectedTemplate:', selectedTemplate);

    setSelectedTemplate(template);
    setShowEditor(true);

    console.log('상태 업데이트 요청 완료');

    // 상태 업데이트 확인을 위한 타이머
    setTimeout(() => {
      console.log('상태 업데이트 후 showEditor:', showEditor);
      console.log('상태 업데이트 후 selectedTemplate:', selectedTemplate);
    }, 100);
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

  // 템플릿 선택 모달에서 템플릿 선택
  const handleTemplateSelectFromModal = (template: SouvenirTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
    setShowEditor(true);
  };

  // 프로젝트 저장
  const handleProjectSave = (projectData: any) => {
    console.log('프로젝트 저장:', projectData);
    // 여기서 실제 프로젝트 저장 로직을 구현
    toast({
      title: '프로젝트 저장 완료',
      description: '기념품 프로젝트가 저장되었습니다.',
    });
    // 편집기 닫기
    handleEditorClose();
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

  // 편집기 표시
  // 렌더링 상태 확인

  if (showEditor && selectedTemplate) {
    // SouvenirEditor 렌더링 조건 만족
    return (
      <SouvenirEditor
        template={selectedTemplate}
        onBack={() => {
          console.log('뒤로가기 클릭');
          setShowEditor(false);
          setSelectedTemplate(null);
        }}
        onSave={handleProjectSave}
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
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              setShowTemplateSelector(true);
            }}
          >
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
            <Button
              onClick={() => {
                console.log('첫 템플릿 만들기');
                toast({
                  title: '템플릿 생성',
                  description: '새로운 템플릿을 생성합니다.',
                });
              }}
            >
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

      {/* 템플릿 선택 모달 */}
      <Dialog
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>템플릿 선택</DialogTitle>
            <DialogDescription>
              새 프로젝트에 사용할 템플릿을 선택하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTemplateSelectFromModal(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{template.templateType}</Badge>
                    <span className="text-sm font-medium">
                      ₩{template.basePrice.toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>크기: {template.templateConfig.size}</span>
                    <span>페이지: {template.templateConfig.pages}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
