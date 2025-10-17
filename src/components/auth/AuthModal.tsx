'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: { name: string; email: string }) => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export function AuthModal({
  isOpen,
  onClose,
  onLogin,
  mode,
  onModeChange,
}: AuthModalProps) {
  console.log('AuthModal 렌더링:', { isOpen, mode });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 선택 상태 관리
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedCompanion, setSelectedCompanion] = useState<string>('');

  const handleModeChange = (value: string) => {
    const newMode = value as 'login' | 'register';
    onModeChange(newMode);
    // 폼 초기화
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
    // 선택 상태 초기화
    setSelectedInterests([]);
    setSelectedPeriod('');
    setSelectedCompanion('');
  };

  // 관심사 선택 핸들러 (복수 선택 가능)
  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  // 여행 기간 선택 핸들러 (단일 선택)
  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
  };

  // 동반자 선택 핸들러 (단일 선택)
  const handleCompanionSelect = (companion: string) => {
    setSelectedCompanion(companion);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!loginForm.email || !loginForm.password) {
      toast({
        title: '로그인 실패',
        description: '이메일과 비밀번호를 모두 입력해주세요.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: loginForm.email,
        password: loginForm.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: '로그인 실패',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: '로그인 성공',
          description: '환영합니다!',
        });
        onLogin({ name: '사용자', email: loginForm.email });
        onClose();
      }
    } catch (error) {
      toast({
        title: '로그인 오류',
        description: '로그인 중 문제가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !registerForm.name ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      toast({
        title: '회원가입 실패',
        description: '모든 필드를 입력해주세요.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: '회원가입 실패',
        description: '비밀번호가 일치하지 않습니다.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: registerForm.email,
        password: registerForm.password,
        name: registerForm.name,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: '회원가입 실패',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: '회원가입 성공',
          description: '계정이 생성되었습니다. 자동으로 로그인됩니다.',
        });
        onLogin({ name: registerForm.name, email: registerForm.email });
        onClose();
      }
    } catch (error) {
      toast({
        title: '회원가입 오류',
        description: '회원가입 중 문제가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-w-2xl w-full mx-4 bg-white rounded-lg shadow-lg border max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {mode === 'login' ? '로그인' : '회원가입'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* 모드 전환 버튼 */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={mode === 'login' ? 'default' : 'outline'}
              onClick={() => handleModeChange('login')}
              className="flex-1"
            >
              <LogIn className="h-4 w-4 mr-2" />
              로그인
            </Button>
            <Button
              variant={mode === 'register' ? 'default' : 'outline'}
              onClick={() => handleModeChange('register')}
              className="flex-1"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              회원가입
            </Button>
          </div>

          {/* 로그인 폼 */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-gray-500 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>
          )}

          {/* 회원가입 폼 */}
          {mode === 'register' && (
            <div className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">이름</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={registerForm.name}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          name: e.target.value,
                        })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 입력하세요 (6자 이상)"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-gray-500 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">
                    비밀번호 확인
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={registerForm.confirmPassword}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-gray-500 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? '회원가입 중...' : '회원가입'}
                </Button>
              </form>

              {/* 여행 선호도 선택 */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">관심사 선택</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    어떤 종류의 여행을 선호하시나요? (복수 선택 가능)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: 'nature',
                        label: '자연경관',
                        icon: '🌿',
                        desc: '바다, 산, 공원 등 자연을 만끽하는 여행',
                      },
                      {
                        id: 'history',
                        label: '역사여행',
                        icon: '🏛️',
                        desc: '문화재, 박물관, 역사적 장소 탐방',
                      },
                      {
                        id: 'alley',
                        label: '골목산책',
                        icon: '🚶',
                        desc: '지역 특색, 골목길, 로컬 문화 체험',
                      },
                      {
                        id: 'food',
                        label: '맛집탐방',
                        icon: '🍜',
                        desc: '로컬 맛집, 시장, 특색 있는 음식',
                      },
                    ].map((interest) => (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => handleInterestToggle(interest.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          selectedInterests.includes(interest.id)
                            ? 'border-blue-600 bg-blue-100 shadow-lg ring-2 ring-blue-200'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{interest.icon}</span>
                          <span
                            className={`font-medium ${
                              selectedInterests.includes(interest.id)
                                ? 'text-blue-800 font-bold'
                                : 'text-gray-900'
                            }`}
                          >
                            {interest.label}
                          </span>
                          {selectedInterests.includes(interest.id) && (
                            <span className="ml-auto text-blue-600 font-bold text-lg">
                              ✓
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs ${
                            selectedInterests.includes(interest.id)
                              ? 'text-blue-700'
                              : 'text-gray-600'
                          }`}
                        >
                          {interest.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">여행 기간</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    예상 여행 시간을 선택해주세요.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'half-day', label: '반나절', desc: '2-3시간' },
                      { id: 'one-day', label: '하루', desc: '4-6시간' },
                      { id: 'weekend', label: '주말', desc: '1-2일' },
                      { id: 'long-term', label: '장기', desc: '3일이상' },
                    ].map((period) => (
                      <button
                        key={period.id}
                        type="button"
                        onClick={() => handlePeriodSelect(period.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                          selectedPeriod === period.id
                            ? 'border-blue-600 bg-blue-100 shadow-lg ring-2 ring-blue-200'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-lg">🕐</span>
                          <span
                            className={`font-medium ${
                              selectedPeriod === period.id
                                ? 'text-blue-800 font-bold'
                                : 'text-gray-900'
                            }`}
                          >
                            {period.label}
                          </span>
                          {selectedPeriod === period.id && (
                            <span className="ml-auto text-blue-600 font-bold text-lg">
                              ✓
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs ${
                            selectedPeriod === period.id
                              ? 'text-blue-700'
                              : 'text-gray-600'
                          }`}
                        >
                          {period.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">동반자</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    누구와 함께 여행하시나요?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: 'alone',
                        label: '혼자',
                        icon: '👤',
                        desc: '혼자만의 시간을 즐기는 여행',
                      },
                      {
                        id: 'couple',
                        label: '연인',
                        icon: '💕',
                        desc: '로맨틱한 데이트 코스',
                      },
                      {
                        id: 'friends',
                        label: '친구',
                        icon: '👥',
                        desc: '활발하고 재미있는 그룹 여행',
                      },
                      {
                        id: 'family',
                        label: '가족',
                        icon: '👨‍👩‍👧‍👦',
                        desc: '모든 연령대가 즐길 수 있는 코스',
                      },
                    ].map((companion) => (
                      <button
                        key={companion.id}
                        type="button"
                        onClick={() => handleCompanionSelect(companion.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          selectedCompanion === companion.id
                            ? 'border-blue-600 bg-blue-100 shadow-lg ring-2 ring-blue-200'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{companion.icon}</span>
                          <span
                            className={`font-medium ${
                              selectedCompanion === companion.id
                                ? 'text-blue-800 font-bold'
                                : 'text-gray-900'
                            }`}
                          >
                            {companion.label}
                          </span>
                          {selectedCompanion === companion.id && (
                            <span className="ml-auto text-blue-600 font-bold text-lg">
                              ✓
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs ${
                            selectedCompanion === companion.id
                              ? 'text-blue-700'
                              : 'text-gray-600'
                          }`}
                        >
                          {companion.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 소셜 로그인 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Google로 {mode === 'login' ? '로그인' : '회원가입'}
              </Button>
              <Button variant="outline" className="w-full">
                <User className="mr-2 h-4 w-4" />
                카카오로 {mode === 'login' ? '로그인' : '회원가입'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
