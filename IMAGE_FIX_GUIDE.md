# 🖼️ 이미지 오류 해결 가이드

## 문제 상황

```
Invalid src prop (https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80) on `next/image`, hostname "images.unsplash.com" is not configured under images in your `next.config.js`
```

## 해결 방법

### 1단계: next.config.ts 수정 완료 ✅

- `images.unsplash.com` 도메인을 `remotePatterns`에 추가
- 기존 `picsum.photos`, `t1.daumcdn.net` 도메인과 함께 설정

### 2단계: 개발 서버 재시작

```bash
# 개발 서버 완전 종료 후 재시작
npm run dev
```

### 3단계: 브라우저 캐시 삭제

- **Ctrl + Shift + R** (하드 새로고침)
- 또는 개발자 도구 → Network 탭 → "Disable cache" 체크

## 수정된 설정

```typescript
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
      hostname: 'images.unsplash.com', // 새로 추가
      port: '',
      pathname: '/**',
    },
  ],
}
```

## 예상 결과

- ✅ **Unsplash 이미지 정상 로딩**
- ✅ **Next.js Image 컴포넌트 오류 해결**
- ✅ **고품질 이미지 표시**

## 추가 도메인이 필요한 경우

다른 이미지 서비스를 사용할 때는 `next.config.ts`의 `remotePatterns`에 추가하면 됩니다.

```typescript
{
  protocol: 'https',
  hostname: 'example.com',
  port: '',
  pathname: '/**',
}
```
