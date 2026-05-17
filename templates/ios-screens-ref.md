# iOS 화면 패턴 레퍼런스

> Apple iOS 네이티브 앱(Photos, Music, Notes, Reminders, Health 등)에서 추출한 UI 패턴. Vue 컴포넌트 작성 시 참조.

---

## 화면 구조의 기본 골격

```
┌──────────────────────────────────────┐
│  [< Back]      [Title]      [Action] │  ← Nav bar (44pt 높이, 보더 없음)
├──────────────────────────────────────┤
│                                      │
│  Large Title                         │  ← scroll 시 Title bar로 collapse
│  Subtitle (optional)                 │
│                                      │
│  ─────────────────────               │  ← separator만 사용
│                                      │
│  [Content cards / lists]             │
│                                      │
│                                      │
└──────────────────────────────────────┘
│   [Tab 1]  [Tab 2]  [Tab 3]          │  ← Tab bar (옵션)
└──────────────────────────────────────┘
```

핵심:
- Nav bar는 보더 ❌, 스크롤 시 배경에 blur 효과
- Large Title은 첫 진입 시 큼 → 스크롤 시 작아지면서 Nav bar로 흡수
- 백 버튼은 텍스트("뒤로" or 이전 화면명) 또는 아이콘 단독

---

## 시트 (Sheet) 패턴

iOS의 모달 대체. 바텀시트 형태.

```
┌──────────────────────────────────────┐
│         [기존 화면 흐려짐]            │  ← backdrop blur
│                                      │
├──────────────────────────────────────┤
│            ──                        │  ← grabber handle (드래그 닫기)
│  [Cancel]   [Title]    [Done]        │  ← 시트 nav bar
│                                      │
│  [Content]                           │
│                                      │
│                                      │
└──────────────────────────────────────┘
```

핵심:
- 상단에 **그래버**(작은 가로 회색 바) — 드래그로 닫기 가능 신호
- 상단 라운드 `rounded-xl` (20px)
- 백드롭은 약한 검정 + blur
- 부분 높이(detent) 지원: 25% / 50% / full
- 시트 안 컨텐츠도 스크롤 가능 (시트 자체 드래그와 구분)

today-meal 적용:
- 결정 모드 진입 후 결과 (`/decide/result`)
- 카메라 시트 (`/capture`)
- 설정 항목 상세
- 메뉴 상세

---

## 리스트 / 셀 패턴

iOS Settings, Notes 등에서 사용.

```
┌──────────────────────────────────────┐
│  Section Header (uppercase, gray)    │  ← text-footnote, text-tertiary
├──────────────────────────────────────┤
│  [Icon]  Label                  > │
│  ──────────────────────              │
│  [Icon]  Label              [Value] │  ← 우측에 값 표시
│  ──────────────────────              │
│  [Icon]  Toggle Label    [○────●] │  ← 토글
└──────────────────────────────────────┘
```

핵심:
- 셀 사이 separator는 좌측 16~52px 들여쓰기 (아이콘 위치 정렬)
- 셀 높이 최소 44pt (터치 영역)
- 우측 chevron(`>`)은 다음 화면 진입 신호
- 아이콘은 SF Symbols 스타일 (선 굵기 통일)

today-meal 적용:
- `/settings` 화면 전체
- `/history` 결정 히스토리
- `/log` 식사 로그 (그리드 변형)

---

## 카드 (Card)

iOS Health, Wallet 등.

```
┌────────────────────────────────────┐
│  Title                       Icon  │
│                                    │
│  Big Number / Hero Content         │
│                                    │
│  Subtitle / Meta                   │
└────────────────────────────────────┘
```

핵심:
- 배경 `--surface-elevated`
- 1px 보더 `--separator` (그림자 대신)
- 라운드 `rounded-lg` (16px)
- 패딩 `space-4` (16px)
- 호버/탭 시 미세한 scale (0.98) + 햅틱

