'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function AuthGuard({
  children,
  fallback,
  redirectTo = '/auth/signin',
  requireAuth = true,
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (requireAuth && !session) {
      router.push(redirectTo);
    }
  }, [session, status, router, requireAuth, redirectTo]);

  if (status === 'loading') {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    );
  }

  if (requireAuth && !session) {
    return null; // 리다이렉트 중
  }

  return <>{children}</>;
}
