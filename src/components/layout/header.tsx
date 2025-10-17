'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AuthButton from '@/components/auth/auth-button';

interface HeaderProps {
  className?: string;
  onLoginClick?: () => void;
}

export function Header({ className, onLoginClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');

  const navigation = [
    { name: '홈', href: '/' },
    { name: '스토리 탐험', href: '/stories' },
    { name: '경험 기록', href: '/stamps' },
    { name: '커뮤니티', href: '/community' },
    { name: 'AI 챗봇', href: '/stories' },
  ];

  const languages = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-neutral-900">
                <span className="hidden sm:inline">포항 스토리 텔러</span>
                <span className="sm:hidden">포항 스토리</span>
              </span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 우측 액션 버튼들 */}
          <div className="flex items-center space-x-4">
            {/* 언어 선택 */}
            <div className="hidden sm:flex items-center space-x-2">
              <Globe className="h-4 w-4 text-neutral-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent border-none text-sm text-neutral-700 focus:outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 인증 버튼 */}
            <div className="hidden sm:flex">
              <AuthButton />
            </div>

            {/* 모바일 메뉴 */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">메뉴</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <nav className="flex flex-col space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Globe className="h-4 w-4 text-neutral-500" />
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="bg-transparent border-none text-sm text-neutral-700 focus:outline-none"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full">
                      <AuthButton />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
