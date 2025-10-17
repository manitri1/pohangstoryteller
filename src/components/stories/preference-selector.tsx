'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight } from 'lucide-react';

interface PreferenceSelectorProps {
  onPreferencesSelected: (preferences: UserPreferences) => void;
}

interface UserPreferences {
  interests: string[];
  travelDuration: string;
  companion: string;
}

const interestOptions = [
  {
    id: 'nature',
    label: '자연경관',
    description: '바다, 산, 공원 등 자연을 만끽하는 여행',
  },
  {
    id: 'history',
    label: '역사여행',
    description: '문화재, 박물관, 역사적 장소 탐방',
  },
  {
    id: 'food',
    label: '맛집탐방',
    description: '로컬 맛집, 시장, 특색 있는 음식',
  },
  {
    id: 'culture',
    label: '골목산책',
    description: '지역 특색, 골목길, 로컬 문화 체험',
  },
];

const durationOptions = [
  { id: 'half_day', label: '반나절 (2-3시간)', description: '짧은 시간 투어' },
  { id: 'full_day', label: '하루 (4-6시간)', description: '하루 종일 투어' },
  { id: 'weekend', label: '주말 (1-2일)', description: '주말 여행' },
  { id: 'long_term', label: '장기 (3일 이상)', description: '장기 체류' },
];

const companionOptions = [
  { id: 'solo', label: '혼자', description: '혼자만의 시간을 즐기는 여행' },
  { id: 'couple', label: '연인', description: '로맨틱한 데이트 코스' },
  {
    id: 'family',
    label: '가족',
    description: '모든 연령대가 즐길 수 있는 코스',
  },
  { id: 'friends', label: '친구', description: '활발하고 재미있는 그룹 여행' },
];

export default function PreferenceSelector({
  onPreferencesSelected,
}: PreferenceSelectorProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedCompanion, setSelectedCompanion] = useState<string>('');

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = () => {
    if (
      selectedInterests.length === 0 ||
      !selectedDuration ||
      !selectedCompanion
    ) {
      alert('모든 항목을 선택해주세요.');
      return;
    }

    onPreferencesSelected({
      interests: selectedInterests,
      travelDuration: selectedDuration,
      companion: selectedCompanion,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 관심사 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">관심사 선택</CardTitle>
          <p className="text-gray-600">여러 개 선택 가능합니다</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interestOptions.map((option) => (
              <div
                key={option.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedInterests.includes(option.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInterestToggle(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{option.label}</h3>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                  {selectedInterests.includes(option.id) && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 여행 기간 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">여행 기간 선택</CardTitle>
          <p className="text-gray-600">하나만 선택해주세요</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {durationOptions.map((option) => (
              <div
                key={option.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedDuration === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDuration(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{option.label}</h3>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                  {selectedDuration === option.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 동반자 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">동반자 선택</CardTitle>
          <p className="text-gray-600">하나만 선택해주세요</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companionOptions.map((option) => (
              <div
                key={option.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedCompanion === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCompanion(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{option.label}</h3>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                  {selectedCompanion === option.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 선택된 항목 요약 */}
      {(selectedInterests.length > 0 ||
        selectedDuration ||
        selectedCompanion) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">선택된 취향</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedInterests.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    관심사:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((interestId) => {
                      const interest = interestOptions.find(
                        (opt) => opt.id === interestId
                      );
                      return (
                        <Badge key={interestId} variant="secondary">
                          {interest?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedDuration && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    여행 기간:
                  </p>
                  <Badge variant="outline">
                    {
                      durationOptions.find((opt) => opt.id === selectedDuration)
                        ?.label
                    }
                  </Badge>
                </div>
              )}

              {selectedCompanion && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    동반자:
                  </p>
                  <Badge variant="outline">
                    {
                      companionOptions.find(
                        (opt) => opt.id === selectedCompanion
                      )?.label
                    }
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 추천 받기 버튼 */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={
            selectedInterests.length === 0 ||
            !selectedDuration ||
            !selectedCompanion
          }
          className="px-8"
        >
          맞춤형 코스 추천 받기
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
