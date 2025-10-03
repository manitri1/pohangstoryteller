'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Camera,
  Users,
  MessageCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: '홈', href: '/', icon: Home },
  { name: '스토리 탐험', href: '/stories', icon: BookOpen },
  { name: '경험 기록', href: '/records', icon: Camera },
  { name: '커뮤니티', href: '/community', icon: Users },
  { name: 'AI 챗봇', href: '/chatbot', icon: MessageCircle },
  { name: '설정', href: '/settings', icon: Settings },
];

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-neutral-200 transition-all duration-300 z-40',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* 사이드바 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-neutral-900">메뉴</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900',
                  isCollapsed && 'justify-center'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* 사이드바 푸터 */}
        {!isCollapsed && (
          <div className="p-4 border-t border-neutral-200">
            <div className="text-xs text-neutral-500">
              포항 스토리 텔러 v1.0
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
