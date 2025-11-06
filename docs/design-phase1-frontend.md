# 1단계 (MVP) - 프론트엔드 설계

## 기술 스택

### 옵션 1: Vanilla JavaScript (가장 빠른 시작)
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Tailwind CSS (CDN)

### 옵션 2: Vue 3 (확장성 고려)
- Vue 3 (CDN 또는 Vite)
- Tailwind CSS
- Vue Router (선택적)

**권장: 옵션 1로 시작 → 필요시 옵션 2로 전환**

## 프로젝트 구조

```
todays-meal-mvp/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── menuData.js
│   └── recommendation.js
├── assets/
│   ├── images/
│   └── icons/
└── README.md
```

## 파일별 상세 설계

### index.html

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>오늘의밥 - 메뉴 추천</title>
  <meta name="description" content="오늘 뭐 먹을지 고민되시나요? 간단하게 메뉴를 추천받으세요!">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Custom CSS -->
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-gradient-to-br from-orange-50 to-yellow-50 min-h-screen">
  
  <!-- 메인 컨테이너 -->
  <div id="app" class="container mx-auto px-4 py-8">
    
    <!-- 헤더 -->
    <header class="text-center mb-12">
      <h1 class="text-5xl font-bold text-orange-600 mb-2">오늘의밥</h1>
      <p class="text-gray-600">오늘 뭐 먹을지 고민되시나요?</p>
    </header>

    <!-- 카테고리 선택 (초기 화면) -->
    <div id="category-section" class="max-w-2xl mx-auto mb-8">
      <h2 class="text-xl font-semibold text-center mb-4">원하는 종류를 선택하세요 (선택사항)</h2>
      <div class="flex flex-wrap gap-3 justify-center">
        <!-- JavaScript로 동적 생성 -->
      </div>
    </div>

    <!-- 추천 버튼 -->
    <div class="text-center mb-8">
      <button id="recommend-btn" 
              class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-12 rounded-full text-2xl shadow-lg transform transition hover:scale-105">
        🍽️ 추천받기
      </button>
    </div>

    <!-- 결과 표시 영역 -->
    <div id="result-section" class="hidden max-w-xl mx-auto">
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div class="mb-4">
          <span id="result-category" class="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold"></span>
        </div>
        <h2 id="result-name" class="text-4xl font-bold text-gray-800 mb-4"></h2>
        <p id="result-description" class="text-gray-600 mb-6"></p>
        
        <div class="flex gap-4 justify-center">
          <button id="retry-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg">
            🔄 다시 추천
          </button>
          <button id="reset-btn" class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg">
            🏠 처음으로
          </button>
        </div>
      </div>
    </div>

    <!-- 히스토리 버튼 -->
    <div class="fixed bottom-8 right-8">
      <button id="history-btn" 
              class="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-full shadow-lg">
        📋 히스토리
      </button>
    </div>

    <!-- 히스토리 모달 -->
    <div id="history-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-bold">추천 히스토리</h3>
          <button id="close-modal" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div id="history-list" class="space-y-3 max-h-96 overflow-y-auto">
          <!-- JavaScript로 동적 생성 -->
        </div>
      </div>
    </div>

  </div>

  <!-- Scripts -->
  <script src="js/menuData.js"></script>
  <script src="js/recommendation.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

### js/menuData.js

