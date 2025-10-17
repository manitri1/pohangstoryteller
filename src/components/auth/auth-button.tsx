'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Button variant="ghost" disabled>
        <User className="w-4 h-4 mr-2" />
        로딩중...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          안녕하세요, {session.user?.name}님!
        </span>
        <Button
          variant="ghost"
          onClick={() => signOut()}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/signin">
        <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
          <User className="w-4 h-4 mr-2" />
          로그인
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <User className="w-4 h-4 mr-2" />
          회원가입
        </Button>
      </Link>
    </div>
  );
}
