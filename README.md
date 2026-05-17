# 오늘의 밥 (today-meal) v2

> 5초 안에 끼니를 결정하게 해주는 도구.
> 결정한 끼니를 한 컷씩 모으면, 한 주를 영상으로 돌려준다.

---

## 컨셉

1차 가치(정체성)는 **결정 도구**, 2차 가치(잔존 엔진)는 **식사 라이프로깅**.
추천이 아니라 결정. 무한 새로고침을 끝내는 게 목표.

자세한 컨셉: [docs/concept.md](docs/concept.md)

---

## 기능 (v2.0)

**1차 가치 — 결정 도구**
- 시간대 자동 인식 (아침/브런치/점심/저녁/야식)
- 3가지 모드
  - **Quick**: 깜빡임 뜸 후 단일 추천 + 거부 5회까지
  - **Tournament**: 3/5/7개 후보 → "킹 오브 더 힐" 토너먼트
  - **Slot**: 슬롯머신 (가중 풀, 6단계 감속)
- 컨텍스트 가중치 추천 (시간·요일·날씨·이력·회피·필터)
- 결과 화면 + 외부 액션 4종 (사진 찍기 / 밀키트 / 지도 / 배달)
- 카테고리 필터 (홈 옵트인)
- 결정 히스토리 + 카테고리 통계

**2차 가치 — 라이프로깅**
- 카메라 캡처 (모바일 인앱 카메라 / 데스크톱 업로드 폼)
- IndexedDB 사진 저장 + 메뉴 태깅
- 일별 그리드 로그 + 풀스크린 뷰어
- 영상 자동 컴파일 (Canvas + MediaRecorder, 9:16 / 1:1 / 16:9)
- Web Share API + 워터마크 + 다운로드

**공통**
- 다크모드 1급 (system/light/dark)
- PWA 설치 가능 + 오프라인 부분 지원
- iOS 코랄 톤 + 토스/배민 친근한 UI
- 첫 진입 환영 시트

---

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | Vue 3 (Composition API + `<script setup lang="ts">`) |
| 빌드 | Vite |
| 언어 | TypeScript (strict) |
| 상태 | Pinia |
| 라우팅 | Vue Router 4 |
| 스타일 | Tailwind CSS + CSS 변수 |
| 폰트 | Pretendard Variable (CDN) |
| 저장소 | IndexedDB (사진/영상), localStorage (설정/이력) |
| 카메라 | `getUserMedia()` + `<input capture>` 폴백 |
| 영상 | Canvas + MediaRecorder |
| 공유 | Web Share API |
| PWA | manifest + service worker |
| 배포 | Vercel |

---

## 개발 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 (http://localhost:5173)
npm run dev

# 타입 체크
npm run type-check

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 메뉴 데이터 분포 검증
npm run verify:menus

# 추천 엔진 시뮬레이션 (10,000회)
npm run verify:recommendation
```

---

## Vercel 배포

가장 간단한 두 가지 방법:

### 방법 1 — GitHub 자동 배포 (권장)

```bash
git push origin master
```

1. https://vercel.com 에서 **New Project**
2. GitHub 저장소(`today-meal`) 선택
3. Framework Preset: **Vite** (자동 감지)
4. Build Command: `npm run build` (자동)
5. Output Directory: `dist` (자동)
6. **Deploy** 클릭 → 끝

이후 `git push`할 때마다 자동 배포.

### 방법 2 — Vercel CLI

```bash
npm i -g vercel
vercel              # 첫 배포 (프리뷰)
vercel --prod       # 프로덕션 배포
```

이미 [vercel.json](vercel.json)이 SPA 라우팅 + Vite 설정으로 잡혀있어 추가 설정 불필요.

### 배포 후 체크리스트

- [ ] PWA 매니페스트 정상 로딩 (`<domain>/manifest.webmanifest`)
- [ ] favicon / apple-touch-icon 표시
- [ ] og-image 카카오톡/슬랙에서 미리보기 카드 표시
- [ ] 모바일 Safari/Chrome에서 카메라 권한 작동
- [ ] iOS Safari에서 "홈 화면에 추가" → 풀스크린 PWA 작동
- [ ] Web Share API로 영상 공유 작동

---

## 폴더 구조

```
today-meal/
├── CLAUDE.md                # Claude Code SOP — 모든 작업의 1순위 참조
├── context/                 # 압축 컨텍스트 (작업용)
├── templates/               # UI/데이터 패턴 박제
├── docs/
│   ├── concept.md           # 단일 진실 공급원
│   ├── claude-harness-guide.md
│   ├── harness-plan.md
│   └── archive/v1/          # v1 레거시 (참조 금지)
├── src/
│   ├── views/               # 라우터 페이지
│   ├── components/          # 재사용 컴포넌트
│   ├── composables/         # 비즈니스 로직 (recommendation, db, camera 등)
│   ├── stores/              # Pinia
│   ├── router/
│   ├── types/
│   ├── data/menus.ts        # 메뉴 89개
│   └── styles/              # tokens.css + main.css
├── public/                  # PWA 자산 (favicon, manifest, sw, og-image)
├── scripts/                 # verify-*.mjs / .ts
├── .claude/agents/          # Claude Code 서브에이전트 정의
└── .env.example
```

---

## v2.0 이후 로드맵

| 시점 | 작업 |
|---|---|
| 출시 후 | Vercel 배포 확인, 모바일 실기기 검증 |
| v2.1 | 어필리에이트 실가동 (쿠팡파트너스 + Vercel Serverless), 날씨 API, 영상 음악·필터, 푸시 알림 |
| v2.2 | 프리미엄 구독, 그룹 결정, 디스플레이 광고 (DAU 1000+ 시점) |
| v2.3+ | 백엔드 + 계정, B2B 사내 점심봇, 트렌드 데이터 판매 |

자세한 내용은 [docs/concept.md Section 12, 13](docs/concept.md) 참고.

---

## 라이선스

MIT — [LICENSE](LICENSE)
