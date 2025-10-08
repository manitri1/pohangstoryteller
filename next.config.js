/** @type {import('next').NextConfig} */
const nextConfig = {
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dapi.kakao.com http://dapi.kakao.com http://t1.daumcdn.net https://t1.daumcdn.net https://maps.googleapis.com; script-src-elem 'self' 'unsafe-inline' https://dapi.kakao.com http://dapi.kakao.com http://t1.daumcdn.net https://t1.daumcdn.net https://maps.googleapis.com; connect-src 'self' https://dapi.kakao.com http://dapi.kakao.com http://t1.daumcdn.net https://t1.daumcdn.net https://maps.googleapis.com; img-src 'self' data: https: http: blob:;",
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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
  // SWC가 기본 컴파일러로 사용됨 (Next.js 14+)
  // Windows 파일 시스템 문제 해결을 위한 설정
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // 소스맵 설정 개선 (eval-source-map 대신 더 안정적인 설정 사용)
      config.devtool = 'cheap-module-source-map';

      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 500,
        ignored: /node_modules/,
        followSymlinks: false,
      };

      // Windows에서 파일 시스템 안정성 향상
      config.snapshot = {
        managedPaths: [/^(.+?[\\/]node_modules[\\/])(.+)$/],
        immutablePaths: [/^(.+?[\\/]node_modules[\\/])(.+)$/],
      };

      // 파일 시스템 캐시 최적화
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };

      // Windows 경로 문제 해결
      config.resolve = {
        ...config.resolve,
        symlinks: false,
      };
    }
    return config;
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Hydration 오류 방지를 위한 설정
  reactStrictMode: true,
};

module.exports = nextConfig;
