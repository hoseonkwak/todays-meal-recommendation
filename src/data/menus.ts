import type { Menu } from '@/types'

/**
 * 메뉴 데이터베이스
 * - 작성 가이드: templates/menu-data-schema.md
 * - fitness 값은 0.5 ~ 2.0 범위 강제 (추천 엔진이 거부)
 * - 정렬: 카테고리별 그룹화, 같은 카테고리 내 가나다순
 */
export const menus: Menu[] = [
  // ─── 한식 (30) ───────────────────────────────────────
  {
    id: 'galbi-tang',
    name: '갈비탕',
    category: '한식',
    tags: ['따뜻한', '국물', '고기', '담백한'],
    fitness: {
      time: { breakfast: 1.0, brunch: 0.9, lunch: 1.6, dinner: 1.5, latenight: 1.0 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.7, hot: 0.7, rainy: 1.3 },
    },
  },
  {
    id: 'gamja-tang',
    name: '감자탕',
    category: '한식',
    tags: ['따뜻한', '국물', '돼지', '매운맛'],
    fitness: {
      time: { breakfast: 0.7, brunch: 0.7, lunch: 1.4, dinner: 1.6, latenight: 1.4 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.7, hot: 0.7, rainy: 1.4 },
    },
  },
  {
    id: 'gopchang-jeongol',
    name: '곱창전골',
    category: '한식',
    tags: ['따뜻한', '국물', '소고기', '매운맛'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.6, lunch: 1.0, dinner: 1.7, latenight: 1.5 },
      dayOfWeek: { weekday: 1.0, weekend: 1.3 },
      weather: { cold: 1.7, hot: 0.7, rainy: 1.3 },
    },
  },
  {
    id: 'gimbap',
    name: '김밥',
    category: '한식',
    tags: ['간편', '채소', '밥'],
    fitness: {
      time: { breakfast: 1.4, brunch: 1.3, lunch: 1.5, dinner: 1.0, latenight: 1.0 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'kimchi-bokkeumbap',
    name: '김치볶음밥',
    category: '한식',
    tags: ['매운맛', '밥'],
    fitness: {
      time: { breakfast: 1.0, brunch: 1.0, lunch: 1.5, dinner: 1.3, latenight: 1.0 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.2, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'kimchi-jeon',
    name: '김치전',
    category: '한식',
    tags: ['매운맛', '구수한', '채소', '간편'],
    fitness: {
      time: { breakfast: 0.6, brunch: 1.0, lunch: 1.3, dinner: 1.4, latenight: 1.2 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.2, hot: 0.9, rainy: 1.9 },
    },
  },
  {
    id: 'kimchi-jjigae',
    name: '김치찌개',
    category: '한식',
    tags: ['따뜻한', '국물', '매운맛', '돼지'],
    fitness: {
      time: { breakfast: 0.8, brunch: 0.9, lunch: 1.6, dinner: 1.6, latenight: 1.0 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.8, hot: 0.7, rainy: 1.4 },
    },
  },
  {
    id: 'naengmyeon',
    name: '냉면',
    category: '한식',
    tags: ['시원한', '국물', '면', '새콤한'],
    fitness: {
      time: { breakfast: 0.6, brunch: 1.3, lunch: 1.7, dinner: 1.2, latenight: 0.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 0.5, hot: 1.9, rainy: 0.8 },
    },
  },
  {
    id: 'nurungji',
    name: '누룽지',
    category: '한식',
    tags: ['따뜻한', '담백한', '죽'],
    fitness: {
      time: { breakfast: 1.7, brunch: 1.0, lunch: 0.9, dinner: 0.8, latenight: 0.7 },
      dayOfWeek: { weekday: 1.1, weekend: 1.0 },
      weather: { cold: 1.4, hot: 0.9, rainy: 1.0 },
    },
  },
  {
    id: 'dak-galbi',
    name: '닭갈비',
    category: '한식',
    tags: ['매운맛', '닭', '구이'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.7, lunch: 1.3, dinner: 1.7, latenight: 1.4 },
      dayOfWeek: { weekday: 1.0, weekend: 1.3 },
      weather: { cold: 1.3, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'danhobak-juk',
    name: '단호박죽',
    category: '한식',
    tags: ['따뜻한', '담백한', '죽', '달콤한'],
    fitness: {
      time: { breakfast: 1.6, brunch: 1.2, lunch: 0.9, dinner: 0.8, latenight: 0.7 },
      dayOfWeek: { weekday: 1.1, weekend: 1.0 },
      weather: { cold: 1.4, hot: 0.9, rainy: 1.0 },
    },
  },
  {
    id: 'doenjang-jjigae',
    name: '된장찌개',
    category: '한식',
    tags: ['따뜻한', '국물', '구수한', '채소'],
    fitness: {
      time: { breakfast: 0.9, brunch: 1.0, lunch: 1.6, dinner: 1.5, latenight: 0.9 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.6, hot: 0.8, rainy: 1.3 },
    },
  },
  {
    id: 'tteokguk',
    name: '떡국',
    category: '한식',
    tags: ['따뜻한', '국물', '떡', '담백한'],
    fitness: {
      time: { breakfast: 1.6, brunch: 1.4, lunch: 1.5, dinner: 1.0, latenight: 0.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 1.7, hot: 0.7, rainy: 1.2 },
    },
  },
  {
    id: 'mandu-guk',
    name: '만두국',
    category: '한식',
    tags: ['따뜻한', '국물', '만두'],
    fitness: {
      time: { breakfast: 1.5, brunch: 1.4, lunch: 1.5, dinner: 1.0, latenight: 0.8 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 1.7, hot: 0.7, rainy: 1.2 },
    },
  },
  {
    id: 'miyeok-guk',
    name: '미역국',
    category: '한식',
    tags: ['따뜻한', '국물', '해산물', '담백한'],
    fitness: {
      time: { breakfast: 1.6, brunch: 1.2, lunch: 1.5, dinner: 1.0, latenight: 0.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 1.5, hot: 0.9, rainy: 1.0 },
    },
  },
  {
    id: 'baekban',
    name: '백반',
    category: '한식',
    tags: ['든든', '밥', '채소'],
    fitness: {
      time: { breakfast: 1.0, brunch: 1.0, lunch: 1.7, dinner: 1.5, latenight: 0.7 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.2, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'bossam',
    name: '보쌈',
    category: '한식',
    tags: ['고기', '돼지', '캐주얼'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.7, lunch: 1.0, dinner: 1.6, latenight: 1.5 },
      dayOfWeek: { weekday: 1.0, weekend: 1.3 },
      weather: { cold: 1.2, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'budae-jjigae',
    name: '부대찌개',
    category: '한식',
    tags: ['따뜻한', '국물', '매운맛', '진한'],
    fitness: {
      time: { breakfast: 0.6, brunch: 0.7, lunch: 1.6, dinner: 1.6, latenight: 1.2 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.7, hot: 0.7, rainy: 1.4 },
    },
  },
  {
    id: 'bulgogi',
    name: '불고기',
    category: '한식',
    tags: ['고기', '소고기', '달콤한'],
    fitness: {
      time: { breakfast: 0.7, brunch: 0.9, lunch: 1.5, dinner: 1.5, latenight: 0.9 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.2, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'bibimbap',
    name: '비빔밥',
    category: '한식',
    tags: ['건강한', '채소', '밥', '매운맛'],
    fitness: {
      time: { breakfast: 0.9, brunch: 1.2, lunch: 1.7, dinner: 1.3, latenight: 0.7 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.0, hot: 1.2, rainy: 1.0 },
    },
  },
  {
    id: 'samgyeopsal',
    name: '삼겹살',
    category: '한식',
    tags: ['고기', '돼지', '구이', '캐주얼'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.6, lunch: 1.0, dinner: 1.7, latenight: 1.4 },
      dayOfWeek: { weekday: 0.9, weekend: 1.4 },
      weather: { cold: 1.2, hot: 0.9, rainy: 1.0 },
    },
  },
  {
    id: 'samgyetang',
    name: '삼계탕',
    category: '한식',
    tags: ['따뜻한', '국물', '닭', '담백한'],
    fitness: {
      time: { breakfast: 0.9, brunch: 1.0, lunch: 1.6, dinner: 1.4, latenight: 0.7 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.4, hot: 1.7, rainy: 1.0 },
    },
  },
  {
    id: 'seolleongtang',
    name: '설렁탕',
    category: '한식',
    tags: ['따뜻한', '국물', '소고기', '담백한'],
    fitness: {
      time: { breakfast: 1.5, brunch: 1.3, lunch: 1.6, dinner: 1.2, latenight: 0.9 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.7, hot: 0.8, rainy: 1.3 },
    },
  },
  {
    id: 'sundubu-jjigae',
    name: '순두부찌개',
    category: '한식',
    tags: ['따뜻한', '국물', '매운맛', '두부'],
    fitness: {
      time: { breakfast: 1.4, brunch: 1.3, lunch: 1.6, dinner: 1.3, latenight: 0.9 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.6, hot: 0.8, rainy: 1.3 },
    },
  },
  {
    id: 'sundae',
    name: '순대',
    category: '한식',
    tags: ['간편', '돼지'],
    fitness: {
      time: { breakfast: 0.6, brunch: 0.8, lunch: 1.2, dinner: 1.0, latenight: 1.6 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'yukgaejang',
    name: '육개장',
    category: '한식',
    tags: ['따뜻한', '국물', '매운맛', '소고기'],
    fitness: {
      time: { breakfast: 0.9, brunch: 1.0, lunch: 1.6, dinner: 1.4, latenight: 0.9 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.7, hot: 0.7, rainy: 1.4 },
    },
  },
  {
    id: 'japchae',
    name: '잡채',
    category: '한식',
    tags: ['면', '채소', '달콤한'],
    fitness: {
      time: { breakfast: 0.7, brunch: 1.0, lunch: 1.3, dinner: 1.3, latenight: 0.8 },
      dayOfWeek: { weekday: 1.0, weekend: 1.1 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'jeonbok-juk',
    name: '전복죽',
    category: '한식',
    tags: ['따뜻한', '담백한', '죽', '해산물'],
    fitness: {
      time: { breakfast: 1.8, brunch: 1.4, lunch: 1.0, dinner: 0.9, latenight: 0.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 1.5, hot: 1.0, rainy: 1.2 },
    },
  },
  {
    id: 'jeyuk-bokkeum',
    name: '제육볶음',
    category: '한식',
    tags: ['매운맛', '돼지', '볶음'],
    fitness: {
      time: { breakfast: 0.6, brunch: 0.8, lunch: 1.6, dinner: 1.4, latenight: 1.0 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.2, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'kongguksu',
    name: '콩국수',
    category: '한식',
    tags: ['시원한', '면', '담백한'],
    fitness: {
      time: { breakfast: 0.7, brunch: 1.4, lunch: 1.7, dinner: 1.2, latenight: 0.6 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 0.5, hot: 1.9, rainy: 0.7 },
    },
  },
  {
    id: 'kongnamul-gukbap',
    name: '콩나물국밥',
    category: '한식',
    tags: ['따뜻한', '국물', '해장', '담백한'],
    fitness: {
      time: { breakfast: 1.8, brunch: 1.3, lunch: 1.3, dinner: 0.9, latenight: 0.7 },
      dayOfWeek: { weekday: 1.1, weekend: 1.0 },
      weather: { cold: 1.5, hot: 0.9, rainy: 1.2 },
    },
  },

  // ─── 일식 (11) ───────────────────────────────────────
  {
    id: 'katsudon',
    name: '가츠동',
    category: '일식',
    tags: ['튀김', '돼지', '밥'],
    fitness: {
      time: { breakfast: 0.7, brunch: 1.0, lunch: 1.6, dinner: 1.3, latenight: 0.9 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.1, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'gyudon',
    name: '규동',
    category: '일식',
    tags: ['소고기', '밥'],
    fitness: {
      time: { breakfast: 0.7, brunch: 1.0, lunch: 1.6, dinner: 1.3, latenight: 0.9 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.1, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'donkatsu',
    name: '돈가스',
    category: '일식',
    tags: ['튀김', '돼지'],
    fitness: {
      time: { breakfast: 0.6, brunch: 0.9, lunch: 1.6, dinner: 1.4, latenight: 1.0 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.1, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'ramen',
    name: '라멘',
    category: '일식',
    tags: ['따뜻한', '국물', '면', '진한'],
    fitness: {
      time: { breakfast: 0.7, brunch: 1.0, lunch: 1.5, dinner: 1.5, latenight: 1.6 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.7, hot: 0.8, rainy: 1.4 },
    },
  },
  {
    id: 'sashimi',
    name: '사시미',
    category: '일식',
    tags: ['생선', '담백한', '회'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.7, lunch: 1.0, dinner: 1.6, latenight: 0.7 },
      dayOfWeek: { weekday: 0.9, weekend: 1.3 },
      weather: { cold: 0.8, hot: 1.2, rainy: 0.9 },
    },
  },
  {
    id: 'soba',
    name: '소바',
    category: '일식',
    tags: ['면', '담백한', '시원한'],
    fitness: {
      time: { breakfast: 0.9, brunch: 1.3, lunch: 1.5, dinner: 1.0, latenight: 0.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 0.6, hot: 1.7, rainy: 0.9 },
    },
  },
  {
    id: 'sushi',
    name: '스시',
    category: '일식',
    tags: ['생선', '담백한', '밥', '회'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.8, lunch: 1.4, dinner: 1.6, latenight: 0.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.3 },
      weather: { cold: 0.9, hot: 1.2, rainy: 0.9 },
    },
  },
  {
    id: 'yakisoba',
    name: '야끼소바',
    category: '일식',
    tags: ['면', '볶음'],
    fitness: {
      time: { breakfast: 0.6, brunch: 0.8, lunch: 1.2, dinner: 1.4, latenight: 1.5 },
      dayOfWeek: { weekday: 1.0, weekend: 1.1 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'omurice',
    name: '오므라이스',
    category: '일식',
    tags: ['밥', '계란', '달콤한'],
    fitness: {
      time: { breakfast: 0.9, brunch: 1.5, lunch: 1.5, dinner: 1.0, latenight: 0.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'udon',
    name: '우동',
    category: '일식',
    tags: ['따뜻한', '국물', '면', '담백한'],
    fitness: {
      time: { breakfast: 1.0, brunch: 1.2, lunch: 1.5, dinner: 1.3, latenight: 1.0 },
      dayOfWeek: { weekday: 1.1, weekend: 1.0 },
      weather: { cold: 1.7, hot: 0.8, rainy: 1.4 },
    },
  },
  {
    id: 'hoe-deopbap',
    name: '회덮밥',
    category: '일식',
    tags: ['생선', '밥', '회', '담백한'],
    fitness: {
      time: { breakfast: 0.6, brunch: 0.9, lunch: 1.6, dinner: 1.3, latenight: 0.6 },
      dayOfWeek: { weekday: 1.1, weekend: 1.0 },
      weather: { cold: 0.7, hot: 1.4, rainy: 0.9 },
    },
  },

  // ─── 중식 (9) ────────────────────────────────────────
  {
    id: 'kkanpunggi',
    name: '깐풍기',
    category: '중식',
    tags: ['튀김', '닭', '매운맛'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.7, lunch: 1.2, dinner: 1.5, latenight: 1.0 },
      dayOfWeek: { weekday: 0.9, weekend: 1.2 },
      weather: { cold: 1.1, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'malatang',
    name: '마라탕',
    category: '중식',
    tags: ['따뜻한', '국물', '매운맛', '진한'],
    fitness: {
      time: { breakfast: 0.6, brunch: 0.8, lunch: 1.4, dinner: 1.5, latenight: 1.5 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.7, hot: 0.8, rainy: 1.4 },
    },
  },
  {
    id: 'mapa-dubu',
    name: '마파두부',
    category: '중식',
    tags: ['매운맛', '두부'],
    fitness: {
      time: { breakfast: 0.7, brunch: 0.9, lunch: 1.4, dinner: 1.3, latenight: 0.9 },
      dayOfWeek: { weekday: 1.1, weekend: 1.0 },
      weather: { cold: 1.3, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'chinese-fried-rice',
    name: '볶음밥',
    category: '중식',
    tags: ['밥', '간편', '볶음'],
    fitness: {
      time: { breakfast: 0.9, brunch: 1.0, lunch: 1.4, dinner: 1.2, latenight: 0.9 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'yangjangpi',
    name: '양장피',
    category: '중식',
    tags: ['채소', '해산물', '담백한'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.7, lunch: 1.0, dinner: 1.5, latenight: 0.7 },
      dayOfWeek: { weekday: 0.9, weekend: 1.3 },
      weather: { cold: 0.9, hot: 1.2, rainy: 1.0 },
    },
  },
  {
    id: 'jajangmyeon',
    name: '짜장면',
    category: '중식',
    tags: ['면', '달콤한', '진한'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.7, lunch: 1.6, dinner: 1.2, latenight: 0.7 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.1, hot: 1.0, rainy: 1.2 },
    },
  },
  {
    id: 'jjamppong',
    name: '짬뽕',
    category: '중식',
    tags: ['따뜻한', '국물', '면', '매운맛', '해산물'],
    fitness: {
      time: { breakfast: 0.6, brunch: 0.8, lunch: 1.7, dinner: 1.3, latenight: 1.0 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.7, hot: 0.8, rainy: 1.5 },
    },
  },
  {
    id: 'tangsuyuk',
    name: '탕수육',
    category: '중식',
    tags: ['튀김', '달콤한', '돼지'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.7, lunch: 1.3, dinner: 1.5, latenight: 1.0 },
      dayOfWeek: { weekday: 0.9, weekend: 1.4 },
      weather: { cold: 1.1, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'palbochae',
    name: '팔보채',
    category: '중식',
    tags: ['해산물', '채소'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.7, lunch: 1.0, dinner: 1.5, latenight: 0.7 },
      dayOfWeek: { weekday: 0.9, weekend: 1.3 },
      weather: { cold: 0.9, hot: 1.0, rainy: 1.0 },
    },
  },

  // ─── 양식 (14) ───────────────────────────────────────
  {
    id: 'carbonara',
    name: '까르보나라',
    category: '양식',
    tags: ['면', '크림', '진한', '치즈'],
    fitness: {
      time: { breakfast: 0.6, brunch: 1.3, lunch: 1.5, dinner: 1.4, latenight: 0.9 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.3, hot: 0.9, rainy: 1.0 },
    },
  },
  {
    id: 'lasagna',
    name: '라자냐',
    category: '양식',
    tags: ['치즈', '진한'],
    fitness: {
      time: { breakfast: 0.5, brunch: 1.0, lunch: 1.3, dinner: 1.5, latenight: 0.8 },
      dayOfWeek: { weekday: 0.9, weekend: 1.3 },
      weather: { cold: 1.3, hot: 0.9, rainy: 1.0 },
    },
  },
  {
    id: 'risotto',
    name: '리조또',
    category: '양식',
    tags: ['밥', '크림', '치즈'],
    fitness: {
      time: { breakfast: 0.6, brunch: 1.2, lunch: 1.4, dinner: 1.4, latenight: 0.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.4, hot: 0.9, rainy: 1.0 },
    },
  },
  {
    id: 'bagel',
    name: '베이글',
    category: '양식',
    tags: ['빵', '간편', '담백한'],
    fitness: {
      time: { breakfast: 1.7, brunch: 1.5, lunch: 1.1, dinner: 0.8, latenight: 0.7 },
      dayOfWeek: { weekday: 1.2, weekend: 1.1 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'vongole-pasta',
    name: '봉골레파스타',
    category: '양식',
    tags: ['면', '해산물', '깔끔한'],
    fitness: {
      time: { breakfast: 0.6, brunch: 1.2, lunch: 1.5, dinner: 1.4, latenight: 0.8 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 0.9, hot: 1.2, rainy: 0.9 },
    },
  },
  {
    id: 'salad',
    name: '샐러드',
    category: '양식',
    tags: ['채소', '건강한', '다이어트', '시원한'],
    fitness: {
      time: { breakfast: 1.2, brunch: 1.5, lunch: 1.5, dinner: 1.0, latenight: 0.5 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 0.7, hot: 1.7, rainy: 0.8 },
    },
  },
  {
    id: 'sandwich',
    name: '샌드위치',
    category: '양식',
    tags: ['빵', '간편', '채소'],
    fitness: {
      time: { breakfast: 1.6, brunch: 1.5, lunch: 1.5, dinner: 0.8, latenight: 0.8 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 0.9, hot: 1.2, rainy: 1.0 },
    },
  },
  {
    id: 'steak',
    name: '스테이크',
    category: '양식',
    tags: ['고기', '소고기', '고급', '구이'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.7, lunch: 1.0, dinner: 1.8, latenight: 0.7 },
      dayOfWeek: { weekday: 0.8, weekend: 1.6 },
      weather: { cold: 1.2, hot: 0.9, rainy: 1.0 },
    },
  },
  {
    id: 'aglio-e-olio',
    name: '알리오올리오',
    category: '양식',
    tags: ['면', '깔끔한'],
    fitness: {
      time: { breakfast: 0.6, brunch: 1.2, lunch: 1.5, dinner: 1.4, latenight: 0.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.0, hot: 1.2, rainy: 1.0 },
    },
  },
  {
    id: 'omelet',
    name: '오믈렛',
    category: '양식',
    tags: ['계란', '담백한'],
    fitness: {
      time: { breakfast: 1.8, brunch: 1.6, lunch: 1.0, dinner: 0.8, latenight: 0.6 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'tomato-pasta',
    name: '토마토파스타',
    category: '양식',
    tags: ['면', '새콤한', '진한'],
    fitness: {
      time: { breakfast: 0.6, brunch: 1.2, lunch: 1.5, dinner: 1.4, latenight: 0.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.0, hot: 1.2, rainy: 1.0 },
    },
  },
  {
    id: 'pancake',
    name: '팬케이크',
    category: '양식',
    tags: ['빵', '달콤한'],
    fitness: {
      time: { breakfast: 1.7, brunch: 1.7, lunch: 0.9, dinner: 0.7, latenight: 0.7 },
      dayOfWeek: { weekday: 0.9, weekend: 1.4 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'pizza',
    name: '피자',
    category: '양식',
    tags: ['치즈', '빵'],
    fitness: {
      time: { breakfast: 0.5, brunch: 1.0, lunch: 1.4, dinner: 1.5, latenight: 1.5 },
      dayOfWeek: { weekday: 1.0, weekend: 1.4 },
      weather: { cold: 1.1, hot: 0.9, rainy: 1.2 },
    },
  },
  {
    id: 'hamburger',
    name: '햄버거',
    category: '양식',
    tags: ['고기', '빵', '간편'],
    fitness: {
      time: { breakfast: 0.7, brunch: 1.2, lunch: 1.5, dinner: 1.3, latenight: 1.4 },
      dayOfWeek: { weekday: 1.2, weekend: 1.1 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },

  // ─── 분식 (10) ───────────────────────────────────────
  {
    id: 'kim-tteok-sun',
    name: '김떡순',
    category: '분식',
    tags: ['매운맛', '떡', '간편'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.9, lunch: 1.4, dinner: 1.2, latenight: 1.5 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.1 },
    },
  },
  {
    id: 'tteokbokki',
    name: '떡볶이',
    category: '분식',
    tags: ['매운맛', '떡', '달콤한'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.9, lunch: 1.4, dinner: 1.2, latenight: 1.6 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.2, hot: 0.9, rainy: 1.2 },
    },
  },
  {
    id: 'ramyeon',
    name: '라면',
    category: '분식',
    tags: ['따뜻한', '국물', '면', '매운맛', '간편'],
    fitness: {
      time: { breakfast: 1.0, brunch: 1.0, lunch: 1.4, dinner: 1.0, latenight: 1.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 1.5, hot: 0.8, rainy: 1.5 },
    },
  },
  {
    id: 'rabokki',
    name: '라볶이',
    category: '분식',
    tags: ['매운맛', '떡', '면'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.8, lunch: 1.3, dinner: 1.2, latenight: 1.6 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 1.2, hot: 0.9, rainy: 1.2 },
    },
  },
  {
    id: 'mandu',
    name: '만두',
    category: '분식',
    tags: ['간편'],
    fitness: {
      time: { breakfast: 0.9, brunch: 1.0, lunch: 1.3, dinner: 1.1, latenight: 1.4 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 1.2, hot: 0.9, rainy: 1.0 },
    },
  },
  {
    id: 'eomuk',
    name: '어묵',
    category: '분식',
    tags: ['따뜻한', '국물', '간편'],
    fitness: {
      time: { breakfast: 0.9, brunch: 1.0, lunch: 1.0, dinner: 1.0, latenight: 1.5 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 1.7, hot: 0.7, rainy: 1.4 },
    },
  },
  {
    id: 'cup-ramyeon',
    name: '컵라면',
    category: '분식',
    tags: ['면', '간편', '매운맛'],
    fitness: {
      time: { breakfast: 1.3, brunch: 1.0, lunch: 1.2, dinner: 0.9, latenight: 1.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 1.4, hot: 0.8, rainy: 1.3 },
    },
  },
  {
    id: 'toast',
    name: '토스트',
    category: '분식',
    tags: ['빵', '간편', '계란'],
    fitness: {
      time: { breakfast: 1.8, brunch: 1.4, lunch: 1.0, dinner: 0.7, latenight: 0.7 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'twigim',
    name: '튀김',
    category: '분식',
    tags: ['튀김', '간편'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.8, lunch: 1.2, dinner: 1.2, latenight: 1.5 },
      dayOfWeek: { weekday: 1.0, weekend: 1.1 },
      weather: { cold: 1.0, hot: 0.9, rainy: 1.2 },
    },
  },
  {
    id: 'hot-bar',
    name: '핫바',
    category: '분식',
    tags: ['간편'],
    fitness: {
      time: { breakfast: 0.7, brunch: 0.9, lunch: 1.0, dinner: 1.0, latenight: 1.4 },
      dayOfWeek: { weekday: 1.0, weekend: 1.0 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },

  // ─── 아시안 (6) ──────────────────────────────────────
  {
    id: 'nasi-goreng',
    name: '나시고랭',
    category: '아시안',
    tags: ['밥', '볶음', '매운맛'],
    fitness: {
      time: { breakfast: 0.7, brunch: 1.0, lunch: 1.4, dinner: 1.3, latenight: 0.9 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.0, hot: 1.2, rainy: 1.0 },
    },
  },
  {
    id: 'bun-cha',
    name: '분짜',
    category: '아시안',
    tags: ['면', '채소', '새콤한', '시원한'],
    fitness: {
      time: { breakfast: 0.7, brunch: 1.4, lunch: 1.5, dinner: 1.2, latenight: 0.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 0.8, hot: 1.5, rainy: 0.9 },
    },
  },
  {
    id: 'pho',
    name: '쌀국수',
    category: '아시안',
    tags: ['따뜻한', '국물', '면', '담백한'],
    fitness: {
      time: { breakfast: 1.5, brunch: 1.3, lunch: 1.6, dinner: 1.3, latenight: 0.9 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.5, hot: 1.1, rainy: 1.3 },
    },
  },
  {
    id: 'curry',
    name: '카레',
    category: '아시안',
    tags: ['매운맛', '진한'],
    fitness: {
      time: { breakfast: 0.7, brunch: 1.0, lunch: 1.5, dinner: 1.4, latenight: 0.9 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 1.3, hot: 1.1, rainy: 1.1 },
    },
  },
  {
    id: 'pad-thai',
    name: '팟타이',
    category: '아시안',
    tags: ['면', '새콤한', '달콤한'],
    fitness: {
      time: { breakfast: 0.6, brunch: 1.2, lunch: 1.5, dinner: 1.3, latenight: 0.8 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 0.9, hot: 1.4, rainy: 0.9 },
    },
  },
  {
    id: 'tom-yum-kung',
    name: '똠양꿍',
    category: '아시안',
    tags: ['따뜻한', '국물', '매운맛', '새콤한', '해산물'],
    fitness: {
      time: { breakfast: 0.6, brunch: 0.9, lunch: 1.3, dinner: 1.5, latenight: 0.9 },
      dayOfWeek: { weekday: 1.0, weekend: 1.2 },
      weather: { cold: 1.5, hot: 1.1, rainy: 1.3 },
    },
  },

  // ─── 기타 (8) ────────────────────────────────────────
  {
    id: 'greek-yogurt',
    name: '그릭요거트',
    category: '기타',
    tags: ['담백한', '건강한', '시원한', '다이어트'],
    fitness: {
      time: { breakfast: 1.8, brunch: 1.4, lunch: 0.9, dinner: 0.7, latenight: 0.5 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 0.9, hot: 1.3, rainy: 1.0 },
    },
  },
  {
    id: 'smoothie-bowl',
    name: '스무디볼',
    category: '기타',
    tags: ['건강한', '다이어트', '시원한'],
    fitness: {
      time: { breakfast: 1.7, brunch: 1.5, lunch: 1.0, dinner: 0.7, latenight: 0.5 },
      dayOfWeek: { weekday: 1.2, weekend: 1.0 },
      weather: { cold: 0.7, hot: 1.6, rainy: 0.8 },
    },
  },
  {
    id: 'cereal',
    name: '시리얼',
    category: '기타',
    tags: ['간편', '달콤한'],
    fitness: {
      time: { breakfast: 1.9, brunch: 1.0, lunch: 0.7, dinner: 0.5, latenight: 0.5 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 0.9, hot: 1.2, rainy: 0.9 },
    },
  },
  {
    id: 'oatmeal',
    name: '오트밀',
    category: '기타',
    tags: ['담백한', '건강한'],
    fitness: {
      time: { breakfast: 1.7, brunch: 1.0, lunch: 0.7, dinner: 0.6, latenight: 0.5 },
      dayOfWeek: { weekday: 1.3, weekend: 1.0 },
      weather: { cold: 1.4, hot: 0.9, rainy: 1.0 },
    },
  },
  {
    id: 'jokbal',
    name: '족발',
    category: '기타',
    tags: ['고기', '돼지'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.7, lunch: 1.0, dinner: 1.6, latenight: 1.5 },
      dayOfWeek: { weekday: 1.0, weekend: 1.3 },
      weather: { cold: 1.2, hot: 1.0, rainy: 1.0 },
    },
  },
  {
    id: 'chicken',
    name: '치킨',
    category: '기타',
    tags: ['튀김', '닭'],
    fitness: {
      time: { breakfast: 0.5, brunch: 0.7, lunch: 1.0, dinner: 1.6, latenight: 1.7 },
      dayOfWeek: { weekday: 1.0, weekend: 1.5 },
      weather: { cold: 1.1, hot: 1.0, rainy: 1.3 },
    },
  },
  {
    id: 'tomato-scramble',
    name: '토마토스크램블',
    category: '기타',
    tags: ['계란', '채소', '담백한'],
    fitness: {
      time: { breakfast: 1.6, brunch: 1.5, lunch: 0.9, dinner: 0.7, latenight: 0.5 },
      dayOfWeek: { weekday: 1.1, weekend: 1.1 },
      weather: { cold: 0.9, hot: 1.2, rainy: 1.0 },
    },
  },
  {
    id: 'french-toast',
    name: '프렌치토스트',
    category: '기타',
    tags: ['빵', '달콤한', '계란'],
    fitness: {
      time: { breakfast: 1.7, brunch: 1.6, lunch: 0.9, dinner: 0.7, latenight: 0.6 },
      dayOfWeek: { weekday: 1.0, weekend: 1.3 },
      weather: { cold: 1.0, hot: 1.0, rainy: 1.0 },
    },
  },
]
