'use client';

import { Header } from './header';
import { Sidebar } from './sidebar';
import { Footer } from './footer';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
  onLoginClick?: () => void;
}

export function MainLayout({
  children,
  showSidebar = true,
  className,
  onLoginClick,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onLoginClick={onLoginClick} />

      <div className="flex">
        {showSidebar && <Sidebar />}

        <main
          className={cn(
            'flex-1 min-h-[calc(100vh-4rem)]',
            showSidebar && 'ml-64',
            className
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
