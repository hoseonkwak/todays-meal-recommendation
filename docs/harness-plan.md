# today-meal 하네스 적용 계획

> **목적**: [Claude Code 하네스 세팅 가이드](claude-harness-guide.md)의 7단계 방법론을 today-meal v2 프로젝트에 어떻게 적용할지 정리.
> **전제 문서**: [concept.md](concept.md) — today-meal v2 컨셉 / [claude-harness-guide.md](claude-harness-guide.md) — 일반 방법론
> **정리일**: 2026-05-13

---

## 1단계 — 폴더 구조

```
today-meal/
├── context/                    # 신설 — Apple 톤·UX 원칙 박제
│   ├── brand-guidelines.md     # "결정 도구" 정체성, 보이스 톤
│   ├── product-context.md      # 컨셉 핵심 요약 (concept.md에서 추출)
│   └── design-tokens.md        # iOS 컬러 토큰, Pretendard, 다크모드
├── templates/                  # 신설 — Apple 스타일 레퍼런스
│   ├── ios-screens-ref.md      # iOS 네이티브 UI 패턴 (시트, 토글, 카메라)
│   ├── lifelog-patterns.md     # BeReal / 1 Second Everyday 패턴
│   └── menu-data-schema.md     # 메뉴 80~100개 작성 가이드
├── src/                        # Vue 3 코드 (v2 신규)
├── docs/                       # 컨셉·가이드 문서
├── output/                     # 빌드 산출물 (기존 dist/와 별개)
├── .claude/
│   ├── agents/                 # 신설 — 도메인 에이전트
│   └── settings.json
├── .env                        # API 키 (gitignore)
└── CLAUDE.md                   # 신설 — today-meal v2 SOP
```

기존 v1 잔존 파일(`requirements.md`, `tasks.md`, `design-*.md`)은 `docs/archive/v1/`로 이동 예정.

---

## 2단계 — 컨텍스트 추출

`docs/concept.md`는 종합 컨셉 문서로 길다. 작업용 컨텍스트는 별도로 압축해서 추출해야 매 작업마다 효율적:

| 추출 파일 | 출처 (concept.md) | 용도 |
|---|---|---|
| `context/brand-guidelines.md` | Section 1, 3 | "결정 도구" 정체성, 보이스 톤, 카피라이팅 |
| `context/product-context.md` | Section 4~7 | 시간대 시나리오, 결정 모드, 추천 로직, 라이프로깅 |
| `context/design-tokens.md` | Section 8 | iOS 컬러 토큰, Pretendard, 컴포넌트 원칙, 다크모드 |

CLAUDE.md에서 이 파일들을 참조하게 만들면 매번 concept.md 전체를 스캔할 필요 없음.

---

## 3단계 — 템플릿

today-meal은 마케팅 캠페인이 아니라 앱이므로, `templates/`는 **UI 패턴 레퍼런스**로 활용:

| 템플릿 파일 | 레퍼런스 소스 | 추출 내용 |
|---|---|---|
| `templates/ios-screens-ref.md` | iOS Photos / Apple 시스템 앱 캡처 | 카메라/갤러리 UI, 시트, 토글, 셀, 네비게이션 패턴 |
| `templates/lifelog-patterns.md` | BeReal, 1 Second Everyday 캡처 | 라이프로깅 캡처 흐름, 영상 컴파일 UX |
| `templates/minimal-component-ref.md` | Linear, Vercel, Apple Music 캡처 | 톤 절제, 보더 기반 깊이 표현, 마이크로 인터랙션 |
| `templates/menu-data-schema.md` | 직접 작성 | 메뉴 80~100개 작성 시 시간대별 균형, fitness 점수 기준 |

이미지 파일을 직접 두지 말고 **한 번 분석해서 MD로 박제**(가이드 문서 핵심 원칙).

---

## 4단계 — CLAUDE.md (SOP)

today-meal 전용 CLAUDE.md에 포함할 핵심 라우팅 룰 (예시):

```markdown
## 작업 라우팅

- **메뉴 데이터 작성/수정** → menu-data-agent
  - 시간대별 균형 검증 필수
  - fitness 점수는 0.5~2.0 범위만 허용

- **Vue 컴포넌트 작성** → vue-component-agent
  - design-tokens.md 강제 참조 (커스텀 컬러 금지)
  - 다크모드 1급 필수
  - 이모지 헤드라인 금지

- **라이프로깅 기능 (사진/영상)** → lifelog-agent
  - IndexedDB 사용 강제 (localStorage 금지 — 용량)
  - getUserMedia 우선, input[capture] 폴백

- **추천 로직** → recommendation-agent
  - 가중치 범위 보호 (0.5x ~ 2x)
  - 최근 N일 회피 로직 보존

- **디자인 검수** → design-review-agent
  - PR 시 자동 호출
  - Apple HIG 준수 + design-tokens.md 위반 검출

## 절대 금지

- 오렌지 폭격 톤 (#FF6B35 등 v1 색상)
- 이모지 헤드라인/버튼
- Math.random() 단일 추천 (반드시 컨텍스트 가중치 통과)
- localStorage에 Blob 저장
- 검증되지 않은 광고/제휴/결제 시스템 도입
```

