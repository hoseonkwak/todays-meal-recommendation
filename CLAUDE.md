# today-meal — Claude Code 표준 업무 규약 (SOP)

> 이 파일은 **모든 작업의 1순위 참조 문서**입니다. 코드 작성·수정 전에 항상 이 파일을 따르세요.
> v1 레거시(`docs/archive/v1/`)는 절대 참조하지 마세요. v2는 컨셉부터 갈아엎었습니다.

---

## 프로젝트 개요

**오늘의밥(today-meal)** — 5초 안에 끼니를 결정하게 해주는 도구. 결정한 끼니를 한 컷씩 모아 한 주를 영상으로 돌려줌.

- **1차 가치**: 결정 도구 (정체성)
- **2차 가치**: 식사 라이프로깅 (잔존 엔진)
- **타깃**: 매 끼니 메뉴 고민하는 직장인/학생/자취생 + 일상 기록 공유하는 1020
- **현재 단계**: v2 재기획 완료, 코드 스캐폴딩 직전

---

## 단일 진실 공급원 (Source of Truth)

| 정보 | 위치 |
|---|---|
| 종합 컨셉 | [docs/concept.md](docs/concept.md) |
| 하네스 일반 방법론 | [docs/claude-harness-guide.md](docs/claude-harness-guide.md) |
| 하네스 적용 계획 | [docs/harness-plan.md](docs/harness-plan.md) |
| 브랜드·톤 (압축) | [context/brand-guidelines.md](context/brand-guidelines.md) |
| 제품 컨텍스트 (압축) | [context/product-context.md](context/product-context.md) |
| 디자인 토큰 | [context/design-tokens.md](context/design-tokens.md) |

**Rule**: 컨셉 변경 시 `docs/concept.md` 먼저 수정 → `context/` 동기화 → 이 CLAUDE.md 업데이트.

---

## 폴더 구조

```
today-meal/
├── context/                # 압축 컨텍스트 (작업용)
├── templates/              # UI/데이터 패턴 박제
├── docs/                   # 종합 문서 + v1 아카이브
├── src/                    # Vue 3 코드 (스캐폴딩 예정)
│   ├── views/              # 라우터에 매핑되는 페이지
│   ├── components/         # 재사용 컴포넌트
│   ├── composables/        # useRecommendation 등 로직
│   ├── stores/             # Pinia
│   ├── data/menus.ts       # 메뉴 데이터 80~100개
│   ├── types/              # 공유 타입
│   └── styles/             # Tailwind + 토큰
├── output/                 # 산출물 (빌드와 분리)
├── .claude/agents/         # 서브에이전트 정의
├── .env                    # API 키 (gitignore)
└── CLAUDE.md               # ← 이 파일
```

`docs/archive/v1/`은 의사결정 히스토리 보존용. **참조 금지**.

---

## 기술 스택 (변경 금지)

| 영역 | 선택 |
|---|---|
| 프레임워크 | Vue 3 (Composition API + `<script setup lang="ts">`) |
| 빌드 | Vite |
| 언어 | TypeScript (strict) |
| 상태 | Pinia |
| 라우팅 | Vue Router 4 |
| 스타일 | Tailwind CSS + CSS 변수 (다크모드) |
| 폰트 | Pretendard Variable (자체 호스팅) |
| 저장소 | **IndexedDB** (localStorage 금지 — 사진 Blob 저장) |
| 카메라 | `getUserMedia()` + `<input capture>` 폴백 |
| 영상 | Canvas + MediaRecorder (v2.0) → FFmpeg.wasm / 서버 (v2.1+) |
| 공유 | Web Share API |
| PWA | manifest + service worker (v2.0부터) |
| 배포 | Vercel |

---

## 작업 라우팅 (서브에이전트 활용)

다음 요청 유형에는 자동으로 해당 서브에이전트를 호출:

| 요청 유형 | 호출할 에이전트 | 정의 위치 |
|---|---|---|
| 메뉴 데이터 작성·수정·검증 | `menu-data-agent` | `.claude/agents/menu-data-agent.md` |
| Vue 컴포넌트·화면 작성·수정 | `vue-component-agent` | `.claude/agents/vue-component-agent.md` |
| 디자인 토큰·HIG 위반 검수 | `design-review-agent` | `.claude/agents/design-review-agent.md` |

**규칙**:
- 큰 화면 작성 후에는 `design-review-agent`를 명시적으로 호출해서 리뷰 (vue-component-agent 자체 체크리스트만으로 완료 처리 ❌)
- 에이전트는 정의 파일의 "항상 먼저 읽어야 할 문서"를 모두 읽고 시작해야 함

---

## 핵심 작업 원칙

### 1. 토큰 우선

- 컬러·타이포·스페이싱·라운드는 항상 `context/design-tokens.md`에서만
- raw 색·픽셀 값 하드코딩 ❌
- 새 토큰 필요 시 사용자 확인 후 `design-tokens.md` 업데이트 → 그 다음에 사용

### 2. 컨셉 정체성 유지