today-meal 적용:
- 메뉴 후보 카드 (Tournament 모드)
- 결과 화면 메인 카드
- 식사 로그 그리드 셀
- 영상 미리보기 카드

---

## 큰 버튼 (Primary Action)

iOS Apple Pay, Sign in with Apple 등.

```
┌────────────────────────────────────┐
│           큰 액션 버튼              │
└────────────────────────────────────┘
```

핵심:
- 풀폭 또는 60% 폭
- 높이 50~56pt
- 라운드 `rounded-lg` (16px) — 50% pill 금지
- 배경 `--accent`, 텍스트 흰색
- 폰트 `text-headline` (semibold)
- 한 화면에 1개만

today-meal 적용:
- 홈의 "추천받기" (시간대별 라벨)
- 결과 화면 "이 메뉴로 결정"
- 카메라 시트 "촬영"

---

## 카메라 / 풀스크린 캡처 UI

iOS Camera 앱 패턴.

```
┌──────────────────────────────────────┐
│  [X]                          [⚡]   │  ← 닫기, 플래시
│                                      │
│                                      │
│                                      │
│         [Live Preview]               │
│                                      │
│                                      │
│                                      │
│         ─────────                    │
│  [📷]      ●         [⟲]            │  ← 갤러리, 셔터(72pt), 카메라 전환
└──────────────────────────────────────┘
```

핵심:
- 배경 완전 검정
- 컨트롤은 흰색 또는 반투명 흰색
- 셔터 버튼 큼(72pt), 가운데
- 좌측에 마지막 사진 썸네일(갤러리 진입)
- 햅틱 피드백 (셔터 누를 때)

today-meal 적용: `/capture` 풀스크린

---

## 영상 플레이어 (iOS Photos 스타일)

```
┌──────────────────────────────────────┐
│  [Done]              [Edit]   [Share]│
│                                      │
│         [Video Preview]              │
│                                      │
│                                      │
│  ─────●────────                     │  ← progress
│  [⏮] [▶] [⏭]                       │
└──────────────────────────────────────┘
```

핵심:
- 배경 검정, 컨트롤 흰색
- 자동 재생, 탭 시 컨트롤 표시/숨김
- 공유 버튼은 시스템 공유 시트 호출

today-meal 적용: `/reel/:id` 영상 미리보기

---

## 빈 상태 (Empty State)

```
        ┌─────────┐
        │  [icon] │      ← 큰 SF Symbol 또는 일러스트
        └─────────┘

        제목 (text-title-2)

        설명 (text-body, secondary)
        한두 줄

        [선택적 액션 버튼]
```

핵심:
- 화면 중앙 정렬
- 아이콘은 큰 사이즈, secondary 색
- 친근하지만 호들갑 ❌

today-meal 적용:
- 첫 진입 시 `/log` (아직 사진 없음)
- 결정 히스토리 비어있음
- 영상 미리보기 비어있음

---

## 알림 (In-app banner) — NOT 시스템 토스트

```
┌──────────────────────────────────────┐
│  [icon]  메시지 한 줄         [X]   │  ← surface-elevated + separator
└──────────────────────────────────────┘
```

핵심:
- 상단 또는 하단에서 슬라이드 in
- 자동 dismiss (3~5초) 또는 수동 X
- 색상은 destructive만 빨강, 나머지 중립

today-meal 적용: 사진 저장 성공, 결정 기록 완료 등

---

## 절대 회피해야 할 패턴 (Android·Web 잔재)

1. **Material Design FAB** — 우하단 떠있는 둥근 버튼 ❌
2. **Hamburger Menu** — 햄버거 아이콘 ❌ (탭 바 또는 시트 사용)
3. **Snackbar** — 화면 하단 어두운 토스트 ❌ (in-app banner 사용)
4. **Ripple Effect** — 클릭 시 잉크 퍼짐 ❌
5. **Card Elevation (Material)** — 진한 그림자 ❌
6. **Dialog with shadow scrim** — 가운데 떠있는 모달 ❌ (시트 사용)
