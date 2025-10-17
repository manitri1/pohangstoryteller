'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  User,
  Mail,
  Calendar,
  MapPin,
  Users,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function SignUpSuccess() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  const user = session.user as any;
  const preferences = user?.preferences || {};

  // 관심사 한글 변환
  const interestLabels: { [key: string]: string } = {
    nature: '자연경관',
    history: '역사여행',
    alley: '골목산책',
    food: '맛집탐방',
  };

  // 여행 기간 한글 변환
  const durationLabels: { [key: string]: string } = {
    'half-day': '반나절 (2-3시간)',
    'one-day': '하루 (4-6시간)',
    weekend: '주말 (1-2일)',
    'long-term': '장기 (3일이상)',
  };

  // 동반자 한글 변환
  const companionLabels: { [key: string]: string } = {
    alone: '혼자',
    couple: '연인',
    family: '가족',
    friends: '친구',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            🎉 회원가입 완료!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            포항 스토리텔러에 오신 것을 환영합니다,{' '}
            <strong>{user?.name}</strong>님!
          </p>
          <p className="text-sm text-gray-500 mt-1">
            이제 포항의 아름다운 스토리를 탐험하고 기록해보세요
          </p>
          <div className="mt-3 p-4 bg-green-100 border border-green-300 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm text-green-800 font-medium">
                신규 회원가입이 성공적으로 완료되었습니다!
              </p>
            </div>
            <p className="text-xs text-green-700">
              이제 포항 스토리텔러의 모든 기능을 이용하실 수 있습니다.
            </p>
            <div className="mt-2 text-xs text-green-600">
              • 계정이 생성되었습니다
              <br />
              • 프로필이 설정되었습니다
              <br />• 로그인 상태가 활성화되었습니다
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 회원가입 확인 정보 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              회원가입 확인
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">이메일:</span>
                <span className="ml-2 font-medium">{user?.email}</span>
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">이름:</span>
                <span className="ml-2 font-medium">{user?.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">가입일:</span>
                <span className="ml-2 font-medium">
                  {new Date().toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">가입 상태:</span>
                <span className="ml-2 font-medium text-green-600">
                  신규 회원가입 완료
                </span>
              </div>
            </div>
          </div>

          {/* 관심사 정보 */}
          {preferences.interests && preferences.interests.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                선택한 관심사
              </h3>
              <div className="flex flex-wrap gap-2">
                {preferences.interests.map(
                  (interest: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {interestLabels[interest] || interest}
                    </Badge>
                  )
                )}
              </div>
            </div>
          )}

          {/* 여행 선호도 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {preferences.travelDuration && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  여행 기간
                </h3>
                <p className="text-purple-700">
                  {durationLabels[preferences.travelDuration] ||
                    preferences.travelDuration}
                </p>
              </div>
            )}

            {preferences.companion && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  동반자
                </h3>
                <p className="text-orange-700">
                  {companionLabels[preferences.companion] ||
                    preferences.companion}
                </p>
              </div>
            )}
          </div>

          {/* 회원가입 상태 확인 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              회원가입 상태
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">신규 회원가입:</span>
                <Badge className="bg-green-100 text-green-800">✅ 완료</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">계정 생성:</span>
                <Badge className="bg-green-100 text-green-800">✅ 완료</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">프로필 설정:</span>
                <Badge className="bg-green-100 text-green-800">✅ 완료</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">관심사 설정:</span>
                <Badge className="bg-green-100 text-green-800">✅ 완료</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">로그인 상태:</span>
                <Badge className="bg-green-100 text-green-800">✅ 활성</Badge>
              </div>
            </div>
          </div>

          {/* 다음 단계 안내 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">다음 단계</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 포항의 다양한 스토리를 탐험해보세요</p>
              <p>• QR 스탬프를 수집하며 여행을 기록하세요</p>
              <p>• 커뮤니티에서 다른 여행자들과 소통하세요</p>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                홈으로 이동
              </Button>
            </Link>
            <Link href="/stories" className="flex-1">
              <Button variant="outline" className="w-full">
                스토리 탐험하기
              </Button>
            </Link>
            <Link href="/stamps" className="flex-1">
              <Button variant="outline" className="w-full">
                스탬프 수집하기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