```javascript
// 메뉴 데이터베이스
const menuDatabase = [
  // 한식
  { id: 1, name: "김치찌개", category: "한식", tags: ["따뜻한", "국물", "매운맛"], description: "얼큰한 김치찌개" },
  { id: 2, name: "된장찌개", category: "한식", tags: ["따뜻한", "국물", "구수한"], description: "구수한 된장찌개" },
  { id: 3, name: "불고기", category: "한식", tags: ["고기", "달콤한"], description: "달콤한 불고기" },
  { id: 4, name: "비빔밥", category: "한식", tags: ["건강한", "채소"], description: "영양 가득 비빔밥" },
  { id: 5, name: "삼겹살", category: "한식", tags: ["고기", "구이"], description: "고소한 삼겹살" },
  { id: 6, name: "갈비탕", category: "한식", tags: ["따뜻한", "국물", "고기"], description: "진한 갈비탕" },
  { id: 7, name: "냉면", category: "한식", tags: ["시원한", "국물", "면"], description: "시원한 냉면" },
  { id: 8, name: "김밥", category: "한식", tags: ["간편한", "채소"], description: "속이 꽉 찬 김밥" },
  { id: 9, name: "순두부찌개", category: "한식", tags: ["따뜻한", "국물", "매운맛"], description: "부드러운 순두부찌개" },
  { id: 10, name: "제육볶음", category: "한식", tags: ["매운맛", "고기"], description: "매콤한 제육볶음" },

  // 일식
  { id: 11, name: "초밥", category: "일식", tags: ["생선", "담백한"], description: "신선한 초밥" },
  { id: 12, name: "라멘", category: "일식", tags: ["따뜻한", "국물", "면"], description: "진한 국물의 라멘" },
  { id: 13, name: "돈까스", category: "일식", tags: ["튀김", "고기"], description: "바삭한 돈까스" },
  { id: 14, name: "우동", category: "일식", tags: ["따뜻한", "국물", "면"], description: "쫄깃한 우동" },
  { id: 15, name: "회덮밥", category: "일식", tags: ["생선", "밥"], description: "신선한 회덮밥" },

  // 중식
  { id: 16, name: "짜장면", category: "중식", tags: ["면", "달콤한"], description: "고소한 짜장면" },
  { id: 17, name: "짬뽕", category: "중식", tags: ["면", "매운맛", "국물"], description: "얼큰한 짬뽕" },
  { id: 18, name: "탕수육", category: "중식", tags: ["튀김", "고기", "달콤한"], description: "바삭한 탕수육" },
  { id: 19, name: "마파두부", category: "중식", tags: ["매운맛", "두부"], description: "얼얼한 마파두부" },
  { id: 20, name: "볶음밥", category: "중식", tags: ["밥", "간편한"], description: "고슬고슬 볶음밥" },

  // 양식
  { id: 21, name: "스테이크", category: "양식", tags: ["고기", "고급"], description: "육즙 가득 스테이크" },
  { id: 22, name: "파스타", category: "양식", tags: ["면", "크림"], description: "부드러운 파스타" },
  { id: 23, name: "피자", category: "양식", tags: ["치즈", "간편한"], description: "치즈 듬뿍 피자" },
  { id: 24, name: "햄버거", category: "양식", tags: ["고기", "간편한"], description: "푸짐한 햄버거" },
  { id: 25, name: "샐러드", category: "양식", tags: ["채소", "건강한"], description: "신선한 샐러드" },

  // 분식
  { id: 26, name: "떡볶이", category: "분식", tags: ["매운맛", "떡"], description: "매콤달콤 떡볶이" },
  { id: 27, name: "순대", category: "분식", tags: ["간편한"], description: "쫄깃한 순대" },
  { id: 28, name: "튀김", category: "분식", tags: ["튀김", "간편한"], description: "바삭한 튀김" },

  // 기타
  { id: 29, name: "샌드위치", category: "기타", tags: ["간편한", "빵"], description: "신선한 샌드위치" },
  { id: 30, name: "치킨", category: "기타", tags: ["튀김", "고기"], description: "바삭한 치킨" }
];

const categories = ["한식", "일식", "중식", "양식", "분식", "기타"];
```


### js/recommendation.js

```javascript
// 추천 엔진
class RecommendationEngine {
  constructor(menuDatabase) {
    this.menuDatabase = menuDatabase;
  }

  // 메뉴 추천
  getRecommendation(selectedCategories = []) {
    let filteredMenus = this.menuDatabase;

    // 카테고리 필터링
    if (selectedCategories.length > 0) {
      filteredMenus = this.menuDatabase.filter(menu =>
        selectedCategories.includes(menu.category)
      );
    }

    // 필터링 결과가 없으면 전체에서 선택
    if (filteredMenus.length === 0) {
      filteredMenus = this.menuDatabase;
    }

    // 랜덤 선택
    const randomIndex = Math.floor(Math.random() * filteredMenus.length);
    return filteredMenus[randomIndex];
  }

  // 카테고리별 메뉴 수 조회
  getMenuCountByCategory(category) {
    return this.menuDatabase.filter(menu => menu.category === category).length;
  }
}

// 히스토리 관리
class HistoryManager {
  constructor() {
    this.storageKey = 'todays-meal-history';
    this.maxHistory = 10;
  }

  // 히스토리 추가
  addToHistory(menu) {
    let history = this.getHistory();
    
    // 타임스탬프 추가
    const historyItem = {
      ...menu,
      timestamp: new Date().toISOString()
    };

    // 맨 앞에 추가
    history.unshift(historyItem);

    // 최대 개수 제한
    if (history.length > this.maxHistory) {
      history = history.slice(0, this.maxHistory);
    }

    // 저장
    this.saveHistory(history);
  }

  // 히스토리 조회
  getHistory() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  // 히스토리 저장
  saveHistory(history) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }

  // 히스토리 삭제
  clearHistory() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  // 특정 항목 삭제
  removeItem(timestamp) {
    let history = this.getHistory();
    history = history.filter(item => item.timestamp !== timestamp);
    this.saveHistory(history);
  }
}
```

