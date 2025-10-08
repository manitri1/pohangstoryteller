/**
 * Hydration 오류 방지를 위한 유틸리티 함수들
 */

import { useEffect, useState } from 'react';

/**
 * 클라이언트 사이드에서만 실행되는 훅
 * 서버와 클라이언트 간의 불일치를 방지합니다.
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * 브라우저 환경에서만 실행되는 함수
 */
export function isBrowser() {
  return typeof window !== 'undefined';
}

/**
 * 서버 사이드에서만 실행되는 함수
 */
export function isServer() {
  return typeof window === 'undefined';
}

/**
 * 안전한 날짜 포맷팅 함수
 * 서버와 클라이언트 간의 시간대 차이를 방지합니다.
 */
export function formatDateSafe(
  date: Date | string,
  locale: string = 'ko-KR'
): string {
  if (isServer()) {
    return new Date(date).toISOString();
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * 안전한 랜덤 ID 생성 함수
 * 서버와 클라이언트 간의 불일치를 방지합니다.
 */
export function generateSafeId(): string {
  if (isServer()) {
    return `server-${Date.now()}`;
  }

  return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 브라우저 확장 프로그램으로 인한 DOM 변경을 감지하는 함수
 */
export function detectBrowserExtensions(): boolean {
  if (isServer()) return false;

  // Feedly 확장 프로그램 감지
  const hasFeedly = document.body.hasAttribute('data-feedly-mini');

  // 기타 확장 프로그램 감지
  const hasExtensions = document.body.attributes.length > 0;

  return hasFeedly || hasExtensions;
}
