'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  X,
  Home,
  MapPin,
  Camera,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';

const navigationItems = [
  { name: '홈', href: '/', icon: Home },
  { name: '스토리 탐험', href: '/stories', icon: MapPin },
  { name: '경험 기록', href: '/records', icon: Camera },
  { name: '커뮤니티', href: '/community', icon: MessageCircle },
  { name: '고객지원', href: '/support', icon: HelpCircle },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">포항 스토리 텔러</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 네비게이션 */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 푸터 */}
          <div className="p-4 border-t">
            <div className="text-xs text-neutral-500">
              <p>© 2024 포항 스토리 텔러</p>
              <p>모든 권리 보유</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
