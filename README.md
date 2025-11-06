# 오늘의밥 (Today's Meal)

식사 메뉴 선택에 어려움을 겪는 사용자들에게 맞춤형 메뉴를 추천하는 웹 애플리케이션

## 프로젝트 구조

```
today-meal/
├── docs/                          # 프로젝트 문서
│   ├── requirements.md            # 요구사항 문서
│   ├── tasks.md                   # 구현 작업 목록
│   ├── design.md                  # 전체 설계 문서
│   ├── design-phase1-*.md         # 1단계 (MVP) 설계
│   ├── design-phase2-*.md         # 2단계 (중간 모델) 설계
│   └── design-phase3-*.md         # 3단계 (최종 모델) 설계
├── src/                           # 소스 코드 (작업 진행 중 생성)
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
└── README.md                      # 이 파일

```

## 개발 단계

### 1단계: MVP (최소 기능 제품)
- 간단한 메뉴 추천 기능
- 카테고리 필터링
- 히스토리 관리 (LocalStorage)
- 정적 웹사이트 (백엔드 없음)

### 2단계: 중간 모델
- 날씨/위치 기반 추천
- 사용자 컨디션 입력
- 광고 시스템 통합
- 백엔드 API 구축

### 3단계: 최종 모델
- 가게 제휴 시스템
- 예약/주문 연동
- 사용자 계정 및 개인화
- 리뷰 시스템
- 관리자 대시보드

## 시작하기

작업 진행 상황은 `docs/tasks.md` 파일을 참고하세요.

## 기술 스택

### 1단계 (MVP)
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS (CDN)
- LocalStorage

### 2단계 이후
- Vue 3 + Vite
- Node.js + Express
- PostgreSQL (Supabase)
- OpenWeather API

## 라이선스

MIT
