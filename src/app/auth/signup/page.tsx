'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Leaf,
  Building,
  User2,
  Utensils,
  Clock,
  Users,
} from 'lucide-react';

const interestOptions = [
  {
    id: 'nature',
    label: '자연경관',
    icon: Leaf,
    description: '바다, 산, 공원 등 자연을 만끽하는 여행',
  },
  {
    id: 'history',
    label: '역사여행',
    icon: Building,
    description: '문화재, 박물관, 역사적 장소 탐방',
  },
  {
    id: 'alley',
    label: '골목산책',
    icon: User2,
    description: '지역 특색, 골목길, 로컬 문화 체험',
  },
  {
    id: 'food',
    label: '맛집탐방',
    icon: Utensils,
    description: '로컬 맛집, 시장, 특색 있는 음식',
  },
];

const durationOptions = [
  { id: 'half-day', label: '반나절', duration: '2-3시간' },
  { id: 'one-day', label: '하루', duration: '4-6시간' },
  { id: 'weekend', label: '주말', duration: '1-2일' },
  { id: 'long-term', label: '장기', duration: '3일이상' },
];

const companionOptions = [
  { id: 'alone', label: '혼자', icon: User },
  { id: 'couple', label: '연인', icon: Users },
  { id: 'family', label: '가족', icon: Users },
  { id: 'friends', label: '친구', icon: Users },
];

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: [] as string[],
    travelDuration: '',
    companion: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        interests: formData.interests.join(','),
        travelDuration: formData.travelDuration,
        companion: formData.companion,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/auth/signup-success');
      }
    } catch (error: any) {
      setError(error.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-gray-500">
                <User className="w-4 h-4 mr-2" />
                로그인
              </Button>
            </Link>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <User className="w-4 h-4 mr-2" />
              회원가입
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 개인정보 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">이름</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">이메일</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? '처리중...' : '회원가입'}
              </Button>
            </div>

            {/* 관심사 선택 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">관심사 선택</h3>
              <p className="text-sm text-gray-600 mb-4">
                어떤 종류의 여행을 선호하시나요? (복수 선택 가능)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.interests.includes(option.id);
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleInterestToggle(option.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <Icon className="w-5 h-5 mr-2" />
                        <span className="font-medium">{option.label}</span>
                        {isSelected && (
                          <Badge className="ml-auto bg-blue-500">✓</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 여행 기간 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">여행 기간</h3>
              <p className="text-sm text-gray-600 mb-4">
                예상 여행 시간을 선택해주세요.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {durationOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() =>
                      handleInputChange('travelDuration', option.id)
                    }
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.travelDuration === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">{option.label}</span>
                      {formData.travelDuration === option.id && (
                        <Badge className="ml-auto bg-blue-500">✓</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{option.duration}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 동반자 */}
            <div>
              <h3 className="text-lg font-semibold mb-2">동반자</h3>
              <p className="text-sm text-gray-600 mb-4">
                누구와 함께 여행하시나요?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {companionOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleInputChange('companion', option.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.companion === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="font-medium">{option.label}</span>
                        {formData.companion === option.id && (
                          <Badge className="ml-auto bg-blue-500">✓</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
