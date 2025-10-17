'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn } from 'lucide-react';
import Link from 'next/link';

interface FeatureAccessProps {
  children: ReactNode;
  featureName: string;
  description: string;
  requireAuth?: boolean;
}

export default function FeatureAccess({
  children,
  featureName,
  description,
  requireAuth = true,
}: FeatureAccessProps) {
  const { data: session, status } = useSession();

  // 로그인이 필요하지 않은 기능
  if (!requireAuth) {
    return <>{children}</>;
  }

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 로그인되지 않은 사용자
  if (!session) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">
            {featureName}
          </CardTitle>
          <p className="text-gray-600 mt-2">{description}</p>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            이 기능을 사용하려면 로그인이 필요합니다.
          </p>
          <div className="space-y-2">
            <Link href="/auth/signin" className="block">
              <Button className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                로그인하기
              </Button>
            </Link>
            <Link href="/auth/signup" className="block">
              <Button variant="outline" className="w-full">
                회원가입하기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 로그인된 사용자
  return <>{children}</>;
}
