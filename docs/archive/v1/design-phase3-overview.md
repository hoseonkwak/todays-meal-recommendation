# 3단계 (최종 모델) - 전체 개요

## 개요

3단계는 완전한 비즈니스 플랫폼으로, 사용자 계정, 가게 제휴, 예약/주문, 수익 분석 등 모든 기능을 포함합니다.

## 주요 변경사항

### 프론트엔드
- Vue 3 → Nuxt 3 (SSR/SSG)
- JavaScript → TypeScript
- 더 복잡한 상태 관리
- 관리자 대시보드 추가

### 백엔드
- Express → NestJS (선택적)
- Prisma ORM 도입
- Redis 캐싱
- 마이크로서비스 고려

### 데이터베이스
- PostgreSQL (AWS RDS 또는 Supabase Pro)
- Redis (Upstash)
- 복잡한 관계형 데이터

### 인프라
- 유료 호스팅 (Vercel Pro, AWS)
- CDN (Cloudflare)
- 모니터링 (Sentry, DataDog)

## 핵심 기능

### 1. 사용자 계정
- 이메일/소셜 로그인 (Supabase Auth)
- 프로필 관리
- 선호도 저장
- 히스토리 동기화

### 2. 가게 제휴
- 가게 등록 및 관리
- 위치 기반 검색 (PostGIS)
- 메뉴-가게 연결
- 영업 시간, 평점 관리

### 3. 예약/주문
- 가게 예약 시스템
- 배달 주문 연동
- 수수료 계산 및 기록
- 알림 (이메일/SMS)

### 4. 리뷰 시스템
- 메뉴/가게 리뷰
- 별점 평가
- 리뷰 신고 기능
- 평균 평점 계산

### 5. 관리자 대시보드
- 사용자 통계
- 수익 분석
- 가게 관리
- 메뉴 관리

## 기술 스택 상세

### 프론트엔드
```
- Nuxt 3
- TypeScript
- Tailwind CSS + Nuxt UI
- Pinia
- VueUse
- Chart.js (대시보드)
```

### 백엔드
```
- Node.js + TypeScript
- NestJS (또는 Express)
- Prisma ORM
- JWT 인증
- Redis
- Bull (작업 큐)
```

### 데이터베이스
```
- PostgreSQL 14+
- Redis 7+
- PostGIS (위치 검색)
```

### 외부 서비스
```
- Supabase Auth (인증)
- Google Maps API (지도)
- SendGrid (이메일)
- Twilio (SMS, 선택적)
- Stripe (결제, 향후)
- Cloudinary (이미지)
```

## 데이터베이스 스키마 (주요 테이블)

```sql
-- 사용자
users (id, email, name, profile_image, created_at)
user_preferences (user_id, disliked_menus, dietary_restrictions)

-- 가게
partner_restaurants (id, name, address, lat, lon, rating, commission_rate)
restaurant_menus (restaurant_id, menu_id, price, is_available)

-- 예약/주문
reservations (id, user_id, restaurant_id, time, status, commission)
orders (id, user_id, restaurant_id, total, commission, status)

-- 리뷰
reviews (id, user_id, menu_id, restaurant_id, rating, comment)

-- 분석
ad_revenue (date, impressions, clicks, revenue)
```

## API 엔드포인트 (추가)

```
# 인증
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

# 사용자
GET    /api/users/preferences
PUT    /api/users/preferences
GET    /api/users/history

# 가게
GET    /api/restaurants
GET    /api/restaurants/:id
POST   /api/restaurants/:id/reserve
POST   /api/restaurants/:id/order

# 리뷰
POST   /api/reviews
PUT    /api/reviews/:id
DELETE /api/reviews/:id

# 관리자
GET    /api/admin/dashboard
GET    /api/admin/revenue
GET    /api/admin/users
POST   /api/admin/menus
```

## 고급 추천 알고리즘

### 협업 필터링
- 유사한 사용자 찾기
- 선호도 패턴 분석
- 추천 정확도 향상

