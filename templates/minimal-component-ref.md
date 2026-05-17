# 미니멀 컴포넌트 패턴 (Linear / Vercel / Apple Music)

> 톤 절제, 보더 기반 깊이, 마이크로 인터랙션의 모범 사례 추출. Vue 컴포넌트 작성 시 참조.

---

## 핵심 원칙

> **"보더 + 톤 차이 = 깊이"**

Material Design은 그림자로 깊이를 표현하지만, Apple/Linear/Vercel은 **1px 보더 + 1단계 톤 차이**로 충분히 표현한다. 그림자는 시트 같은 진짜 "떠있는 것"에만.

---

## 1. 카드 (Linear / Vercel)

```
┌────────────────────────────────────┐
│                                    │
│  Title (semibold)                  │
│  Caption · meta (text-tertiary)    │
│                                    │
│  Body content...                   │
│                                    │
└────────────────────────────────────┘
   ↑ 1px border --separator
   배경 --surface-elevated (light: white, dark: #1C1C1E)
   라운드 16px
```

호버:
- 보더 색 → `--text-tertiary` 로 미세 변화
- 또는 배경 → 한 단계 밝게 (light: `--surface` → white, dark: 반대)
- 그림자 추가 ❌

---

## 2. 입력 필드

### 기본 상태

```
┌────────────────────────────────────┐
│  placeholder text                  │
└────────────────────────────────────┘
   1px border --separator
   라운드 12px
   패딩 12 16
```

### 포커스 상태

```
┌────────────────────────────────────┐
│  user input│                       │  ← caret
└────────────────────────────────────┘
   2px border --accent
   transition 150ms
```

### 에러 상태

```
┌────────────────────────────────────┐
│  invalid input                     │
└────────────────────────────────────┘
   2px border --destructive
   아래 helper text (text-caption-1, destructive)
```

---

## 3. 버튼

### Primary (한 화면에 1개)

```
┌──────────────────────────┐
│        Action            │
└──────────────────────────┘
   배경 --accent
   텍스트 흰색, semibold
   라운드 12px
   높이 48~56pt
   패딩 horizontal: 24, vertical: 12
   호버: 배경 brightness 90%
   액티브: scale(0.98) + 햅틱
```

### Secondary

```
┌──────────────────────────┐
│        Action            │
└──────────────────────────┘
   배경 --surface
   텍스트 --text-primary, medium
   1px border --separator
   라운드 12px
```

### Tertiary (text button)

```
   Action →
   ↑ 색 --accent
   호버: underline 또는 brightness
```

### Destructive

Primary 패턴 + 배경 `--destructive`.

### Icon button

```
┌───┐
│ X │
└───┘
   44pt × 44pt (터치 영역)
   배경 transparent → 호버 시 --surface
   라운드 8px
```

---

## 4. 칩 / 태그

```
┌─────────┐
│  한식   │
└─────────┘
   배경 --surface
   텍스트 --text-secondary
   라운드 8px
   패딩 4 10
   폰트 text-caption-1
```

선택됨:
```
┌─────────┐
│  한식   │
└─────────┘
   배경 --accent (with 0.15 alpha) 또는 fill
   텍스트 --accent
   1px border --accent
```

today-meal 적용:
- 카테고리 필터
- 메뉴 태그
- 시간대 라벨

---

## 5. 토글 (iOS Switch 스타일)

### 꺼짐

```
○────────
배경 --surface
보더 1px --separator
핸들 흰색
```

### 켜짐

```
────────●
배경 --accent
핸들 흰색
spring transition 200ms
```

크기: 51 × 31pt (iOS 표준)

---

## 6. 로딩 / 빈 상태

### 인라인 로딩

```
   ◐ 로딩 중...
   회전 애니메이션 (continuous)
   색 --text-secondary
```

스피너는 Apple 스타일 (12개 스포크가 차례로 fade) 또는 단순 원형.

### 빈 상태 (큰 영역)

```


       [큰 아이콘]      ← SF Symbol 스타일, 48pt
                         색 --text-tertiary

       제목                ← text-title-2

       설명 한두 줄        ← text-body, --text-secondary

       [선택적 액션]


```

---

## 7. 셀렉트 / 드롭다운

### 기본

```
┌────────────────────────────────────┐
│  옵션 선택              ▾          │
└────────────────────────────────────┘
   입력 필드와 동일 스타일
```

### 열림 (드롭다운)

- 데스크톱: 아래로 펼쳐지는 패널 (Linear 스타일)
- 모바일: 시트로 (iOS 스타일)

---

## 8. 슬라이더

```
●────────────────
↑ 핸들 18pt, 흰색, 1px border, 미세 그림자
   트랙 4px height
   채워진 부분 --accent
   빈 부분 --separator
```

iOS 표준 슬라이더 그대로.

---

## 9. 진행도 표시 (Progress)

### 선형

```
████████░░░░░░░░░░  60%
   높이 4~6px
   채움 --accent
   배경 --separator
   라운드 fully rounded
```

### 원형

```
   ◐  60%
```

토너먼트 라운드 표시 등에 사용.

---

## 10. 마이크로 인터랙션

### 탭 피드백

```css
.tappable {
  transition: transform 100ms var(--ease-spring);
}
.tappable:active {
  transform: scale(0.96);
}
```

+ `navigator.vibrate(10)` 햅틱

### 호버 (데스크톱만)

```css
@media (hover: hover) {
  .card:hover {
    border-color: var(--text-tertiary);
    transition: border-color 150ms;
  }
}
```

모바일에서는 호버 효과 적용 ❌.

### 페이지 전환

```css
.page-enter {
  opacity: 0;
  transform: translateY(8px);
}
.page-enter-active {
  transition: all 250ms var(--ease-spring);
}
```

---

## 11. 스켈레톤 (로딩 플레이스홀더)

```
┌────────────────────────────────────┐
│  ██████████░░░░░░░                │
│                                    │
│  █████░░░░                         │
│  ████████░░░░░░░                  │
└────────────────────────────────────┘
```

- 색: `--surface` → 약간 더 진한 톤으로 펄스
- 펄스 주기 1.5s
- 라운드는 실제 컴포넌트와 동일

---

## Linear/Vercel 톤 vs Apple 톤 차이

| 요소 | Linear/Vercel | Apple |
|---|---|---|
| 라운드 | 더 작음 (6~12px) | 더 큼 (12~20px) |
| 보더 | 더 진함 | 더 연함 |
| 액센트 | 한 가지 강한 색 | 한 가지 따뜻한 색 |
| 모션 | 더 빠름 (100~200ms) | 더 부드러움 (250~400ms 스프링) |
| 다크모드 | 진한 검정 | 약간 회색 끼는 검정 |

today-meal은 **Apple 톤 쪽으로 더 기움** (food = 따뜻함). 단 Linear의 정보 밀도와 효율성은 차용.

---

## 컴포넌트 작성 체크리스트

새 컴포넌트 만들 때 자가검증:

- [ ] 디자인 토큰만 사용했는가? (raw 색·픽셀 값 ❌)
- [ ] 다크모드에서 동등하게 잘 보이는가?
- [ ] 그림자 대신 보더로 깊이 표현했는가?
- [ ] 라운드 50% 남용 ❌?
- [ ] 이모지 헤드라인/버튼 ❌?
- [ ] 한 화면에 채움 버튼 1개?
- [ ] 폰트 굵기 3종 이내?
- [ ] 모션 스프링 이징?
- [ ] 햅틱 피드백 (결정·확정 액션)?
- [ ] 모바일 터치 영역 최소 44pt?
