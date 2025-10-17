'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Save,
  Download,
  Eye,
  Upload,
  Image as ImageIcon,
  Type,
  Palette,
  Layout,
  Filter,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Trash2,
  Plus,
  Package,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { OrderModal } from './OrderModal';
import { getAlbums } from '@/features/albums/api';
import { getMediaFiles } from '@/features/media/api';

interface SouvenirTemplate {
  id: string;
  name: string;
  description: string;
  templateType: string;
  category: string;
  basePrice: number;
  templateConfig: any;
}

interface SouvenirEditorProps {
  template: SouvenirTemplate;
  onBack: () => void;
  onSave: (projectData: any) => void;
}

interface DesignElement {
  id: string;
  type: 'image' | 'text';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  zIndex: number;
  style?: any;
}

export default function SouvenirEditor({
  template,
  onBack,
  onSave,
}: SouvenirEditorProps) {
  const [projectName, setProjectName] = useState('');
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showSourceSelector, setShowSourceSelector] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'source' | 'design' | 'preview'
  >('source');
  const [selectedSources, setSelectedSources] = useState<any[]>([]);
  const [sourceType, setSourceType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<'grid' | 'timeline'>(
    'grid'
  );
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });
  const [layoutTemplates, setLayoutTemplates] = useState([
    {
      id: 'grid-2x2',
      name: '기본 4컷',
      type: 'grid',
      config: { rows: 2, cols: 2 },
      description: '2x2 그리드 레이아웃',
    },
    {
      id: 'grid-1x4',
      name: '가로 4컷',
      type: 'grid',
      config: { rows: 1, cols: 4 },
      description: '가로로 4개 배치',
    },
    {
      id: 'grid-4x1',
      name: '세로 4컷',
      type: 'grid',
      config: { rows: 4, cols: 1 },
      description: '세로로 4개 배치',
    },
    {
      id: 'asymmetric-1',
      name: '비대칭 4컷',
      type: 'asymmetric',
      config: {
        layout: [
          { x: 0, y: 0, width: 0.5, height: 0.5 },
          { x: 0.5, y: 0, width: 0.5, height: 0.5 },
          { x: 0, y: 0.5, width: 0.5, height: 0.5 },
          { x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
        ],
      },
      description: '정사각형 4분할',
    },
    {
      id: 'asymmetric-2',
      name: '큰 사진 + 3컷',
      type: 'asymmetric',
      config: {
        layout: [
          { x: 0, y: 0, width: 0.6, height: 1 },
          { x: 0.6, y: 0, width: 0.4, height: 0.33 },
          { x: 0.6, y: 0.33, width: 0.4, height: 0.33 },
          { x: 0.6, y: 0.66, width: 0.4, height: 0.34 },
        ],
      },
      description: '큰 사진과 작은 3컷',
    },
    {
      id: 'asymmetric-3',
      name: 'L자형 4컷',
      type: 'asymmetric',
      config: {
        layout: [
          { x: 0, y: 0, width: 0.5, height: 0.5 },
          { x: 0.5, y: 0, width: 0.5, height: 1 },
          { x: 0, y: 0.5, width: 0.5, height: 0.25 },
          { x: 0, y: 0.75, width: 0.5, height: 0.25 },
        ],
      },
      description: 'L자형 배치',
    },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState(layoutTemplates[0]);

  // showSourceSelector 상태 변화 감지
  useEffect(() => {
    console.log('showSourceSelector 상태 변화:', showSourceSelector);
  }, [showSourceSelector]);

  console.log('SouvenirEditor 렌더링:', template);
  console.log('SouvenirEditor props:', { template, onBack, onSave });
  console.log('SouvenirEditor template.name:', template?.name);
  console.log('SouvenirEditor template.id:', template?.id);

  // 디자인 소스 선택
  const handleSourceSelect = (sourceType: string, sourceData: any) => {
    console.log('소스 선택:', sourceType, sourceData);
    setSourceType(sourceType);
    setSelectedSources(sourceData);
    setCurrentStep('design');
    setShowSourceSelector(false);

    // 선택된 소스를 자동으로 그리드 레이아웃에 배치
    autoArrangeSourcesInGrid(sourceData);

    toast({
      title: '소스 선택 완료',
      description: `${sourceType}에서 ${sourceData.length}개의 항목을 선택했습니다.`,
    });
  };

  // 소스를 선택된 템플릿에 따라 자동 배치하는 함수
  const autoArrangeSourcesInTemplate = (sources: any[], template: any) => {
    if (sources.length === 0) return;

    const newElements: DesignElement[] = [];

    if (template.type === 'grid') {
      // 그리드 레이아웃
      const { rows, cols } = template.config;
      const cellWidth = canvasSize.width / cols;
      const cellHeight = canvasSize.height / rows;

      sources.slice(0, rows * cols).forEach((source, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        newElements.push({
          id: `element_${Date.now()}_${index}`,
          type: 'image',
          content: source.url,
          position: {
            x: col * cellWidth + (cellWidth - 100) / 2,
            y: row * cellHeight + (cellHeight - 100) / 2,
          },
          size: { width: 100, height: 100 },
          rotation: 0,
          opacity: 1,
          zIndex: index + 1,
          style: {
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        });
      });
    } else if (template.type === 'asymmetric') {
      // 비대칭 레이아웃
      const { layout } = template.config;

      sources.slice(0, layout.length).forEach((source, index) => {
        const layoutItem = layout[index];
        const elementWidth = canvasSize.width * layoutItem.width;
        const elementHeight = canvasSize.height * layoutItem.height;
        const elementX = canvasSize.width * layoutItem.x;
        const elementY = canvasSize.height * layoutItem.y;

        newElements.push({
          id: `element_${Date.now()}_${index}`,
          type: 'image',
          content: source.url,
          position: {
            x:
              elementX +
              (elementWidth - Math.min(elementWidth, elementHeight)) / 2,
            y:
              elementY +
              (elementHeight - Math.min(elementWidth, elementHeight)) / 2,
          },
          size: {
            width: Math.min(elementWidth, elementHeight),
            height: Math.min(elementWidth, elementHeight),
          },
          rotation: 0,
          opacity: 1,
          zIndex: index + 1,
          style: {
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        });
      });
    }

    setElements(newElements);
    console.log('템플릿으로 배치된 요소들:', newElements);
  };

  // 기존 함수 호환성을 위한 래퍼
  const autoArrangeSourcesInGrid = (sources: any[]) => {
    autoArrangeSourcesInTemplate(sources, selectedTemplate);
  };

  // 레이아웃 변경 처리
  const handleLayoutChange = (layout: 'grid' | 'timeline') => {
    console.log('레이아웃 변경:', layout);
    setCurrentLayout(layout);

    if (selectedSources.length > 0) {
      if (layout === 'grid') {
        autoArrangeSourcesInGrid(selectedSources);
      } else if (layout === 'timeline') {
        autoArrangeSourcesInTimeline(selectedSources);
      }
    }
  };

  // 소스를 타임라인 레이아웃에 자동 배치하는 함수
  const autoArrangeSourcesInTimeline = (sources: any[]) => {
    if (sources.length === 0) return;

    const elementWidth = 120;
    const elementHeight = 80;
    const spacing = 20;
    const startX = 20;
    const startY = canvasSize.height / 2 - elementHeight / 2;

    const newElements: DesignElement[] = sources.map((source, index) => {
      return {
        id: `element_${Date.now()}_${index}`,
        type: 'image',
        content: source.url,
        position: {
          x: startX + index * (elementWidth + spacing),
          y: startY,
        },
        size: { width: elementWidth, height: elementHeight },
        rotation: 0,
        opacity: 1,
        zIndex: index + 1,
        style: {
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      };
    });

    setElements(newElements);
    console.log('타임라인 배치된 요소들:', newElements);
  };

  // 나의 앨범 선택
  const handleAlbumSelect = async () => {
    console.log('=== 나의 앨범 선택 버튼 클릭됨 ===');
    console.log('현재 showSourceSelector 상태:', showSourceSelector);

    try {
      // 실제 앨범 데이터 가져오기
      console.log('앨범 데이터 로딩 시작...');
      const albumsResponse = await getAlbums();
      console.log('가져온 앨범 응답:', albumsResponse);

      // 응답에서 데이터 추출
      const albums = albumsResponse?.data || [];
      console.log('앨범 데이터:', albums);

      if (!albums || albums.length === 0) {
        console.log('앨범이 없어서 샘플 데이터 사용');

        // 앨범이 없는 경우 샘플 데이터 사용
        const fallbackData = [
          {
            id: '1',
            url: 'https://picsum.photos/200/150?random=1',
            name: '포항 해안 여행 1',
          },
          {
            id: '2',
            url: 'https://picsum.photos/200/150?random=2',
            name: '포항 해안 여행 2',
          },
          {
            id: '3',
            url: 'https://picsum.photos/200/150?random=3',
            name: '포항 해안 여행 3',
          },
          {
            id: '4',
            url: 'https://picsum.photos/200/150?random=4',
            name: '포항 해안 여행 4',
          },
        ];

        toast({
          title: '앨범 선택 (샘플 데이터)',
          description: '앨범이 없어서 샘플 포항 해안 여행 사진을 사용합니다.',
        });

        console.log('샘플 앨범 데이터 사용:', fallbackData);
        handleSourceSelect('album', fallbackData);
        return;
      }

      // "포항 해안 여행" 앨범 찾기
      const pohangAlbum = albums.find(
        (album: any) =>
          album.name?.includes('포항') ||
          album.name?.includes('해안') ||
          album.name?.includes('여행')
      );

      if (pohangAlbum) {
        console.log('포항 관련 앨범 발견:', pohangAlbum);

        // 앨범의 미디어 파일들을 가져와서 처리
        const albumMediaData =
          pohangAlbum.media_files?.map((media: any, index: number) => ({
            id: media.id || `media_${index}`,
            url:
              media.url || `https://picsum.photos/200/150?random=${index + 10}`,
            name: media.name || `포항 사진 ${index + 1}`,
          })) || [];

        console.log('앨범 미디어 데이터:', albumMediaData);

        toast({
          title: '앨범 선택 완료',
          description: `"${pohangAlbum.name}" 앨범에서 ${albumMediaData.length}개의 사진을 선택했습니다.`,
        });

        handleSourceSelect('album', albumMediaData);
      } else {
        // 포항 관련 앨범이 없는 경우 첫 번째 앨범 사용
        const firstAlbum = albums[0];
        console.log('포항 관련 앨범이 없어 첫 번째 앨범 사용:', firstAlbum);

        const albumMediaData =
          firstAlbum.media_files?.map((media: any, index: number) => ({
            id: media.id || `media_${index}`,
            url:
              media.url || `https://picsum.photos/200/150?random=${index + 20}`,
            name: media.name || `${firstAlbum.name} 사진 ${index + 1}`,
          })) || [];

        toast({
          title: '앨범 선택 완료',
          description: `"${firstAlbum.name}" 앨범에서 ${albumMediaData.length}개의 사진을 선택했습니다.`,
        });

        handleSourceSelect('album', albumMediaData);
      }
    } catch (error) {
      console.error('앨범 데이터 로딩 실패:', error);

      // 오류 발생 시 샘플 데이터 사용
      const fallbackData = [
        {
          id: '1',
          url: 'https://picsum.photos/200/150?random=1',
          name: '포항 해안 여행 1',
        },
        {
          id: '2',
          url: 'https://picsum.photos/200/150?random=2',
          name: '포항 해안 여행 2',
        },
        {
          id: '3',
          url: 'https://picsum.photos/200/150?random=3',
          name: '포항 해안 여행 3',
        },
        {
          id: '4',
          url: 'https://picsum.photos/200/150?random=4',
          name: '포항 해안 여행 4',
        },
      ];

      toast({
        title: '앨범 선택 (샘플 데이터)',
        description: '포항 해안 여행 앨범에서 4개의 사진을 선택했습니다.',
      });

      console.log('샘플 앨범 데이터 사용:', fallbackData);
      handleSourceSelect('album', fallbackData);
    }
  };

  // 미디어 관리 선택
  const handleMediaManagement = async () => {
    console.log('=== 미디어 관리 선택 버튼 클릭됨 ===');

    try {
      // 실제 미디어 파일 데이터 가져오기
      console.log('미디어 파일 데이터 로딩 시작...');
      const mediaResponse = await getMediaFiles();
      console.log('가져온 미디어 응답:', mediaResponse);

      // 응답에서 데이터 추출
      const mediaFiles = mediaResponse?.data || [];
      console.log('미디어 파일 데이터:', mediaFiles);

      if (!mediaFiles || mediaFiles.length === 0) {
        toast({
          title: '미디어 파일이 없습니다',
          description: '먼저 미디어 파일을 업로드해주세요.',
          variant: 'destructive',
        });
        return;
      }

      // 최근 업로드된 미디어 파일들 사용 (최대 10개)
      const recentMediaData = mediaFiles
        .slice(0, 10)
        .map((media: any, index: number) => ({
          id: media.id || `media_${index}`,
          url:
            media.url || `https://picsum.photos/200/150?random=${index + 30}`,
          name: media.name || `미디어 파일 ${index + 1}`,
        }));

      console.log('미디어 파일 데이터:', recentMediaData);

      toast({
        title: '미디어 관리 선택 완료',
        description: `미디어 관리에서 ${recentMediaData.length}개의 파일을 선택했습니다.`,
      });

      handleSourceSelect('media', recentMediaData);
    } catch (error) {
      console.error('미디어 파일 데이터 로딩 실패:', error);

      // 오류 발생 시 샘플 데이터 사용
      const fallbackData = [
        {
          id: '1',
          url: 'https://picsum.photos/200/150?random=3',
          name: '미디어 파일 1',
        },
        {
          id: '2',
          url: 'https://picsum.photos/200/150?random=4',
          name: '미디어 파일 2',
        },
        {
          id: '3',
          url: 'https://picsum.photos/200/150?random=5',
          name: '미디어 파일 3',
        },
      ];

      toast({
        title: '미디어 관리 선택 (샘플 데이터)',
        description: '미디어 관리에서 3개의 파일을 선택했습니다.',
      });

      console.log('샘플 미디어 데이터 사용:', fallbackData);
      handleSourceSelect('media', fallbackData);
    }
  };

  // 스탬프 활용
  const handleStampUsage = async () => {
    console.log('=== 스탬프 활용 선택 버튼 클릭됨 ===');

    try {
      // 실제 스탬프 데이터 가져오기
      console.log('스탬프 데이터 로딩 시작...');
      const response = await fetch('/api/stamps');
      const stampsResponse = await response.json();
      console.log('가져온 스탬프 응답:', stampsResponse);

      // 응답에서 데이터 추출
      const stamps = stampsResponse?.stamps || [];
      console.log('스탬프 데이터:', stamps);

      if (!stamps || stamps.length === 0) {
        toast({
          title: '수집한 스탬프가 없습니다',
          description: '먼저 스탬프를 수집해주세요.',
          variant: 'destructive',
        });
        return;
      }

      // 수집된 스탬프들을 디자인 소스로 변환
      const stampDesignData = stamps
        .filter((stamp: any) => stamp.isCollected)
        .slice(0, 8) // 최대 8개
        .map((stamp: any, index: number) => ({
          id: stamp.id || `stamp_${index}`,
          url:
            stamp.imageUrl ||
            `https://picsum.photos/200/150?random=${index + 40}`,
          name: stamp.name || `스탬프 ${index + 1}`,
        }));

      console.log('스탬프 디자인 데이터:', stampDesignData);

      toast({
        title: '스탬프 활용 선택 완료',
        description: `수집한 스탬프에서 ${stampDesignData.length}개의 스탬프를 선택했습니다.`,
      });

      handleSourceSelect('stamps', stampDesignData);
    } catch (error) {
      console.error('스탬프 데이터 로딩 실패:', error);

      // 오류 발생 시 샘플 데이터 사용
      const fallbackData = [
        {
          id: '1',
          url: 'https://picsum.photos/200/150?random=5',
          name: '포항 해안 스탬프',
        },
        {
          id: '2',
          url: 'https://picsum.photos/200/150?random=6',
          name: '포항 맛집 스탬프',
        },
        {
          id: '3',
          url: 'https://picsum.photos/200/150?random=7',
          name: '포항 문화 스탬프',
        },
        {
          id: '4',
          url: 'https://picsum.photos/200/150?random=8',
          name: '포항 역사 스탬프',
        },
      ];

      toast({
        title: '스탬프 활용 선택 (샘플 데이터)',
        description: '수집한 스탬프에서 4개의 스탬프를 선택했습니다.',
      });

      console.log('샘플 스탬프 데이터 사용:', fallbackData);
      handleSourceSelect('stamps', fallbackData);
    }
  };

  // 새로 업로드
  const handleNewUpload = () => {
    console.log('=== 새로 업로드 선택 버튼 클릭됨 ===');

    // 파일 업로드 모달 표시 (실제 파일 업로드 기능)
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = async (event: any) => {
      const files = Array.from(event.target.files);
      console.log('선택된 파일들:', files);

      if (files.length === 0) {
        toast({
          title: '파일을 선택해주세요',
          description: '업로드할 이미지 파일을 선택해주세요.',
          variant: 'destructive',
        });
        return;
      }

      try {
        // 파일들을 처리하여 미리보기 URL 생성
        const uploadData = await Promise.all(
          files.map(async (file: any, index: number) => {
            const previewUrl = URL.createObjectURL(file);
            return {
              id: `upload_${Date.now()}_${index}`,
              url: previewUrl,
              name: file.name,
              file: file, // 실제 파일 객체 저장
            };
          })
        );

        console.log('업로드 데이터:', uploadData);

        toast({
          title: '파일 업로드 완료',
          description: `${uploadData.length}개의 파일을 업로드했습니다.`,
        });

        handleSourceSelect('upload', uploadData);
      } catch (error) {
        console.error('파일 업로드 처리 실패:', error);

        toast({
          title: '파일 업로드 실패',
          description: '파일 업로드 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    };

    // 파일 선택 다이얼로그 열기
    input.click();
  };

  // 요소 추가
  const addElement = (type: 'image' | 'text', content: string) => {
    const newElement: DesignElement = {
      id: `element_${Date.now()}`,
      type,
      content,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 150 },
      rotation: 0,
      opacity: 1,
      zIndex: elements.length,
      style:
        type === 'text'
          ? {
              fontSize: 16,
              fontFamily: 'Arial',
              color: '#000000',
              fontWeight: 'normal',
            }
          : {},
    };
    setElements([...elements, newElement]);
  };

  // 요소 선택
  const selectElement = (elementId: string) => {
    setSelectedElement(elementId);
  };

  // 요소 삭제
  const deleteElement = (elementId: string) => {
    setElements(elements.filter((el) => el.id !== elementId));
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  };

  // 요소 속성 업데이트
  const updateElement = (
    elementId: string,
    updates: Partial<DesignElement>
  ) => {
    setElements(
      elements.map((el) => (el.id === elementId ? { ...el, ...updates } : el))
    );
  };

  // 드래그 시작
  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    setIsDragging(true);
    setSelectedElement(elementId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // 드래그 중
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 드롭
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (selectedElement) {
      const canvas = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - canvas.left - dragOffset.x;
      const newY = e.clientY - canvas.top - dragOffset.y;

      updateElement(selectedElement, {
        position: { x: Math.max(0, newX), y: Math.max(0, newY) },
      });
    }
  };

  // 요소 크기 조정
  const handleResize = (
    elementId: string,
    newSize: { width: number; height: number }
  ) => {
    updateElement(elementId, { size: newSize });
  };

  // 요소 회전
  const handleRotate = (elementId: string, rotation: number) => {
    updateElement(elementId, { rotation });
  };

  // 프로젝트 저장
  const handleSave = () => {
    const projectData = {
      templateId: template.id,
      projectName,
      elements,
      createdAt: new Date().toISOString(),
    };
    onSave(projectData);
    toast({
      title: '프로젝트 저장 완료',
      description: '기념품 프로젝트가 저장되었습니다.',
    });
  };

  // 미리보기
  const handlePreview = () => {
    setCurrentStep('preview');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 디버깅 정보 */}
      <div className="bg-yellow-100 p-2 text-xs">
        SouvenirEditor 렌더링됨 - 템플릿: {template.name}
      </div>
      {/* 헤더 */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              뒤로가기
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{template.name}</h1>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              미리보기
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
            <Button onClick={() => setShowOrderModal(true)}>
              <Package className="h-4 w-4 mr-2" />
              주문하기
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* 사이드바 */}
        <div className="w-80 bg-white border-r flex flex-col">
          <Tabs defaultValue="source" className="flex-1">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="source">소스</TabsTrigger>
              <TabsTrigger value="design">디자인</TabsTrigger>
              <TabsTrigger value="preview">미리보기</TabsTrigger>
            </TabsList>

            <TabsContent value="source" className="p-4 space-y-4">
              <div>
                <Label htmlFor="project-name">프로젝트 이름</Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="기념품 프로젝트 이름을 입력하세요"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">디자인 소스 선택</h3>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    console.log('=== 앨범에서 선택 버튼 클릭됨 ===');
                    console.log(
                      '현재 showSourceSelector 상태:',
                      showSourceSelector
                    );
                    console.log('setShowSourceSelector(true) 호출');
                    setShowSourceSelector(true);
                    console.log('setShowSourceSelector(true) 호출 완료');
                    // 상태 업데이트 확인을 위한 타이머
                    setTimeout(() => {
                      console.log(
                        '상태 업데이트 후 showSourceSelector:',
                        showSourceSelector
                      );
                    }, 100);
                  }}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  앨범에서 선택
                </Button>

                <Dialog
                  open={showSourceSelector}
                  onOpenChange={(open) => {
                    console.log('Dialog onOpenChange 호출됨:', open);
                    setShowSourceSelector(open);
                  }}
                >
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>디자인 소스 선택</DialogTitle>
                      <DialogDescription>
                        기념품에 사용할 사진이나 디자인을 선택하세요.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => {
                          console.log('=== 나의 앨범 버튼 클릭됨 ===');
                          handleAlbumSelect();
                        }}
                      >
                        <ImageIcon className="h-6 w-6 mb-2" />
                        나의 앨범
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => {
                          console.log('=== 미디어 관리 버튼 클릭됨 ===');
                          handleMediaManagement();
                        }}
                      >
                        <ImageIcon className="h-6 w-6 mb-2" />
                        미디어 관리
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => {
                          console.log('=== 스탬프 활용 버튼 클릭됨 ===');
                          handleStampUsage();
                        }}
                      >
                        <ImageIcon className="h-6 w-6 mb-2" />
                        스탬프 활용
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex-col"
                        onClick={() => {
                          console.log('=== 새로 업로드 버튼 클릭됨 ===');
                          handleNewUpload();
                        }}
                      >
                        <Upload className="h-6 w-6 mb-2" />
                        새로 업로드
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>

            <TabsContent value="design" className="p-4 space-y-4">
              {/* 디자인 캔버스 */}
              <div className="space-y-4">
                <h3 className="font-medium">디자인 캔버스</h3>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                  <div className="relative w-full h-96 bg-gray-50 rounded overflow-hidden">
                    {elements.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                          <Layout className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-2">디자인 캔버스</p>
                        <p className="text-sm text-gray-400 mb-4">
                          {selectedSources.length > 0
                            ? '선택된 소스를 캔버스에 배치해보세요'
                            : '여기에 기념품 디자인이 표시됩니다'}
                        </p>
                        {selectedSources.length > 0 && (
                          <Button
                            onClick={() =>
                              autoArrangeSourcesInGrid(selectedSources)
                            }
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            디자인 시작하기
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        {elements.map((element) => (
                          <div
                            key={element.id}
                            className="absolute cursor-pointer"
                            style={{
                              left: element.position.x,
                              top: element.position.y,
                              width: element.size.width,
                              height: element.size.height,
                              transform: `rotate(${element.rotation}deg)`,
                              opacity: element.opacity,
                              zIndex: element.zIndex,
                            }}
                            onClick={() => setSelectedElement(element.id)}
                          >
                            {element.type === 'image' ? (
                              <img
                                src={element.content}
                                alt="디자인 요소"
                                className="w-full h-full object-cover rounded"
                                style={element.style}
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-black bg-white border rounded p-2"
                                style={element.style}
                              >
                                {element.content}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 선택된 소스 표시 */}
              {selectedSources.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">선택된 소스 ({sourceType})</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedSources.map((source, index) => (
                      <div
                        key={source.id || index}
                        className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => addElement('image', source.url)}
                      >
                        <img
                          src={source.url}
                          alt={source.name}
                          className="w-full h-20 object-cover rounded"
                        />
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {source.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-medium">요소 추가</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addElement('image', 'https://picsum.photos/200/150')
                    }
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    이미지
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addElement('text', '새 텍스트')}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    텍스트
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">레이아웃 템플릿</h3>
                <div className="grid grid-cols-2 gap-2">
                  {layoutTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-2 cursor-pointer transition-all ${
                        selectedTemplate.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedTemplate(template);
                        if (selectedSources.length > 0) {
                          autoArrangeSourcesInTemplate(
                            selectedSources,
                            template
                          );
                        }
                      }}
                    >
                      <div className="text-xs font-medium mb-1">
                        {template.name}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {template.description}
                      </div>

                      {/* 템플릿 미리보기 */}
                      <div className="w-full h-16 bg-gray-100 rounded relative overflow-hidden">
                        {template.type === 'grid' ? (
                          <div
                            className="w-full h-full grid gap-0.5"
                            style={{
                              gridTemplateColumns: `repeat(${template.config.cols}, 1fr)`,
                              gridTemplateRows: `repeat(${template.config.rows}, 1fr)`,
                            }}
                          >
                            {Array.from({
                              length:
                                template.config.rows * template.config.cols,
                            }).map((_, index) => (
                              <div
                                key={index}
                                className="bg-gray-300 rounded-sm"
                              ></div>
                            ))}
                          </div>
                        ) : (
                          <div className="w-full h-full relative">
                            {template.config.layout.map(
                              (item: any, index: number) => (
                                <div
                                  key={index}
                                  className="absolute bg-gray-300 rounded-sm"
                                  style={{
                                    left: `${item.x * 100}%`,
                                    top: `${item.y * 100}%`,
                                    width: `${item.width * 100}%`,
                                    height: `${item.height * 100}%`,
                                  }}
                                />
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">레이아웃 타입</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={currentLayout === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleLayoutChange('grid')}
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    그리드
                  </Button>
                  <Button
                    variant={
                      currentLayout === 'timeline' ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => handleLayoutChange('timeline')}
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    타임라인
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">효과</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    필터
                  </Button>
                  <Button variant="outline" size="sm">
                    <Palette className="h-4 w-4 mr-2" />
                    색상
                  </Button>
                </div>
              </div>

              {selectedElement &&
                (() => {
                  const element = elements.find(
                    (el) => el.id === selectedElement
                  );
                  if (!element) return null;

                  return (
                    <div className="space-y-3">
                      <h3 className="font-medium">선택된 요소</h3>
                      <div className="space-y-2">
                        <div>
                          <Label>위치</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              value={Math.round(element.position.x)}
                              onChange={(e) =>
                                updateElement(selectedElement, {
                                  position: {
                                    ...element.position,
                                    x: parseInt(e.target.value) || 0,
                                  },
                                })
                              }
                            />
                            <Input
                              type="number"
                              value={Math.round(element.position.y)}
                              onChange={(e) =>
                                updateElement(selectedElement, {
                                  position: {
                                    ...element.position,
                                    y: parseInt(e.target.value) || 0,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>크기</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              value={Math.round(element.size.width)}
                              onChange={(e) =>
                                handleResize(selectedElement, {
                                  width: parseInt(e.target.value) || 100,
                                  height: element.size.height,
                                })
                              }
                            />
                            <Input
                              type="number"
                              value={Math.round(element.size.height)}
                              onChange={(e) =>
                                handleResize(selectedElement, {
                                  width: element.size.width,
                                  height: parseInt(e.target.value) || 100,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>회전</Label>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRotate(
                                  selectedElement,
                                  element.rotation - 15
                                )
                              }
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRotate(
                                  selectedElement,
                                  element.rotation + 15
                                )
                              }
                            >
                              <RotateCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label>투명도</Label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={element.opacity}
                            onChange={(e) =>
                              updateElement(selectedElement, {
                                opacity: parseFloat(e.target.value),
                              })
                            }
                            className="w-full"
                          />
                          <span className="text-xs text-gray-500">
                            {Math.round(element.opacity * 100)}%
                          </span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteElement(selectedElement)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          삭제
                        </Button>
                      </div>
                    </div>
                  );
                })()}
            </TabsContent>

            <TabsContent value="preview" className="p-4">
              <div className="space-y-4">
                <h3 className="font-medium">미리보기</h3>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                  <div className="relative w-full h-96 bg-gray-50 rounded overflow-hidden">
                    {elements.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                          <Layout className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-2">디자인 캔버스</p>
                        <p className="text-sm text-gray-400 mb-4">
                          {selectedSources.length > 0
                            ? '선택된 소스를 캔버스에 배치해보세요'
                            : '여기에 기념품 디자인이 표시됩니다'}
                        </p>
                        {selectedSources.length > 0 && (
                          <Button
                            onClick={() =>
                              autoArrangeSourcesInGrid(selectedSources)
                            }
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            디자인 시작하기
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        {elements.map((element) => (
                          <div
                            key={element.id}
                            className="absolute"
                            style={{
                              left: element.position.x,
                              top: element.position.y,
                              width: element.size.width,
                              height: element.size.height,
                              transform: `rotate(${element.rotation}deg)`,
                              opacity: element.opacity,
                              zIndex: element.zIndex,
                            }}
                          >
                            {element.type === 'image' ? (
                              <img
                                src={element.content}
                                alt="디자인 요소"
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-black bg-white border rounded p-2"
                                style={element.style}
                              >
                                {element.content}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ZoomOut className="h-4 w-4 mr-2" />
                    축소
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomIn className="h-4 w-4 mr-2" />
                    확대
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // 미리보기 이미지 다운로드 기능
                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        canvas.width = 800;
                        canvas.height = 600;
                        // 여기에 캔버스 렌더링 로직 추가
                        const link = document.createElement('a');
                        link.download = 'souvenir-preview.png';
                        link.href = canvas.toDataURL();
                        link.click();
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    다운로드
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 메인 캔버스 영역 */}
        <div className="flex-1 p-6">
          <div
            className="bg-white rounded-lg shadow-sm border h-full relative overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {elements.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">디자인 캔버스</h3>
                    <p className="text-gray-600">
                      여기에 기념품 디자인이 표시됩니다
                    </p>
                  </div>
                  <Button onClick={() => setCurrentStep('source')}>
                    <Plus className="h-4 w-4 mr-2" />
                    디자인 시작하기
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {elements.map((element) => (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element.id)}
                    onClick={() => selectElement(element.id)}
                    className={`absolute cursor-move border-2 ${
                      selectedElement === element.id
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    style={{
                      left: element.position.x,
                      top: element.position.y,
                      width: element.size.width,
                      height: element.size.height,
                      transform: `rotate(${element.rotation}deg)`,
                      opacity: element.opacity,
                      zIndex: element.zIndex,
                    }}
                  >
                    {element.type === 'image' ? (
                      <img
                        src={element.content}
                        alt="디자인 요소"
                        className="w-full h-full object-cover rounded"
                        draggable={false}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-black bg-white border rounded"
                        style={element.style}
                      >
                        {element.content}
                      </div>
                    )}

                    {/* 선택된 요소의 조작 핸들 */}
                    {selectedElement === element.id && (
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(element.id);
                          }}
                          className="w-6 h-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 주문 모달 */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        template={template}
        projectData={{
          projectName,
          elements,
          createdAt: new Date().toISOString(),
        }}
      />
    </div>
  );
}
