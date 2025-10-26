# Git 업로드 및 Vercel 배포 가이드

## 📌 개요

이 가이드는 포항 스토리 텔러 프로젝트를 Git에 업로드하고 Vercel에 배포하는 전체 과정을 단계별로 안내합니다.

---

## 🚀 1단계: Git 업로드 준비

### 1.1 현재 상태 확인

```bash
# 현재 Git 상태 확인
git status

# 브랜치 확인
git branch

# 원격 저장소 확인
git remote -v
```

### 1.2 변경사항 스테이징

```bash
# 모든 변경사항 추가
git add .

# 또는 특정 파일만 추가
git add src/components/albums/add-item-modal.tsx
git add docs/task_3rd.md
```

### 1.3 커밋 생성

```bash
# 의미있는 커밋 메시지와 함께 커밋
git commit -m "feat: 앨범 아이템 추가 모달 기능 개선"

# 또는 더 자세한 메시지
git commit -m "feat: 앨범 아이템 추가 모달 기능 개선

- 사용자 인터페이스 개선
- 에러 핸들링 강화
- 접근성 개선"
```

---

## 🔒 2단계: 보안 검토

### 2.1 민감한 정보 확인

⚠️ **중요**: 다음 항목들이 코드에 포함되지 않았는지 확인하세요:

- API 키 (OpenAI, Kakao Map, Supabase 등)
- 데이터베이스 비밀번호
- JWT 시크릿
- 환경 변수 값

### 2.2 환경 변수 파일 확인

```bash
# .env 파일이 .gitignore에 포함되어 있는지 확인
cat .gitignore | grep -E "\.env"

# .env.example 파일만 커밋되는지 확인
git status | grep -E "\.env"
```

### 2.3 보안 스캔 실행

```bash
# Git 보안 스캔 (선택사항)
git secrets --scan

# 또는 수동으로 민감한 정보 검색
grep -r "sk-" . --exclude-dir=node_modules
grep -r "password" . --exclude-dir=node_modules
```

---

## 📤 3단계: Git 업로드

### 3.1 원격 저장소에 푸시

```bash
# 메인 브랜치에 푸시
git push origin main

# 또는 새로운 브랜치 생성 후 푸시
git checkout -b feature/album-improvements
git push origin feature/album-improvements
```

### 3.2 푸시 실패 시 대응

만약 보안 스캔에 의해 푸시가 차단된 경우:

```bash
# 1. 문제가 된 파일 확인
git log --oneline -5

# 2. 특정 커밋의 변경사항 확인
git show <commit-hash> --name-only

# 3. 민감한 정보 제거 후 재커밋
git add .
git commit -m "fix: remove sensitive information"
git push origin main
```

---

## 🌐 4단계: Vercel 배포 준비

### 4.1 Vercel 계정 설정