### 개인화
- 사용자 히스토리 분석
- 싫어하는 메뉴 제외
- 시간대별 선호도

### 다양성 보장
- 최근 추천과 중복 방지
- Exploration vs Exploitation (90:10)

## 성능 최적화

### 캐싱 전략
```
- 메뉴 목록: 1시간
- 사용자 프로필: 30분
- 날씨: 10분
- 가게 목록: 30분
- 인기 메뉴: 2시간
```

### 데이터베이스 최적화
- Connection pooling
- 쿼리 최적화 (JOIN, INDEX)
- Read replica 사용

### CDN
- 정적 파일 캐싱
- 이미지 최적화
- 지역별 배포

## 보안

### 인증/권한
- JWT 토큰
- Refresh token
- Role-based access control

### 데이터 보호
- HTTPS 강제
- SQL Injection 방지
- XSS 방지
- CSRF 토큰

### Rate Limiting
- API별 제한
- IP 기반 제한
- 사용자별 제한

## 모니터링 및 로깅

### 에러 추적
- Sentry 통합
- 실시간 알림

### 성능 모니터링
- API 응답 시간
- 데이터베이스 쿼리 시간
- 메모리 사용량

### 사용자 분석
- Google Analytics
- 사용자 행동 추적
- 전환율 분석

## 배포 전략

### CI/CD
- GitHub Actions
- 자동 테스트
- 자동 배포

### 환경 분리
- Development
- Staging
- Production

### 롤백 전략
- Blue-Green 배포
- 버전 관리
- 빠른 롤백

## 비용 예측

### 초기 (1000 DAU)
- Vercel Pro: $20/월
- AWS/Railway: $20/월
- PostgreSQL: $15/월
- Redis: $10/월
- 외부 API: $20/월
- **총: $85/월**

### 성장 (5000 DAU)
- 서버: $100/월
- 데이터베이스: $50/월
- CDN: $30/월
- 외부 API: $50/월
- 모니터링: $20/월
- **총: $250/월**

### 대규모 (10000+ DAU)
- 서버 스케일업: $300/월
- 데이터베이스: $150/월
- CDN: $100/월
- 외부 API: $150/월
- 모니터링: $50/월
- **총: $750/월**

## 수익 모델

### 광고 수익
- Google AdSense
- 예상: $0.5-2 per 1000 impressions

### 제휴 수수료
- 예약: 건당 5-10%
- 주문: 건당 10-15%

### 프리미엄 기능 (향후)
- 광고 제거
- 고급 추천
- 우선 예약

## 개발 로드맵

### Phase 3.1 (1-2개월)
- 사용자 인증 구현
- 프로필 관리
- 선호도 저장

### Phase 3.2 (2-3개월)
- 가게 제휴 시스템
- 위치 기반 검색
- 가게 상세 페이지

### Phase 3.3 (1-2개월)
- 예약/주문 기능
- 알림 시스템
- 수수료 계산

### Phase 3.4 (1-2개월)
- 리뷰 시스템
- 평점 관리
- 신고 기능

### Phase 3.5 (1개월)
- 관리자 대시보드
- 수익 분석
- 통계 리포트

## 테스트 전략

### 단위 테스트
- Jest (백엔드)
- Vitest (프론트엔드)
- 커버리지 80% 이상

### 통합 테스트
- API 테스트
- 데이터베이스 테스트

### E2E 테스트
- Playwright
- 주요 사용자 플로우

### 성능 테스트
- Load testing (k6)
- Stress testing

## 확장성 고려

### 수평 확장
- Load balancer
- 여러 API 서버
- Read replica

### 마이크로서비스 (장기)
- 추천 서비스
- 사용자 서비스
- 가게 서비스
- 주문 서비스
- 분석 서비스

## 다음 단계

3단계 완료 후:
- 모바일 앱 개발 (React Native / Flutter)
- AI 기반 추천 고도화
- 해외 진출
- 프랜차이즈 확장
