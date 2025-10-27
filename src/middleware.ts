import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    console.log('Middleware 실행:', {
      pathname: req.nextUrl.pathname,
      hasToken: !!req.nextauth.token,
      token: req.nextauth.token
    });

    // 인증이 필요한 라우트들
    const protectedRoutes = [
      '/stamps',
      '/albums',
    ];

    const isProtectedRoute = protectedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute && !req.nextauth.token) {
      console.log('리다이렉트 발생:', req.nextUrl.pathname);
      // 인증되지 않은 사용자를 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log('Authorized 콜백:', {
          pathname: req.nextUrl.pathname,
          hasToken: !!token,
          token: token
        });

        // API 라우트는 미들웨어에서 제외
        if (req.nextUrl.pathname.startsWith('/api/')) {
          return true;
        }

        // 스토리 탐험은 선택적 인증 (선택사항)
        if (req.nextUrl.pathname.startsWith('/stories')) {
          return true; // 로그인 없이도 접근 가능
        }

        // 보호된 라우트들
        const protectedRoutes = [
          '/stamps',
          '/albums',
        ];

        const isProtectedRoute = protectedRoutes.some((route) =>
          req.nextUrl.pathname.startsWith(route)
        );

        if (isProtectedRoute) {
          console.log('보호된 라우트 체크:', {
            isProtectedRoute,
            hasToken: !!token,
            result: !!token
          });
          return !!token; // 토큰이 있으면 접근 허용
        }

        return true; // 다른 라우트는 자유 접근
      },
    },
  }
);

export const config = {
  matcher: [
    '/stamps/:path*',
    '/community/:path*',
    '/albums/:path*',
    '/media/:path*',
    '/souvenirs/:path*',
    '/stories/:path*',
  ],
};