### js/app.js

```javascript
// 전역 변수
let selectedCategories = [];
let recommendationEngine;
let historyManager;
let currentRecommendation = null;

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  recommendationEngine = new RecommendationEngine(menuDatabase);
  historyManager = new HistoryManager();
  
  initCategoryButtons();
  initEventListeners();
});

// 카테고리 버튼 초기화
function initCategoryButtons() {
  const categorySection = document.querySelector('#category-section .flex');
  
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'category-btn px-6 py-3 rounded-full font-semibold transition border-2';
    button.textContent = category;
    button.dataset.category = category;
    
    // 초기 스타일
    updateCategoryButtonStyle(button, false);
    
    // 클릭 이벤트
    button.addEventListener('click', () => {
      toggleCategory(category, button);
    });
    
    categorySection.appendChild(button);
  });
}

// 카테고리 토글
function toggleCategory(category, button) {
  const index = selectedCategories.indexOf(category);
  
  if (index > -1) {
    // 선택 해제
    selectedCategories.splice(index, 1);
    updateCategoryButtonStyle(button, false);
  } else {
    // 선택
    selectedCategories.push(category);
    updateCategoryButtonStyle(button, true);
  }
}

// 카테고리 버튼 스타일 업데이트
function updateCategoryButtonStyle(button, isSelected) {
  if (isSelected) {
    button.className = 'category-btn px-6 py-3 rounded-full font-semibold transition border-2 bg-orange-500 text-white border-orange-500';
  } else {
    button.className = 'category-btn px-6 py-3 rounded-full font-semibold transition border-2 bg-white text-gray-700 border-gray-300 hover:border-orange-500';
  }
}

// 이벤트 리스너 초기화
function initEventListeners() {
  // 추천 버튼
  document.getElementById('recommend-btn').addEventListener('click', showRecommendation);
  
  // 다시 추천 버튼
  document.getElementById('retry-btn').addEventListener('click', showRecommendation);
  
  // 처음으로 버튼
  document.getElementById('reset-btn').addEventListener('click', resetToHome);
  
  // 히스토리 버튼
  document.getElementById('history-btn').addEventListener('click', showHistory);
  
  // 모달 닫기
  document.getElementById('close-modal').addEventListener('click', closeHistory);
  
  // 모달 배경 클릭 시 닫기
  document.getElementById('history-modal').addEventListener('click', (e) => {
    if (e.target.id === 'history-modal') {
      closeHistory();
    }
  });
}

// 메뉴 추천 표시
function showRecommendation() {
  // 추천 받기
  currentRecommendation = recommendationEngine.getRecommendation(selectedCategories);
  
  // 히스토리에 추가
  historyManager.addToHistory(currentRecommendation);
  
  // UI 업데이트
  document.getElementById('result-category').textContent = currentRecommendation.category;
  document.getElementById('result-name').textContent = currentRecommendation.name;
  document.getElementById('result-description').textContent = currentRecommendation.description;
  
  // 화면 전환 (애니메이션)
  document.getElementById('category-section').classList.add('hidden');
  document.getElementById('recommend-btn').classList.add('hidden');
  
  const resultSection = document.getElementById('result-section');
  resultSection.classList.remove('hidden');
  resultSection.classList.add('animate-fade-in');
}

// 처음으로 돌아가기
function resetToHome() {
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('category-section').classList.remove('hidden');
  document.getElementById('recommend-btn').classList.remove('hidden');
  
  // 카테고리 선택 초기화 (선택사항)
  // selectedCategories = [];
  // document.querySelectorAll('.category-btn').forEach(btn => {
  //   updateCategoryButtonStyle(btn, false);
  // });
}

// 히스토리 표시
function showHistory() {
  const history = historyManager.getHistory();
  const historyList = document.getElementById('history-list');
  
  // 기존 내용 제거
  historyList.innerHTML = '';
  
  if (history.length === 0) {
    historyList.innerHTML = '<p class="text-gray-500 text-center py-8">아직 추천 기록이 없습니다.</p>';
  } else {
    history.forEach(item => {
      const historyItem = createHistoryItem(item);
      historyList.appendChild(historyItem);
    });
  }
  
  // 모달 표시
  document.getElementById('history-modal').classList.remove('hidden');
}

// 히스토리 항목 생성
function createHistoryItem(item) {
  const div = document.createElement('div');
  div.className = 'bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition';
  
  const date = new Date(item.timestamp);
  const timeString = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  
  div.innerHTML = `
    <div class="flex justify-between items-start">
      <div>
        <span class="inline-block bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-semibold mb-1">
          ${item.category}
        </span>
        <h4 class="font-bold text-lg">${item.name}</h4>
        <p class="text-sm text-gray-500">${timeString}</p>
      </div>
      <button class="text-gray-400 hover:text-red-500" onclick="deleteHistoryItem('${item.timestamp}')">
        🗑️
      </button>
    </div>
  `;
  
  return div;
}

// 히스토리 항목 삭제
function deleteHistoryItem(timestamp) {
  historyManager.removeItem(timestamp);
  showHistory(); // 다시 렌더링
}

// 히스토리 닫기
function closeHistory() {
  document.getElementById('history-modal').classList.add('hidden');
}
```

