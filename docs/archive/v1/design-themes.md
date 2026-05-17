# 디자인 테마 가이드

## 현재 적용된 테마: 따뜻한 오렌지

### 컬러 팔레트
```css
/* Primary Colors */
--primary: #FF6B35;           /* 생동감 있는 오렌지 */
--primary-light: #FF8C61;     /* 밝은 오렌지 */
--primary-dark: #E55A2B;      /* 진한 오렌지 */

/* Secondary Colors */
--secondary: #F7931E;         /* 밝은 오렌지 */
--secondary-light: #FFB84D;   /* 연한 골드 */

/* Background Colors */
--bg-primary: #FFF8F0;        /* 크림색 배경 */
--bg-secondary: #FFFFFF;      /* 흰색 */
--bg-card: #FFFFFF;           /* 카드 배경 */

/* Accent Colors */
--accent: #004E89;            /* 진한 블루 (대비) */
--accent-light: #1A7FB7;      /* 밝은 블루 */

/* Text Colors */
--text-primary: #2C3E50;      /* 진한 그레이 */
--text-secondary: #7F8C8D;    /* 중간 그레이 */
--text-light: #BDC3C7;        /* 연한 그레이 */

/* Status Colors */
--success: #27AE60;           /* 성공 */
--warning: #F39C12;           /* 경고 */
--error: #E74C3C;             /* 에러 */
--info: #3498DB;              /* 정보 */
```

### Tailwind CSS 매핑
```javascript
// tailwind.config.js (필요시 사용)
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          light: '#FF8C61',
          dark: '#E55A2B',
        },
        secondary: {
          DEFAULT: '#F7931E',
          light: '#FFB84D',
        },
        accent: {
          DEFAULT: '#004E89',
          light: '#1A7FB7',
        },
        cream: '#FFF8F0',
      }
    }
  }
}
```

### 사용 예시
```html
<!-- 메인 버튼 -->
<button class="bg-[#FF6B35] hover:bg-[#E55A2B] text-white">
  추천받기
</button>

<!-- 카테고리 버튼 (선택됨) -->
<button class="bg-[#FF6B35] text-white border-[#FF6B35]">
  한식
</button>

<!-- 카테고리 버튼 (선택 안됨) -->
<button class="bg-white text-gray-700 border-gray-300 hover:border-[#FF6B35]">
  일식
</button>

<!-- 카드 -->
<div class="bg-white rounded-2xl shadow-xl">
  <span class="bg-[#FFF8F0] text-[#FF6B35]">한식</span>
</div>
```

---

## 예비 테마: 모던 블루-오렌지

### 컬러 팔레트
```css
/* Primary Colors */
--primary: #FF6B6B;           /* 코랄 레드 */
--primary-light: #FF8E8E;     /* 밝은 코랄 */
--primary-dark: #E55555;      /* 진한 코랄 */

/* Secondary Colors */
--secondary: #4ECDC4;         /* 터쿼이즈 */
--secondary-light: #7EDDD6;   /* 밝은 터쿼이즈 */
--secondary-dark: #3DBDB4;    /* 진한 터쿼이즈 */

/* Background Colors */
--bg-primary: #F7F7F7;        /* 라이트 그레이 */
--bg-secondary: #FFFFFF;      /* 흰색 */
--bg-card: #FFFFFF;           /* 카드 배경 */

/* Accent Colors */
--accent: #1A535C;            /* 진한 틸 */
--accent-light: #2D7A85;      /* 밝은 틸 */

/* Text Colors */
--text-primary: #2C3E50;      /* 진한 그레이 */
--text-secondary: #7F8C8D;    /* 중간 그레이 */
--text-light: #BDC3C7;        /* 연한 그레이 */

/* Status Colors */
--success: #4ECDC4;           /* 성공 (터쿼이즈) */
--warning: #FFE66D;           /* 경고 (옐로우) */
--error: #FF6B6B;             /* 에러 (코랄) */
--info: #4ECDC4;              /* 정보 (터쿼이즈) */
```