---

## 5단계 — 공식 스킬

today-meal은 PPT/PDF/DOCX가 메인이 아니라 **Vue 코드 + Markdown 작성**이 메인:

- Anthropic 공식 `document` 스킬은 우선순위 낮음
- 메뉴 데이터 80~100개 일괄 생성 시 CSV/JSON 출력이 필요하면 그때 검토
- **v2.0 출시 전에는 도입 보류** — 코어 기능 집중

---

## 6단계 — MCP

후보 (현재 도입 X, 시점 명시):

| MCP | 용도 | 도입 시점 |
|---|---|---|
| Figma MCP | 디자인 토큰 자동 추출 | v2.1+ 디자인 시스템 고도화 시 |
| Pinterest / 이미지 검색 MCP | 음식 사진 레퍼런스 수집 | 메뉴 데이터 작성 단계 (선택) |
| GitHub MCP | 이슈/PR 자동화 | v2.0 출시 후 |
| Vercel MCP | 배포 자동화 | v2.0 출시 시점 |
| Buffer API (MCP 아니지만 유사) | 출시 후 마케팅 자동화 | v2.0 출시 후 |

**원칙**: v2.0 출시 전에는 과한 자동화 금지. **MCP는 검증된 워크플로우가 자리 잡은 후** 도입.

---

## 7단계 — 서브에이전트 팀

today-meal v2 작업용 에이전트 제안:

| 에이전트 | 역할 | 트리거 예시 | 우선순위 |
|---|---|---|---|
| `menu-data-agent` | 메뉴 80~100개 작성 (시간대 균형, fitness 점수) | "메뉴 데이터 만들어줘" | 1 |
| `vue-component-agent` | Vue 3 컴포넌트 작성 (디자인 토큰 강제) | "[화면]을 만들어줘" | 1 |
| `design-review-agent` | HIG/토큰 위반 검출 | 컴포넌트 작성 후 자동 | 2 |
| `recommendation-agent` | 추천 로직 작성·튜닝 (가중치 범위 보호) | "추천 로직 수정" | 2 |
| `lifelog-agent` | 사진 캡처·IndexedDB·영상 컴파일 | "라이프로깅 관련" | 3 (v2.0 후반) |

각 에이전트는 [claude-harness-guide.md](claude-harness-guide.md) 7단계 절차에 따라 생성:
1. 팀 계획도 제시 요청
2. CLAUDE.md 라우팅 룰 자동 추가 명령
3. 개별 테스트 → 검증 → 병렬 가동

---

## 적용 우선순위

7단계를 한 번에 적용할 필요 없음. ROI 순:

| 우선 | 단계 | 이유 | 예상 소요 |
|---|---|---|---|
| **1순위** | CLAUDE.md 작성 | 즉시 일관성 ↑, 비용 0 | 30분 |
| **2순위** | `context/` 추출 (concept.md → 3개 압축) | 매 작업 토큰 ↓, 효율 ↑ | 1시간 |
| **3순위** | 서브에이전트 1~2개 (`menu-data`, `design-review`) | 반복 작업 자동화 | 2시간 |
| **4순위** | `templates/` UI 레퍼런스 박제 | 디자인 일관성 보강 | 2~3시간 |
| **보류** | 공식 스킬 | v2.0에 불필요 | — |
| **보류** | MCP | v2.0 출시 후 검토 | — |

---

## 권장 진행 순서

v2.0 코드 작업 시작 **전에** 1~2순위는 깔고 시작:

```
[현재 위치]
  ↓
[1] CLAUDE.md 작성  (이번 세션 끝나기 전 권장)
  ↓
[2] context/ 3개 파일 추출  (concept.md에서 압축)
  ↓
[3] v1 레거시 정리 (docs/archive/v1/로 이동)
  ↓
[4] Vue 프로젝트 스캐폴딩
  ↓
[5] menu-data-agent 생성 → 메뉴 80~100개 일괄 작성
  ↓
[6] vue-component-agent + design-review-agent 페어로
    화면별 구현 (Home → Decide → Result → Log → Reel ...)
  ↓
[7] templates/ 점진적 보강 (필요할 때마다)
  ↓
[8] v2.0 출시 → MCP/스킬 검토
```

---

## 기존 작업과의 통합

- 이 계획은 [concept.md](concept.md) v2 컨셉을 **구현하기 위한 작업 환경 세팅**.
- 컨셉 변경이 생기면 → `concept.md` 먼저 수정 → `context/` 압축 파일 동기화 → CLAUDE.md 라우팅 업데이트.
- 단일 진실 공급원(SoT)은 항상 `concept.md`. `context/`는 그 캐시.
