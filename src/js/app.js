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
