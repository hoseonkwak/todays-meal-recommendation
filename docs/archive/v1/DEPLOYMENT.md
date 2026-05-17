# 배포 가이드

## Vercel 배포

### 1. Vercel 계정 생성
[vercel.com](https://vercel.com)에서 GitHub 계정으로 로그인

### 2. 프로젝트 Import
1. "New Project" 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: (비워두기)
   - Output Directory: `src`

### 3. 배포
- "Deploy" 클릭
- 자동으로 배포 완료
- URL: `https://your-project.vercel.app`

### 4. 커스텀 도메인 (선택사항)
- Project Settings → Domains
- 원하는 도메인 추가

---

## Netlify 배포

### 1. Netlify 계정 생성
[netlify.com](https://netlify.com)에서 GitHub 계정으로 로그인

### 2. 프로젝트 Import
1. "Add new site" → "Import an existing project"
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - Build command: `echo 'No build required'`
   - Publish directory: `src`

### 3. 배포
- "Deploy site" 클릭
- 자동으로 배포 완료
- URL: `https://your-project.netlify.app`

### 4. 커스텀 도메인 (선택사항)
- Site settings → Domain management
- 원하는 도메인 추가

---

## GitHub Pages 배포

### 1. GitHub 저장소 설정
1. 저장소 Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / Folder: `/src`
4. Save

### 2. 배포
- 자동으로 배포 시작
- URL: `https://username.github.io/today-meal`

### 3. 커스텀 도메인 (선택사항)
- Custom domain 입력
- DNS 설정 필요

---

## 로컬 테스트

### 방법 1: 브라우저에서 직접 열기
```bash
# src/index.html 파일을 브라우저에서 직접 열기
```

### 방법 2: 간단한 HTTP 서버
```bash
# Python 3
python -m http.server 8000 --directory src

# Node.js (npx)
npx serve src

# Node.js (http-server)
npm install -g http-server
http-server src
```

브라우저에서 `http://localhost:8000` 접속

---

## 배포 체크리스트

- [ ] 모든 파일이 `src/` 폴더에 있는지 확인
- [ ] `index.html`이 제대로 로드되는지 확인
- [ ] JavaScript 파일 경로가 올바른지 확인
- [ ] CSS 파일 경로가 올바른지 확인
- [ ] 브라우저 콘솔에 에러가 없는지 확인
- [ ] 모바일에서도 정상 작동하는지 확인
- [ ] LocalStorage가 정상 작동하는지 확인

---

## 문제 해결

### JavaScript 파일이 로드되지 않는 경우
- 파일 경로 확인: `js/app.js` (상대 경로)
- 브라우저 콘솔에서 에러 메시지 확인

### Tailwind CSS가 적용되지 않는 경우
- CDN 링크 확인
- 인터넷 연결 확인

### LocalStorage가 작동하지 않는 경우
- HTTPS 사용 확인 (배포 후)
- 브라우저 설정에서 쿠키/저장소 허용 확인

---

## 성능 최적화

### 1. 이미지 최적화
- WebP 포맷 사용
- 적절한 크기로 리사이징
- Lazy loading 적용

### 2. 캐싱
- Vercel/Netlify는 자동으로 CDN 캐싱 제공
- `vercel.json` / `netlify.toml`에 캐시 설정 포함

### 3. 압축
- Vercel/Netlify는 자동으로 Gzip/Brotli 압축 제공

---

## 모니터링

### Google Analytics 추가 (선택사항)

`src/index.html`의 `<head>` 태그에 추가:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 다음 단계

1단계 MVP 배포 완료 후:
- 사용자 피드백 수집
- 사용 통계 분석
- 2단계 기능 개발 시작
