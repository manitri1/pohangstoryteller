'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Search,
  Filter,
  X,
  Tag,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  getTagSuggestions,
  getLocationBasedTags,
  smartSearchMedia,
  MediaFile,
} from '@/features/media/api';
import { toast } from '@/hooks/use-toast';

interface AdvancedSearchProps {
  onSearchResults: (results: MediaFile[]) => void;
  onSearchStart: () => void;
  onSearchEnd: () => void;
}

export function AdvancedSearch({
  onSearchResults,
  onSearchStart,
  onSearchEnd,
}: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileType, setFileType] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [location, setLocation] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadTagSuggestions();
    loadLocationSuggestions();
  }, []);

  const loadTagSuggestions = async () => {
    try {
      const { data, error } = await getTagSuggestions(20);
      if (error) throw error;

      const tags = data?.map((item: any) => item.tag) || [];
      setTagSuggestions(tags);
    } catch (error) {
      console.error('태그 추천 로드 오류:', error);
    }
  };

  const loadLocationSuggestions = async () => {
    try {
      const { data, error } = await getLocationBasedTags();
      if (error) throw error;

      const locations = data?.map((item: any) => item.suggested_tags[0]) || [];
      const stringLocations: string[] = locations.filter(
        (loc): loc is string => typeof loc === 'string'
      );
      setLocationSuggestions([...new Set(stringLocations)]);
    } catch (error) {
      console.error('위치 추천 로드 오류:', error);
    }
  };

  const handleSearch = async () => {
    if (
      !searchQuery.trim() &&
      selectedTags.length === 0 &&
      !dateFrom &&
      !dateTo &&
      !location.trim()
    ) {
      toast({
        title: '검색 조건을 입력해주세요',
        description: '검색어, 태그, 날짜, 위치 중 하나 이상을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    onSearchStart();

    try {
      const { data, error } = await smartSearchMedia({
        query: searchQuery,
        file_type:
          fileType !== 'all'
            ? (fileType as 'image' | 'video' | 'audio')
            : undefined,
        date_from: dateFrom ? dateFrom.toISOString() : undefined,
        date_to: dateTo ? dateTo.toISOString() : undefined,
        location: location || undefined,
      });

      if (error) throw error;

      // 태그 필터링 (클라이언트 사이드)
      let filteredResults = data || [];

      if (selectedTags.length > 0) {
        filteredResults = filteredResults.filter((file: MediaFile) =>
          selectedTags.some((tag) => file.tags.includes(tag))
        );
      }

      onSearchResults(filteredResults);

      toast({
        title: '검색 완료',
        description: `${filteredResults.length}개의 파일을 찾았습니다.`,
      });
    } catch (error) {
      console.error('검색 오류:', error);
      toast({
        title: '검색 실패',
        description: '검색 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
      onSearchEnd();
    }
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFileType('all');
    setSelectedTags([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    setLocation('');
  };

  return (
    <div className="space-y-4">
      {/* 검색어 입력 */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="파일명, 태그, 위치로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          검색
        </Button>
      </div>

      {/* 고급 필터 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 파일 타입 */}
        <div>
          <Label className="text-sm font-medium">파일 타입</Label>
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="image">이미지</SelectItem>
              <SelectItem value="video">영상</SelectItem>
              <SelectItem value="audio">오디오</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 시작 날짜 */}
        <div>
          <Label className="text-sm font-medium">시작 날짜</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, 'PPP', { locale: ko }) : '선택'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 종료 날짜 */}
        <div>
          <Label className="text-sm font-medium">종료 날짜</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, 'PPP', { locale: ko }) : '선택'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 위치 */}
        <div>
          <Label className="text-sm font-medium">위치</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="촬영 위치"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* 태그 선택 */}
      <div>
        <Label className="text-sm font-medium mb-2 block">태그</Label>
        <div className="space-y-2">
          {/* 선택된 태그 */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleTagRemove(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* 태그 추천 */}
          {tagSuggestions.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">추천 태그:</p>
              <div className="flex flex-wrap gap-2">
                {tagSuggestions.slice(0, 10).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleTagSelect(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 필터 초기화 */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handleClearFilters}>
          <X className="h-4 w-4 mr-2" />
          필터 초기화
        </Button>

        <div className="text-sm text-gray-500">
          {selectedTags.length > 0 && `${selectedTags.length}개 태그 선택`}
          {dateFrom && ` • ${format(dateFrom, 'yyyy-MM-dd')}부터`}
          {dateTo && ` • ${format(dateTo, 'yyyy-MM-dd')}까지`}
        </div>
      </div>
    </div>
  );
}
