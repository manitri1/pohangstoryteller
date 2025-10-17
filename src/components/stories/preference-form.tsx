'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Heart, MapPin } from 'lucide-react';

interface PreferenceFormProps {
  onSubmit: (preferences: any) => void;
}

export function PreferenceForm({ onSubmit }: PreferenceFormProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedCompanion, setSelectedCompanion] = useState<string>('');

  const interests = [
    {
      id: 'nature',
      label: '자연경관',
      icon: '🌿',
      description: '바다, 산, 공원 등 자연을 만끽하는 여행',
    },
    {
      id: 'history',
      label: '역사여행',
      icon: '🏛️',
      description: '문화재, 박물관, 역사적 장소 탐방',
    },
    {
      id: 'food',
      label: '맛집탐방',
      icon: '🍽️',
      description: '로컬 맛집, 시장, 특색 있는 음식',
    },
    {
      id: 'culture',
      label: '골목산책',
      icon: '🚶',
      description: '지역 특색, 골목길, 로컬 문화 체험',
    },
  ];

  const durations = [
    {
      id: 'half-day',
      label: '반나절 (2-3시간)',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'full-day',
      label: '하루 (4-6시간)',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'weekend',
      label: '주말 (1-2일)',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'long',
      label: '장기 (3일 이상)',
      icon: <Clock className="h-4 w-4" />,
    },
  ];

  const companions = [
    {
      id: 'solo',
      label: '혼자',
      icon: <Users className="h-4 w-4" />,
      description: '혼자만의 시간을 즐기는 여행',
    },
    {
      id: 'couple',
      label: '연인',
      icon: <Heart className="h-4 w-4" />,
      description: '로맨틱한 데이트 코스',
    },
    {
      id: 'family',
      label: '가족',
      icon: <Users className="h-4 w-4" />,
      description: '모든 연령대가 즐길 수 있는 코스',
    },
    {
      id: 'friends',
      label: '친구',
      icon: <Users className="h-4 w-4" />,
      description: '활발하고 재미있는 그룹 여행',
    },
  ];

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

    onSubmit({
      interests: selectedInterests,
      duration: selectedDuration,
      companion: selectedCompanion,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 관심사 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-500" />
            관심사 선택
          </CardTitle>
          <CardDescription>
            어떤 종류의 여행을 선호하시나요? (복수 선택 가능)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => handleInterestToggle(interest.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedInterests.includes(interest.id)
                    ? 'border-blue-600 border-4 bg-blue-50 text-blue-700 shadow-lg'
                    : 'border-neutral-200 hover:border-blue-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{interest.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{interest.label}</h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      {interest.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 여행 기간 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary-500" />
            여행 기간
          </CardTitle>
          <CardDescription>예상 여행 시간을 선택해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {durations.map((duration) => (
              <button
                key={duration.id}
                onClick={() => setSelectedDuration(duration.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                  selectedDuration === duration.id
                    ? 'border-blue-600 border-4 bg-blue-50 text-blue-700 shadow-lg'
                    : 'border-neutral-200 hover:border-blue-300 hover:bg-neutral-50'
                }`}
              >
                {duration.icon}
                <span className="font-medium">{duration.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 동반자 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent-500" />
            동반자
          </CardTitle>
          <CardDescription>누구와 함께 여행하시나요?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {companions.map((companion) => (
              <button
                key={companion.id}
                onClick={() => setSelectedCompanion(companion.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  selectedCompanion === companion.id
                    ? 'border-blue-600 border-4 bg-blue-50 text-blue-700 shadow-lg'
                    : 'border-neutral-200 hover:border-blue-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {companion.icon}
                  <div>
                    <h3 className="font-semibold">{companion.label}</h3>
                    <p className="text-sm text-neutral-600">
                      {companion.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 선택된 항목 요약 */}
      {(selectedInterests.length > 0 ||
        selectedDuration ||
        selectedCompanion) && (
        <Card className="bg-neutral-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">선택된 항목</h3>
            <div className="space-y-2">
              {selectedInterests.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">관심사:</span>
                  <div className="flex gap-2">
                    {selectedInterests.map((interestId) => {
                      const interest = interests.find(
                        (i) => i.id === interestId
                      );
                      return (
                        <Badge key={interestId} variant="secondary">
                          {interest?.icon} {interest?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
              {selectedDuration && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">기간:</span>
                  <Badge variant="secondary">
                    {durations.find((d) => d.id === selectedDuration)?.label}
                  </Badge>
                </div>
              )}
              {selectedCompanion && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">동반자:</span>
                  <Badge variant="secondary">
                    {companions.find((c) => c.id === selectedCompanion)?.label}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 제출 버튼 */}
      <div className="text-center">
        <Button
          onClick={handleSubmit}
          size="lg"
          className="btn-primary px-8 py-3 text-lg"
          disabled={
            selectedInterests.length === 0 ||
            !selectedDuration ||
            !selectedCompanion
          }
        >
          맞춤 코스 추천받기
        </Button>
      </div>
    </div>
  );
}
