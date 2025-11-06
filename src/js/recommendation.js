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
