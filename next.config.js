/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기본 설정만 유지
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
  },
  // 빌드 안정성을 위한 설정
  reactStrictMode: false,
  swcMinify: true,
  // 파일 시스템 캐시 비활성화
  generateEtags: false,
  // favicon 처리 개선
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
