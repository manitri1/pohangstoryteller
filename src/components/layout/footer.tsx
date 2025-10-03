import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
} from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: '회사 소개', href: '/about' },
      { name: '채용 정보', href: '/careers' },
      { name: '보도자료', href: '/press' },
      { name: '투자자 정보', href: '/investors' },
    ],
    support: [
      { name: '고객지원', href: '/support' },
      { name: 'FAQ', href: '/faq' },
      { name: '문의하기', href: '/contact' },
      { name: '이용약관', href: '/terms' },
    ],
    legal: [
      { name: '개인정보처리방침', href: '/privacy' },
      { name: '쿠키 정책', href: '/cookies' },
      { name: '서비스 약관', href: '/service-terms' },
      { name: '환불 정책', href: '/refund' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'YouTube', href: '#', icon: Youtube },
  ];

  return (
    <footer className={`bg-neutral-900 text-white ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 메인 푸터 콘텐츠 */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold">포항 스토리 텔러</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              포항의 매력을 담은 스토리 기반 여행 경험을 제공하는 플랫폼입니다.
              여행자의 취향에 맞춘 맞춤형 스토리 코스를 탐험하고, 디지털
              콘텐츠를 즐기며, QR 기반 스탬프 투어를 통해 여행의 기억을
              남겨보세요.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 회사 링크 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">회사</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 지원 링크 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">지원</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 법적 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">법적 정보</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="border-t border-neutral-800 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-neutral-400">
              <Mail className="h-4 w-4" />
              <span className="text-sm">contact@pohangstoryteller.com</span>
            </div>
            <div className="flex items-center space-x-2 text-neutral-400">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+82-54-123-4567</span>
            </div>
          </div>
        </div>

        {/* 저작권 정보 */}
        <div className="border-t border-neutral-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-neutral-400 text-sm">
              © {currentYear} 포항 스토리 텔러. All rights reserved.
            </p>
            <p className="text-neutral-500 text-xs">
              경상북도 포항시 북구 흥해읍 대련리 123-45
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
