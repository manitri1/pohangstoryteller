import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // 외부 스크립트 로드 허용
  // Content Security Policy 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dapi.kakao.com http://t1.daumcdn.net https://t1.daumcdn.net https://maps.googleapis.com; script-src-elem 'self' 'unsafe-inline' https://dapi.kakao.com http://t1.daumcdn.net https://t1.daumcdn.net https://maps.googleapis.com; connect-src 'self' https://dapi.kakao.com http://t1.daumcdn.net https://t1.daumcdn.net https://maps.googleapis.com; img-src 'self' data: https: http: blob:;",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't1.daumcdn.net',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: false, // CSS 최적화 비활성화 (critters 모듈 오류 방지)
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
