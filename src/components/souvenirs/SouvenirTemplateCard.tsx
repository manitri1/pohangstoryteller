'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Download,
  Palette,
  Scissors,
  BookOpen,
  Sticker,
  Key,
  Mail,
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

interface SouvenirTemplateCardProps {
  template: SouvenirTemplate;
  onSelect?: (template: SouvenirTemplate) => void;
  onPreview?: (template: SouvenirTemplate) => void;
  onLike?: (template: SouvenirTemplate) => void;
  showActions?: boolean;
}

export default function SouvenirTemplateCard({
  template,
  onSelect,
  onPreview,
  onLike,
  showActions = true,
}: SouvenirTemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getTemplateIcon = (type: string) => {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nature':
        return 'bg-green-100 text-green-800';
      case 'history':
        return 'bg-purple-100 text-purple-800';
      case 'food':
        return 'bg-orange-100 text-orange-800';
      case 'culture':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nature':
        return '🌿';
      case 'history':
        return '🏛️';
      case 'food':
        return '🍽️';
      case 'culture':
        return '🎭';
      default:
        return '📦';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(template);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
          isHovered ? 'scale-105' : 'scale-100'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 템플릿 이미지 */}
        <div className="relative h-48 overflow-hidden">
          {template.previewImageUrl ? (
            <Image
              src={template.previewImageUrl}
              alt={template.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <div className="text-6xl opacity-50">
                {getTemplateIcon(template.templateType)}
              </div>
            </div>
          )}

          {/* 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* 카테고리 배지 */}
          <div className="absolute top-3 left-3">
            <Badge className={getCategoryColor(template.category)}>
              {getCategoryIcon(template.category)}{' '}
              {template.category.toUpperCase()}
            </Badge>
          </div>

          {/* 템플릿 타입 배지 */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {getTemplateIcon(template.templateType)}
              <span className="ml-1">{template.templateType}</span>
            </Badge>
          </div>

          {/* 가격 배지 */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="default" className="bg-blue-600 text-white">
              {formatPrice(template.basePrice)}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {template.name}
          </CardTitle>
          <p className="text-sm text-gray-600 line-clamp-2">
            {template.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* 통계 정보 */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{template.projectCount}개</span>
              </div>
              <div className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                <span>{template.orderCount}개</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{template.averageRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {template.reviewCount}개 리뷰
            </div>
          </div>

          {/* 별점 표시 */}
          {template.averageRating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(template.averageRating)}
              </div>
              <span className="text-sm text-gray-600">
                ({template.averageRating.toFixed(1)})
              </span>
            </div>
          )}

          {/* 템플릿 설정 정보 */}
          {template.templateConfig && (
            <div className="text-xs text-gray-500 space-y-1">
              {template.templateConfig.size && (
                <div>크기: {template.templateConfig.size}</div>
              )}
              {template.templateConfig.pages && (
                <div>페이지: {template.templateConfig.pages}페이지</div>
              )}
              {template.templateConfig.count && (
                <div>수량: {template.templateConfig.count}개</div>
              )}
            </div>
          )}

          {/* 액션 버튼 */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreview?.(template)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                미리보기
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={`${isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                size="sm"
                onClick={() => onSelect?.(template)}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                제작하기
              </Button>
            </div>
          )}
        </CardContent>

        {/* 호버 효과 */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg flex items-end justify-center pb-4"
          >
            <div className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
              템플릿 선택
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
