# 오늘의밥 — 디자인 토큰

> [concept.md](../docs/concept.md) Section 8 추출본. 매 UI 작업 시 강제 참조.

---

## 컬러 토큰

### Light 모드

```css
--bg: #FFFCFA;                   /* 미세하게 따뜻한 화이트 */
--surface: #FFF4F0;              /* 코랄 톤 살짝 섞인 페이퍼 */
--surface-elevated: #FFFFFF;
--separator: rgba(60, 60, 67, 0.1);
--text-primary: #1A1A1F;
--text-secondary: rgba(60, 60, 67, 0.65);
--text-tertiary: rgba(60, 60, 67, 0.35);
--accent: #FF7A6D;               /* 코랄 — 음식 친근 + 귀여운 톤 */
--accent-soft: #FFE3DE;          /* 액센트 배경 (아이콘 squircle muted 등) */
--success: #4ECCA0;
--destructive: #FF5A5F;
```

### Dark 모드

```css
--bg: #14110F;                   /* 따뜻한 검정 */
--surface: #1F1B19;
--surface-elevated: #28231F;
--separator: rgba(255, 255, 255, 0.08);
--text-primary: #FFFAF7;
--text-secondary: rgba(255, 250, 247, 0.65);
--text-tertiary: rgba(255, 250, 247, 0.35);
--accent: #FF8E80;               /* 코랄 (어두운 환경에서 살짝 밝게) */
--accent-soft: rgba(255, 142, 128, 0.18);
--success: #5DD5AE;
--destructive: #FF6B6F;
```

### 컬러 사용 규칙

- **액센트 컬러는 1개만** (`--accent`). 추가 컬러 도입 금지.
- 액센트는 **결정·확정 액션**(추천받기, 결정 확정, 공유 등)에만 사용. 장식 금지.
- 텍스트는 항상 `--text-primary/secondary/tertiary` 중 하나. 임의 색 금지.
- 보더는 항상 `--separator`. 다른 회색 음영 금지.

---

## 타이포그래피

### 폰트

- **한글**: Pretendard Variable (자체 호스팅)
- **영문/숫자**: SF Pro Display (시스템 폴백)

### 사이즈 (iOS HIG 기준)

| 토큰 | px | line-height | 용도 |
|---|---|---|---|
| `text-large-title` | 34 | 41 | 화면 메인 타이틀 (홈 헤드라인) |
| `text-title-1` | 28 | 34 | 섹션 타이틀 |
| `text-title-2` | 22 | 28 | 카드 타이틀 |
| `text-title-3` | 20 | 25 | 서브 타이틀 |
| `text-headline` | 17 | 22 | 강조 본문 (semibold) |
| `text-body` | 17 | 22 | 일반 본문 |
| `text-callout` | 16 | 21 | 보조 본문 |
| `text-subheadline` | 15 | 20 | 라벨 |
| `text-footnote` | 13 | 18 | 캡션 |
| `text-caption-1` | 12 | 16 | 메타 정보 |
| `text-caption-2` | 11 | 13 | 최소 |

### 자간

- 한글: `letter-spacing: -0.02em`
- 영문/숫자: `letter-spacing: 0`

### 굵기

- Regular 400, Medium 500, Semibold 600, Bold 700
- 한 화면에 3가지 이하의 굵기 사용

---

## 스페이싱

8px 그리드 기준:

| 토큰 | px |
|---|---|
| `space-1` | 4 |
| `space-2` | 8 |
| `space-3` | 12 |
| `space-4` | 16 |
| `space-5` | 20 |
| `space-6` | 24 |
| `space-8` | 32 |
| `space-10` | 40 |
| `space-12` | 48 |
| `space-16` | 64 |

---

## 라운드

| 토큰 | px | 용도 |
|---|---|---|
| `rounded-sm` | 8 | 칩, 작은 버튼 |
| `rounded-md` | 12 | 작은 카드, 입력 |
| `rounded-lg` | 16 | 카드, 버튼 |
| `rounded-xl` | 20 | 시트, 큰 카드 |
| `rounded-full` | 9999 | 원형 버튼만 |

**금지**: 50% 라운드(pill) 남용 — 큰 버튼·카드에 사용 시 v1 느낌 회귀.

---

## 그림자 / 깊이

**원칙**: 그림자 최소화. 깊이는 보더 + 톤 차이로 표현.

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);   /* 거의 안 보임, 극히 제한적 */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);  /* 시트, 떠있는 카드만 */
```

큰 box-shadow (`0 20px 60px ...` 같은 v1 패턴) **금지**.

---

## 모션

### 이징

```css
--ease-spring: cubic-bezier(0.32, 0.72, 0, 1);   /* 기본 */
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);   /* 보조 */
```

### 지속 시간

| 토큰 | ms | 용도 |
|---|---|---|
| `duration-fast` | 150 | 호버, 색상 변화 |
| `duration-normal` | 250 | 트랜지션 기본 |
| `duration-slow` | 400 | 화면 전환, 시트 |

### 햅틱

`navigator.vibrate(10)` — 결정 순간, 촬영 순간에 짧게.
`navigator.vibrate([10, 50, 10])` — 영상 생성 완료 등 알림.

---

## 컴포넌트 원칙

### 버튼

- 한 화면에 **채움 버튼은 1개만** (Primary action)
- 보조 액션은 텍스트 버튼 또는 보더 버튼
- 액센트 컬러는 Primary 버튼에만
- 최소 터치 영역: 44pt × 44pt (iOS HIG)

### 카드

- `--surface-elevated` 배경 + `--separator` 1px 보더
- 그림자 ❌, 보더 ✅
- 라운드 `rounded-lg` (16px)
- 패딩 `space-4` (16px) 기본

### 시트 (모달 대체)

- 모바일: 바텀시트 (상단 그래버 핸들, 라운드 `rounded-xl`)
- 데스크톱: 사이드 인스펙터 (우측 슬라이드)
- 백드롭: `rgba(0, 0, 0, 0.4)` + blur
- 닫기: 그래버 드래그 다운 또는 백드롭 탭

### 입력

- 보더 1px `--separator`
- 포커스 시 보더 2px `--accent`
- 라운드 `rounded-md`
- 폰트 `text-body`

### 토글/스위치

- iOS 스타일 (둥근 핸들 + 캡슐 배경)
- 켜짐: `--accent`
- 꺼짐: `--surface` + `--separator` 보더

---

## 다크모드

**1급 시민**. `prefers-color-scheme` 자동 감지 + 사용자 수동 토글 (system/light/dark 3택).

모든 컴포넌트는 다크모드에서 동등하게 잘 보여야 함. 라이트만 디자인 후 다크 땜빵 ❌.

구현:
```css
:root { /* light tokens */ }
.dark { /* dark tokens */ }
@media (prefers-color-scheme: dark) {
  :root:not(.light) { /* dark tokens */ }
}
```

---

## 절대 금지 (디자인)

1. v1의 오렌지 (`#FF6B35`, `#E55A2B`, `#F7931E`) 또는 v2 초기 iOS Orange `#FF9500` 사용 ❌
2. 헤드라인·버튼에 이모지 ❌
3. 라운드 50% 남용 ❌ (단 `.btn-primary` pill은 OK)
4. 너무 진한 box-shadow (`shadow-2xl` 등) ❌ — 미세한 따뜻한 그림자는 권장
5. 액센트 외 추가 강조색 ❌
6. 그라데이션 배경 ❌ (단 `.icon-squircle` 내부 미세 그라데이션은 OK)
7. 폰트 굵기 4종 이상 한 화면에 ❌
8. 모달 (시트 사용) ❌