### Tailwind CSS 매핑
```javascript
// tailwind.config.js (필요시 사용)
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B6B',
          light: '#FF8E8E',
          dark: '#E55555',
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          light: '#7EDDD6',
          dark: '#3DBDB4',
        },
        accent: {
          DEFAULT: '#1A535C',
          light: '#2D7A85',
        },
      }
    }
  }
}
```

### 사용 예시
```html
<!-- 메인 버튼 -->
<button class="bg-[#FF6B6B] hover:bg-[#E55555] text-white">
  추천받기
</button>

<!-- 카테고리 버튼 (선택됨) -->
<button class="bg-[#4ECDC4] text-white border-[#4ECDC4]">
  한식
</button>

<!-- 카테고리 버튼 (선택 안됨) -->
<button class="bg-white text-gray-700 border-gray-300 hover:border-[#4ECDC4]">
  일식
</button>

<!-- 카드 -->
<div class="bg-white rounded-2xl shadow-xl">
  <span class="bg-[#F7F7F7] text-[#FF6B6B]">한식</span>
</div>

<!-- 히스토리 버튼 -->
<button class="bg-[#4ECDC4] hover:bg-[#3DBDB4] text-white">
  📋 히스토리
</button>
```

### 그라데이션 배경
```html
<!-- 메인 배경 (모던 블루-오렌지 테마) -->
<body class="bg-gradient-to-br from-[#F7F7F7] via-[#E8F4F8] to-[#FFE8E8]">
```

---

## 테마 전환 방법

### 1. CSS 변수 사용 (권장)
`src/css/styles.css`에 CSS 변수 정의:

```css
:root {
  /* 테마 1: 따뜻한 오렌지 */
  --primary: #FF6B35;
  --secondary: #F7931E;
  --bg-primary: #FFF8F0;
  --accent: #004E89;
}

/* 테마 2: 모던 블루-오렌지 (주석 처리) */
/*
:root {
  --primary: #FF6B6B;
  --secondary: #4ECDC4;
  --bg-primary: #F7F7F7;
  --accent: #1A535C;
}
*/
```

HTML에서 사용:
```html
<button style="background-color: var(--primary)">
  추천받기
</button>
```

### 2. Tailwind CSS 직접 사용
HTML 파일에서 색상 코드 직접 변경

### 3. JavaScript로 동적 전환 (고급)
```javascript
function switchTheme(theme) {
  const root = document.documentElement;
  if (theme === 'modern') {
    root.style.setProperty('--primary', '#FF6B6B');
    root.style.setProperty('--secondary', '#4ECDC4');
    root.style.setProperty('--bg-primary', '#F7F7F7');
    root.style.setProperty('--accent', '#1A535C');
  } else {
    root.style.setProperty('--primary', '#FF6B35');
    root.style.setProperty('--secondary', '#F7931E');
    root.style.setProperty('--bg-primary', '#FFF8F0');
    root.style.setProperty('--accent', '#004E89');
  }
}
```

---

## 디자인 원칙

### 1. 일관성
- 같은 기능은 같은 색상 사용
- 버튼 스타일 통일
- 간격과 여백 일관성 유지

### 2. 대비
- 텍스트와 배경의 명확한 대비 (WCAG AA 기준)
- 중요한 요소는 강조 색상 사용

### 3. 계층 구조
- Primary: 주요 액션 (추천받기)
- Secondary: 보조 액션 (다시 추천, 처음으로)
- Accent: 포인트 요소 (히스토리 버튼)

### 4. 접근성
- 색맹 사용자 고려
- 충분한 색상 대비
- 색상만으로 정보 전달하지 않기

---

## 참고 자료

- [Coolors.co](https://coolors.co) - 컬러 팔레트 생성
- [Adobe Color](https://color.adobe.com) - 색상 조합 도구
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - 대비 확인
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors) - Tailwind 색상 가이드
