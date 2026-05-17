# 오늘의밥 (Today's Meal)

식사 메뉴 선택에 어려움을 겪는 사용자들에게 맞춤형 메뉴를 추천하는 웹 애플리케이션

## 🎯 주요 기능

- 🍽️ **간단한 메뉴 추천**: 버튼 클릭 한 번으로 메뉴 추천
- 🏷️ **카테고리 필터**: 한식, 일식, 중식, 양식, 분식, 기타 중 선택
- 📋 **히스토리 관리**: 최근 추천받은 메뉴 10개 저장
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원

## 🚀 빠른 시작

### 로컬에서 실행

1. 저장소 클론
```bash
git clone https://github.com/yourusername/today-meal.git
cd today-meal
```

2. 브라우저에서 열기
```bash
# src/index.html 파일을 브라우저에서 직접 열기
# 또는 간단한 HTTP 서버 실행
npx serve src
```

3. 브라우저에서 `http://localhost:3000` 접속

### 배포

이 프로젝트는 정적 웹사이트이므로 다음 플랫폼에 쉽게 배포할 수 있습니다:

- **Vercel**: [vercel.com](https://vercel.com)
- **Netlify**: [netlify.com](https://netlify.com)
- **GitHub Pages**: Settings → Pages

## 📁 프로젝트 구조

```
today-meal/
├── docs/                          # 프로젝트 문서
│   ├── requirements.md            # 요구사항 문서
│   ├── tasks.md                   # 구현 작업 목록
│   ├── design.md                  # 전체 설계 문서
│   └── design-phase*.md           # 단계별 상세 설계
├── src/                           # 소스 코드
│   ├── index.html                 # 메인 HTML
│   ├── css/
│   │   └── styles.css             # 커스텀 스타일
│   ├── js/
│   │   ├── app.js                 # 메인 애플리케이션 로직
│   │   ├── menuData.js            # 메뉴 데이터베이스 (30개)
│   │   └── recommendation.js      # 추천 엔진 & 히스토리 관리
│   └── assets/                    # 이미지 등 정적 파일
├── .gitignore
└── README.md
```

## 🛠️ 기술 스택

### 1단계 (MVP) - 현재 버전
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS (CDN)
- LocalStorage

### 2단계 (계획 중)
- Vue 3 + Vite
- Node.js + Express
- PostgreSQL (Supabase)
- OpenWeather API

### 3단계 (계획 중)
- 가게 제휴 시스템
- 예약/주문 연동
- 사용자 계정 및 개인화
- 리뷰 시스템

## 📝 개발 로드맵

### ✅ 1단계: MVP (완료)
- [x] 간단한 메뉴 추천 기능
- [x] 카테고리 필터링
- [x] 히스토리 관리 (LocalStorage)
- [x] 반응형 디자인

### 🔄 2단계: 중간 모델 (계획 중)
- [ ] 날씨/위치 기반 추천
- [ ] 사용자 컨디션 입력
- [ ] 광고 시스템 통합
- [ ] 백엔드 API 구축

### 📅 3단계: 최종 모델 (계획 중)
- [ ] 가게 제휴 시스템
- [ ] 예약/주문 연동
- [ ] 사용자 계정 및 개인화
- [ ] 리뷰 시스템
- [ ] 관리자 대시보드

## 🤝 기여하기

기여는 언제나 환영합니다! 이슈를 열거나 Pull Request를 보내주세요.

## 📄 라이선스

MIT License

## 👤 작성자

**Kwak Hoseon**
- Email: kwakhoseon@gmail.com

## 📚 문서

자세한 문서는 `docs/` 폴더를 참고하세요:
- [요구사항 문서](docs/requirements.md)
- [작업 목록](docs/tasks.md)
- [설계 문서](docs/design.md)
