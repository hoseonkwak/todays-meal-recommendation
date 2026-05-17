# 오늘의밥 — 프로덕트 컨텍스트

> [concept.md](../docs/concept.md) Section 4~7 압축본. 기능·시나리오·로직·정보구조의 핵심만.

---

## 시간대 시나리오

진입 시 현재 시각을 자동 인식하여 헤드라인과 메뉴 풀의 무게중심을 시간대에 맞춰 조정.

| 시간대 | 헤드라인 | 메뉴 무게중심 | 디폴트 모드 |
|---|---|---|---|
| 06~10시 | 아침 뭐 먹지? | 죽, 토스트, 시리얼, 샌드위치, 해장 | Quick |
| 10~14시 (주말) | 브런치 뭐 먹지? | 브런치 메뉴 | Quick / Tournament |
| 11~14시 | 점심 뭐 먹지? | 한식·일식·중식·양식 정찬 | Quick / Tournament |
| 17~21시 | 저녁 뭐 먹지? | 정찬 + 회식/술안주 | Tournament / Slot |
| 22시~02시 | 야식 뭐 먹지? | 치킨, 라면, 떡볶이, 족발 | Quick / Slot |

---

## 결정 모드 (3종)

### Quick — 단일 추천
- 1개 메뉴 즉시 추천
- `[좋아요]` `[이거 말고]`
- "이거 말고" 5회까지 → 6회째 강제 결정 모드
- 가장 빠른 경로

### Tournament — 3-to-1 토너먼트
- 후보 3개 → A vs B → 승자 vs C → 확정
- Hick's Law: 선택 부담 분할

### Slot — 슬롯머신
- 메뉴 세로 스크롤 → `[멈춤]` 탭
- 컨텍스트 가중치 적용된 풀에서 추출 (완전 랜덤 ❌)
- 결정의 책임을 "운"으로 외부화

**공통**:
- 결과 화면 1탭 피드백 (`먹음` / `패스`)
- 카테고리 사전 필터 (선택)
- 동일 후보군 사용 (모드는 표현만 다름)

---

## 추천 로직

```
candidates = menus
  ├─ filter: 사용자 선택 카테고리 (옵션)
  ├─ exclude: 최근 N일(기본 3일) 먹은 메뉴
  ├─ exclude: 사용자 "싫어요" 등록 메뉴
  └─ weight by:
      ├─ time of day  (아침/점심/저녁/야식 적합도)
      ├─ day of week  (월~금 vs 주말)
      ├─ weather      (옵션, 위치 권한 시)
      ├─ user history (자주 좋아요한 카테고리 +α)
      └─ photo signal (사진 캡처한 메뉴 = 만족 신호)
```

**원칙**:
- 가중치는 **0.5x ~ 2x 범위에서만** 작동 (편향 방지) — 위반 시 즉시 거부
- 명시 거부 메뉴는 영구 제외 가능
- 데이터는 전부 로컬(IndexedDB). 계정은 v2.2+

---

## 식사 라이프로깅 (2차 가치)

**원칙**: 항상 옵트인. 결정 흐름 강요 금지.

### 흐름

```
[결정] → [식사] → [한 컷, 1탭] → [자동 메타 태깅]
                                    ↓
                          [하루/한 주 끝]
                                    ↓
                         [자동 영상 컴파일 푸시]
                                    ↓
                       [인스타 공유 → 워터마크 유입]
```

### 진입점

1. 결과 화면 하단 액션: `먹고 사진 찍기`
2. 시간대 자동 알림 푸시: "오늘 점심 한 컷?"
3. 홈 빠른 진입: `[빠르게 기록]`

### 캡처 UX

- `getUserMedia()` 인앱 카메라 우선, `<input capture>` 폴백
- 1탭 촬영 → 메뉴명 자동 태깅 → 저장 끝
- 메뉴 결정 없이 촬영 → 메뉴 검색/직접 입력
- 메타데이터: 시간, 위치(옵션), 메뉴, 카테고리, 시간대

### 영상 컴파일

- **v2.0**: Canvas + MediaRecorder 슬라이드쇼 (9:16 / 1:1 / 16:9)
- **v2.1**: FFmpeg.wasm 또는 서버 — 음악, 트랜지션, 필터, 템플릿
- 트리거: 하루 마감 / 주 마감 / 수동

### 공유

- Web Share API (`navigator.share({ files })`)
- 무료: 우측 하단 워터마크 (`@오늘의밥`)
- 프리미엄: 워터마크 제거 + 고급 템플릿/음악

---

## 정보 구조 (라우터)

```
/                      Home — 시간대 헤드라인, 모드 선택, 카테고리 필터
                       하단: [빠르게 기록]

/decide/quick          Quick 모드
/decide/tournament     Tournament 모드
/decide/slot           Slot 모드
/decide/result/:id     결과 + 외부 액션 슬롯 + [먹고 사진 찍기]

/capture               카메라 시트 (사전/사후 태깅)
/log                   식사 로그 — 일별 그리드
/reel                  영상 컴파일 — 미리보기, 템플릿, 공유
/reel/:id              개별 영상

/history               결정 히스토리 + 카테고리 통계
/settings              테마, 회피 기간, 위치, 알림, 데이터 초기화
```

---

## 결과 화면 외부 액션 슬롯

```
[결정된 메뉴: 김치찌개]

  🍽️ 먹고 사진 찍기  → /capture        (라이프로깅 — 잔존 엔진)
  🛒 집에서 만들기   → 쿠팡/마켓컬리   (어필리에이트 - 수익)
  🗺️ 근처 식당       → 카카오맵        (UX 가치, 수익 0)
  🛵 배달 주문       → 배민 딥링크     (UX 가치, 수익 0)
```

`ResultAction[]` 인프라로 구현. v2.0은 라우트/딥링크만, v2.1에 어필리에이트 URL 주입.

---

## 데이터 모델 핵심

```ts
type Menu = {
  id, name, category, tags,
  fitness: { time, dayOfWeek, weather }
}

type DecisionEntry = {
  menuId, timestamp, outcome, mode, mealType
}

type MealPhoto = {
  menuId?, menuName, imageBlob, thumbnailBlob,
  takenAt, location?, mealType, note?
}

type Reel = {
  range: {from, to}, photoIds, template, aspect, videoBlob?
}

type Preferences = {
  excludedMenuIds, preferredCategories, avoidanceWindowDays,
  theme, locationEnabled, notificationsEnabled,
  reelAutoGenerate, premium
}
```

상세 타입은 [concept.md Section 11](../docs/concept.md) 참조.

저장소: **IndexedDB** (v2.0부터, 사진 Blob 저장 필요). localStorage 사용 금지.