- 1차 가치(결정 도구)를 항상 1순위로
- 라이프로깅·수익화 기능은 결정 흐름을 방해하지 않는 선에서만
- 진입 → 결정까지 5초 이내 목표

### 3. 다크모드 1급

- 라이트만 디자인 후 다크 땜빵 ❌
- 모든 컴포넌트는 두 모드에서 동등하게 잘 보여야 함

### 4. 옵트인 원칙

- 라이프로깅·위치·알림은 항상 옵트인
- 사용자가 거부해도 핵심 기능(결정 도구)은 제한 없이 작동

### 5. 익명 로컬 우선

- 데이터는 IndexedDB로컬에 저장
- 백엔드·계정은 v2.2+ 검토. 1차에는 도입 금지
- 텔레메트리는 옵트인으로만

### 6. 작업 흐름

```
1. 사용자 요청 분석
2. 해당 작업의 라우팅 (서브에이전트 호출 또는 직접)
3. 관련 context/templates 문서 모두 읽기
4. 작업 수행
5. 자가검증 (각 에이전트의 체크리스트)
6. 큰 변경 시 design-review-agent로 검수
```

---

## 절대 금지 (Negative Rules)

### 코드

- **`Math.random()` 단일 추천 ❌** — 반드시 컨텍스트 가중치 통과
- **localStorage에 Blob 저장 ❌** — IndexedDB 사용
- **raw 색상값 하드코딩 ❌** — design-tokens 사용
- **컴포넌트 라이브러리 추가 ❌** — Vuetify, Naive UI 등. 직접 구현이 차별점
- **`v-html` ❌** — XSS 위험
- **`prop drilling` 3단계 이상 ❌** — store 사용

### 디자인

- **v1 오렌지 톤** (`#FF6B35` 등) ❌
- **이모지 헤드라인/버튼** ❌
- **50% 라운드(pill) 남용** ❌
- **큰 box-shadow** ❌
- **액센트 외 추가 강조색** ❌
- **그라데이션 배경** ❌
- **모달 (시트 사용)** ❌
- **FAB / 햄버거 메뉴** ❌

### 콘텐츠·마케팅

- **"AI", "알고리즘", "추천 엔진"** 사용자 노출 ❌
- **"완벽한", "최고의" 호들갑 톤** ❌
- **인스타 노이즈 톤** ("미쳤다", "와즈비키" 류) ❌

### 비즈니스

- **검증되지 않은 가게 제휴/결제** ❌ — v2.2+ 검토
- **외부 광고 강제 노출 (광고는 옵트인 또는 비침습)** ❌
- **익명 데이터 외부 송출** ❌ — 옵트인 텔레메트리만

### 작업 방식

- **공식 가이드 무시** ❌ — Vue 3, Pinia, Vue Router 공식 패턴 따름
- **테스트 없는 추천 로직 수정** ❌ — 가중치 변경 시 테스트 필수
- **검증 통계 생략** (메뉴 데이터 작업 시) ❌

---

## v2.0 출시 범위 (요약)

상세는 [docs/concept.md Section 12](docs/concept.md).

**1차 가치 (결정 도구)**:
- Vue 셋업 + 디자인 토큰 인프라
- 메뉴 80~100개
- 3가지 모드 (Quick / Tournament / Slot)
- 컨텍스트 가중치 추천
- 결과 화면 + 외부 액션 슬롯
- 결정 히스토리

**2차 가치 (라이프로깅 최소)**:
- 사진 캡처 + IndexedDB
- 식사 로그 그리드
- 단순 슬라이드쇼 영상 (Canvas + MediaRecorder)
- Web Share API + 워터마크
- PWA manifest

**공통**: 설정 화면, Vercel 배포.

**v2.0에 넣지 말 것**:
- 어필리에이트 링크 실주입 (v2.1)
- FFmpeg.wasm / 서버 영상 처리 (v2.1)
- 푸시 알림 실가동 (v2.1)
- 프리미엄 구독 (v2.2+)
- 백엔드·계정 (v2.2+)

---

## 환경 변수

`.env` 파일에 보관 (gitignore 등재). `.env.example`은 키 목록만 (값 없음).

```
# 추후 추가 예정
# VITE_WEATHER_API_KEY=
# VITE_BUFFER_API_KEY=
```

API 키 하드코딩 ❌. 항상 `import.meta.env.VITE_*` 통해 접근.

---

## 첫 테스트 단계의 자가 수정 트릭

새 에이전트·새 기능 첫 테스트 시 명령에 항상 포함:

> "명확하게 우리 가이드라인이 잘 반영될 수 있도록 해줘. 만일 반영이 잘 안 되어 있다면 CLAUDE.md 또는 관련 가이드 문서에 앞으로 잘 반영될 수 있도록 업데이트해줘."

이 한 줄로 실패가 자동으로 SOP에 누적됨.

---

## 변경 이력

| 날짜 | 변경 |
|---|---|
| 2026-05-13 | 초기 작성. v1 폐기, v2 컨셉으로 재시작. 서브에이전트 3종 등록. |