### css/styles.css

```css
/* 커스텀 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* 스크롤바 스타일 */
#history-list::-webkit-scrollbar {
  width: 8px;
}

#history-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

#history-list::-webkit-scrollbar-thumb {
  background: #fb923c;
  border-radius: 10px;
}

#history-list::-webkit-scrollbar-thumb:hover {
  background: #f97316;
}

/* 버튼 호버 효과 */
button {
  cursor: pointer;
  user-select: none;
}

/* 모바일 최적화 */
@media (max-width: 640px) {
  h1 {
    font-size: 2.5rem;
  }
  
  #recommend-btn {
    font-size: 1.5rem;
    padding: 1.5rem 2rem;
  }
  
  #result-name {
    font-size: 2rem;
  }
}
```

## 배포 설정

### Vercel 배포

1. GitHub 저장소 생성
2. Vercel 계정 연결
3. 프로젝트 import
4. 자동 배포 완료

**vercel.json** (선택사항):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ]
}
```

### Netlify 배포

**netlify.toml**:
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages 배포

1. 저장소 Settings → Pages
2. Source: main branch
3. 저장
4. `https://username.github.io/todays-meal` 접속

## 성능 최적화

### 1. 이미지 최적화
- WebP 포맷 사용
- 적절한 크기로 리사이징
- Lazy loading

### 2. CSS 최적화
- Tailwind CSS Purge (프로덕션)
- Critical CSS 인라인

### 3. JavaScript 최적화
- 코드 압축 (minify)
- 불필요한 코드 제거

### 4. 캐싱
```html
<!-- index.html에 추가 -->
<meta http-equiv="Cache-Control" content="max-age=31536000">
```

## 테스트 체크리스트

- [ ] 모든 카테고리 선택 가능
- [ ] 카테고리 선택 해제 가능
- [ ] 추천 버튼 클릭 시 결과 표시
- [ ] 다시 추천 시 다른 메뉴 표시 가능
- [ ] 히스토리 저장 및 표시
- [ ] 히스토리 항목 삭제
- [ ] 모바일 반응형 동작
- [ ] 브라우저 새로고침 후 히스토리 유지
- [ ] 로딩 속도 < 2초

## 브라우저 호환성

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- 모바일 브라우저 (iOS Safari, Chrome Mobile)

## 접근성 (Accessibility)

- 키보드 네비게이션 지원
- 적절한 색상 대비
- 스크린 리더 호환
- ARIA 레이블 추가 (필요시)

## 다음 단계 준비

Vue.js로 전환 시:
1. Vite 프로젝트 생성
2. 기존 로직을 Vue 컴포넌트로 변환
3. Pinia로 상태 관리
4. Vue Router 추가 (필요시)
