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