1. [Vercel 웹사이트](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. 프로젝트 저장소 연결

### 4.2 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 설정:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Next-Auth 설정
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret

# Kakao Map API
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key

# OpenAI API (3단계에서 사용)
OPENAI_API_KEY=your_openai_api_key
```

### 4.3 빌드 설정 확인

`vercel.json` 파일이 올바르게 설정되어 있는지 확인:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "pages/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

---

## 🚀 5단계: Vercel 배포 실행

### 5.1 자동 배포

GitHub에 푸시하면 Vercel이 자동으로 배포를 시작합니다:

1. Vercel 대시보드에서 프로젝트 선택
2. "Deployments" 탭에서 배포 상태 확인
3. 빌드 로그 모니터링

### 5.2 수동 배포

```bash
# Vercel CLI 설치 (선택사항)
npm i -g vercel

# 로컬에서 배포 테스트
vercel

# 프로덕션 배포
vercel --prod
```

### 5.3 배포 상태 확인

```bash
# 배포 상태 확인
vercel ls

# 특정 배포 상세 정보
vercel inspect <deployment-url>
```

---

## 🔍 6단계: 배포 후 검증

### 6.1 기본 기능 테스트

배포 완료 후 다음 기능들을 테스트:

- [ ] 홈페이지 로딩
- [ ] 사용자 인증 (로그인/회원가입)
- [ ] 스토리 탐험 기능
- [ ] QR 스캔 기능
- [ ] 앨범 생성 및 편집
- [ ] 기념품 제작
- [ ] 커뮤니티 피드

### 6.2 성능 테스트

```bash
# Lighthouse 성능 테스트
npx lighthouse https://your-domain.vercel.app --view

# 또는 온라인 도구 사용
# https://pagespeed.web.dev/
```

### 6.3 에러 모니터링

- Vercel 대시보드의 "Functions" 탭에서 API 에러 확인
- 브라우저 개발자 도구에서 클라이언트 에러 확인
- Supabase 대시보드에서 데이터베이스 에러 확인

---

## 🛠️ 7단계: 문제 해결

### 7.1 일반적인 배포 문제

#### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 문제 해결
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 환경 변수 문제
```bash
# 환경 변수 확인
vercel env ls

# 환경 변수 추가
vercel env add NEXT_PUBLIC_SUPABASE_URL
```

#### 데이터베이스 연결 문제
- Supabase 프로젝트 설정 확인
- RLS (Row Level Security) 정책 확인
- API 키 권한 확인

### 7.2 성능 최적화

```bash
# 번들 크기 분석
npm run build
npx @next/bundle-analyzer

# 이미지 최적화 확인
# Next.js Image 컴포넌트 사용 확인
```

---

## 📊 8단계: 모니터링 및 유지보수

### 8.1 Vercel 분석 설정

1. Vercel 대시보드에서 "Analytics" 활성화
2. Web Vitals 모니터링 설정
3. 에러 추적 설정

### 8.2 정기적인 업데이트

```bash
# 의존성 업데이트 확인
npm outdated

# 보안 업데이트
npm audit
npm audit fix

# 정기적인 재배포
git add .
git commit -m "chore: update dependencies"
git push origin main
```

---

## 📋 체크리스트

### Git 업로드 전 체크리스트

- [ ] 모든 변경사항 커밋됨
- [ ] 민감한 정보 제거됨
- [ ] .env 파일이 .gitignore에 포함됨
- [ ] 커밋 메시지가 명확함
- [ ] 로컬에서 빌드 성공

### Vercel 배포 전 체크리스트

- [ ] 환경 변수 설정 완료
- [ ] vercel.json 설정 확인
- [ ] package.json 스크립트 확인
- [ ] 데이터베이스 연결 테스트
- [ ] API 엔드포인트 테스트

### 배포 후 체크리스트

- [ ] 기본 기능 동작 확인
- [ ] 성능 테스트 통과
- [ ] 에러 로그 확인
- [ ] 모바일 반응형 확인
- [ ] SEO 메타 태그 확인

---

## 🚨 주의사항

### 보안 관련

- ⚠️ **절대 API 키를 코드에 직접 포함하지 마세요**
- ⚠️ **환경 변수는 Vercel 대시보드에서만 설정하세요**
- ⚠️ **정기적으로 의존성 보안 업데이트를 확인하세요**

### 성능 관련

- 📈 **이미지는 Next.js Image 컴포넌트를 사용하세요**
- 📈 **불필요한 의존성은 제거하세요**
- 📈 **코드 스플리팅을 활용하세요**

### 유지보수 관련

- 🔄 **정기적인 백업을 수행하세요**
- 🔄 **에러 로그를 모니터링하세요**
- 🔄 **사용자 피드백을 수집하세요**

---

## 📞 지원 및 도움

### 문제 발생 시

1. **Vercel 문서**: https://vercel.com/docs
2. **Next.js 문서**: https://nextjs.org/docs
3. **Supabase 문서**: https://supabase.com/docs
4. **GitHub Issues**: 프로젝트 저장소의 Issues 탭

### 추가 리소스

- [Vercel 배포 가이드](https://vercel.com/docs/concepts/deployments)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 프로덕션 가이드](https://supabase.com/docs/guides/platform/going-into-prod)

---

✅ **이 가이드를 따라하면 안전하고 효율적으로 Git 업로드와 Vercel 배포를 완료할 수 있습니다!**
