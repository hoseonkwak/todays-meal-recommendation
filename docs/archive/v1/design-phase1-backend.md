# 1단계 (MVP) - 백엔드 설계

## 개요

**1단계에서는 백엔드가 필요하지 않습니다.**

모든 기능은 프론트엔드에서 처리되며, 데이터는 브라우저의 LocalStorage에 저장됩니다.

## 백엔드가 없는 이유

### 장점
1. **빠른 개발**: 서버 설정 불필요
2. **무료 운영**: 호스팅 비용 $0
3. **간단한 배포**: 정적 파일만 배포
4. **빠른 응답**: 서버 왕복 없음
5. **확장 용이**: 필요시 2단계에서 추가

### 제한사항
1. 사용자 데이터 동기화 불가
2. 서버 측 로직 실행 불가
3. 데이터 분석 제한적
4. 실시간 업데이트 불가

## 데이터 저장 방식

### LocalStorage 사용

```javascript
// 저장
localStorage.setItem('todays-meal-history', JSON.stringify(history));

// 조회
const history = JSON.parse(localStorage.getItem('todays-meal-history'));

// 삭제
localStorage.removeItem('todays-meal-history');
```

### 저장 용량
- 브라우저당 약 5-10MB
- 히스토리 10개 저장 시 약 1KB 미만
- 충분한 용량

### 데이터 구조

```javascript
// LocalStorage에 저장되는 데이터
{
  "todays-meal-history": [
    {
      "id": 1,
      "name": "김치찌개",
      "category": "한식",
      "tags": ["따뜻한", "국물", "매운맛"],
      "description": "얼큰한 김치찌개",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## 2단계로의 전환 시점

다음 상황이 발생하면 백엔드 도입 고려:

1. **사용자 계정 필요**: 로그인/회원가입
2. **데이터 동기화 필요**: 여러 기기에서 히스토리 공유
3. **외부 API 연동**: 날씨, 위치 정보
4. **분석 필요**: 사용자 행동 분석
5. **실시간 기능**: 인기 메뉴, 추천 트렌드

## 2단계 백엔드 준비사항

### 필요한 기술
- Node.js + Express
- PostgreSQL (Supabase)
- REST API 설계

### 마이그레이션 계획
1. 프론트엔드 코드 유지
2. API 엔드포인트 추가
3. LocalStorage → 서버 DB 전환
4. 점진적 기능 추가

## 모니터링 (1단계)

백엔드 없이도 가능한 모니터링:

### Google Analytics
```html
<!-- index.html에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 추적 가능한 지표
- 페이지 방문 수
- 사용자 수 (일일/월간)
- 추천 버튼 클릭 수
- 카테고리별 선택 빈도
- 평균 세션 시간

### 이벤트 추적

```javascript
// 추천 버튼 클릭 추적
function showRecommendation() {
  // Google Analytics 이벤트
  gtag('event', 'recommendation', {
    'event_category': 'engagement',
    'event_label': selectedCategories.join(',') || 'all'
  });
  
  // 기존 로직...
}
```

## 보안 고려사항

### 1단계에서 필요한 보안
- XSS 방지: 사용자 입력 없음 (안전)
- HTTPS 사용: Vercel/Netlify 자동 제공
- CSP 헤더 (선택사항)

### CSP 설정 (Vercel)

**vercel.json**:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.tailwindcss.com; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

## API 설계 (2단계 준비)

2단계에서 필요할 API 엔드포인트 미리 설계:

```
GET  /api/menus              # 메뉴 목록
POST /api/recommend          # 메뉴 추천
GET  /api/history/:sessionId # 히스토리 조회
POST /api/history            # 히스토리 저장
```

## 결론

1단계는 백엔드 없이 프론트엔드만으로 충분히 구현 가능합니다. 사용자 반응을 확인한 후 2단계에서 백엔드를 추가하는 것이 효율적입니다.
