# 2단계 (중간 모델) - 백엔드 설계

## 기술 스택

- **런타임**: Node.js 18+
- **프레임워크**: Express.js
- **데이터베이스**: Supabase (PostgreSQL)
- **ORM**: Supabase Client
- **인증**: 없음 (세션 ID 기반)
- **캐싱**: 메모리 캐시 (node-cache)
- **검증**: express-validator
- **로깅**: Winston
- **환경 변수**: dotenv

## 프로젝트 구조

```
todays-meal-api/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── constants.js
│   ├── controllers/
│   │   ├── menuController.js
│   │   ├── recommendationController.js
│   │   └── historyController.js
│   ├── services/
│   │   ├── recommendationService.js
│   │   ├── menuService.js
│   │   └── historyService.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── cache.js
│   ├── routes/
│   │   └── index.js
│   └── app.js
├── scripts/
│   └── seed.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## 데이터베이스 스키마

### Supabase SQL 스크립트

```sql
-- 메뉴 테이블
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  is_warm BOOLEAN DEFAULT false,
  is_cold BOOLEAN DEFAULT false,
  is_heavy BOOLEAN DEFAULT false,
  is_light BOOLEAN DEFAULT false,
  time_tags TEXT[] DEFAULT '{}',
  mood_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 추천 히스토리 테이블
CREATE TABLE recommendation_history (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  menu_id INTEGER REFERENCES menus(id),
  recommended_at TIMESTAMP DEFAULT NOW(),
  weather_temp DECIMAL(5,2),
  weather_condition VARCHAR(50),
  user_condition JSONB,
  INDEX idx_session_id (session_id),
  INDEX idx_recommended_at (recommended_at)
);

-- 인덱스
CREATE INDEX idx_menus_category ON menus(category);
CREATE INDEX idx_menus_tags ON menus USING GIN(tags);
```

### 초기 데이터 (seed.js)

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const menuData = [
  // 한식
  {
    name: "김치찌개",
    category: "한식",
    tags: ["따뜻한", "국물", "매운맛"],
    description: "얼큰한 김치찌개",
    is_warm: true,
    is_heavy: true,
    time_tags: ["점심", "저녁"],
    mood_tags: ["위로", "활력"]
  },
  {
    name: "냉면",
    category: "한식",
    tags: ["시원한", "국물", "면"],
    description: "시원한 냉면",
    is_cold: true,
    is_light: true,
    time_tags: ["점심"],
    mood_tags: ["상쾌"]
  },
  // ... 나머지 30개 메뉴
];

async function seed() {
  try {
    const { data, error } = await supabase
      .from('menus')
      .insert(menuData);
    
    if (error) throw error;
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed error:', error);
  }
}

seed();
```

## 핵심 파일 구현

### config/database.js

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
```

### services/recommendationService.js

```javascript
const supabase = require('../config/database');
const NodeCache = require('node-cache');

// 메뉴 캐시 (1시간)
const menuCache = new NodeCache({ stdTTL: 3600 });

class RecommendationService {
  constructor() {
    this.baseWeight = 1.0;
  }

  async getRecommendation(filters) {
    // 메뉴 가져오기 (캐시 활용)
    let menus = await this.getMenus(filters.categories);
    
    // 점수 계산
    const scoredMenus = menus.map(menu => ({
      ...menu,
      score: this.calculateScore(menu, filters)
    }));

    // 가중치 기반 랜덤 선택
    const selected = this.weightedRandomSelection(scoredMenus);
    
    // 추천 이유 생성
    const reason = this.generateReason(selected, filters);
    
    return {
      ...selected,
      reason
    };
  }

  async getMenus(categories = []) {
    const cacheKey = categories.length > 0 ? categories.join(',') : 'all';
    
    // 캐시 확인
    const cached = menuCache.get(cacheKey);
    if (cached) return cached;

    // DB 조회
    let query = supabase.from('menus').select('*');
    
    if (categories.length > 0) {
      query = query.in('category', categories);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    // 캐시 저장
    menuCache.set(cacheKey, data);
    
    return data;
  }

  calculateScore(menu, filters) {
    let score = this.baseWeight;

    // 날씨 기반 가중치
    if (filters.weather) {
      const temp = filters.weather.temp;
      
      if (temp <= 5 && menu.is_warm) {
        score *= 1.3;
      }
      
      if (temp >= 28 && menu.is_cold) {
        score *= 1.3;
      }
    }

    // 시간대 기반 가중치
    if (filters.timeOfDay && menu.time_tags) {
      const timeMap = {
        'breakfast': '아침',
        'lunch': '점심',
        'dinner': '저녁'
      };
      
      if (menu.time_tags.includes(timeMap[filters.timeOfDay])) {
        score *= 1.5;
      }
    }

    // 사용자 컨디션 기반 가중치
    if (filters.userCondition) {
      const { energy, hunger, mood } = filters.userCondition;
      
      // 에너지
      if (energy === 'tired' && menu.is_light) {
        score *= 1.2;
      }
      if (energy === 'energetic' && menu.is_heavy) {
        score *= 1.1;
      }
      
      // 배고픔
      if (hunger === 'very' && menu.is_heavy) {
        score *= 1.3;
      }
      if (hunger === 'little' && menu.is_light) {
        score *= 1.2;
      }
      
      // 기분
      if (mood && menu.mood_tags) {
        const moodMap = {
          'fresh': '상쾌',
          'sad': '위로',
          'stressed': '활력'
        };
        
        if (menu.mood_tags.includes(moodMap[mood])) {
          score *= 1.2;
        }
      }
    }

    return score;
  }

  weightedRandomSelection(scoredMenus) {
    const totalScore = scoredMenus.reduce((sum, m) => sum + m.score, 0);
    let random = Math.random() * totalScore;

    for (let menu of scoredMenus) {
      random -= menu.score;
      if (random <= 0) return menu;
    }

    return scoredMenus[0];
  }

  generateReason(menu, filters) {
    const reasons = [];

    if (filters.weather) {
      const temp = filters.weather.temp;
      if (temp <= 5 && menu.is_warm) {
        reasons.push('날씨가 추워서 따뜻한 메뉴를 추천했어요');
      }
      if (temp >= 28 && menu.is_cold) {
        reasons.push('날씨가 더워서 시원한 메뉴를 추천했어요');
      }
    }

    if (filters.userCondition) {
      if (filters.userCondition.hunger === 'very' && menu.is_heavy) {
        reasons.push('배고플 때 좋은 든든한 메뉴입니다');
      }
      if (filters.userCondition.energy === 'tired' && menu.is_light) {
        reasons.push('피곤할 때 부담 없는 가벼운 메뉴입니다');
      }
    }

    return reasons.length > 0 ? reasons.join('. ') : '오늘의 추천 메뉴입니다';
  }
}

module.exports = new RecommendationService();
```

### services/historyService.js

```javascript
const supabase = require('../config/database');

class HistoryService {
  async saveHistory(data) {
    const { error } = await supabase
      .from('recommendation_history')
      .insert({
        session_id: data.sessionId,
        menu_id: data.menuId,
        weather_temp: data.weatherTemp,
        weather_condition: data.weatherCondition,
        user_condition: data.userCondition
      });

    if (error) throw error;
    return { success: true };
  }

  async getHistory(sessionId, limit = 10) {
    const { data, error } = await supabase
      .from('recommendation_history')
      .select(`
        *,
        menus (*)
      `)
      .eq('session_id', sessionId)
      .order('recommended_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async deleteHistoryItem(id, sessionId) {
    const { error } = await supabase
      .from('recommendation_history')
      .delete()
      .eq('id', id)
      .eq('session_id', sessionId);

    if (error) throw error;
    return { success: true };
  }
}

module.exports = new HistoryService();
```

### controllers/recommendationController.js

```javascript
const recommendationService = require('../services/recommendationService');
const historyService = require('../services/historyService');

exports.getRecommendation = async (req, res, next) => {
  try {
    const { categories, weather, timeOfDay, userCondition } = req.body;
    const sessionId = req.headers['x-session-id'];

    // 추천 받기
    const recommendation = await recommendationService.getRecommendation({
      categories: categories || [],
      weather,
      timeOfDay,
      userCondition
    });

    // 히스토리 저장
    if (sessionId) {
      await historyService.saveHistory({
        sessionId,
        menuId: recommendation.id,
        weatherTemp: weather?.temp,
        weatherCondition: weather?.condition,
        userCondition
      });
    }

    res.json({
      success: true,
      recommendation
    });
  } catch (error) {
    next(error);
  }
};
```

### middleware/rateLimiter.js

```javascript
const rateLimit = require('express-rate-limit');

// API 전체 제한
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100,
  message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
});

// 추천 API 제한
exports.recommendLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  max: 10,
  message: '추천 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
});
```

### middleware/validator.js

```javascript
const { body, validationResult } = require('express-validator');

exports.validateRecommendation = [
  body('categories').optional().isArray(),
  body('categories.*').optional().isIn(['한식', '일식', '중식', '양식', '분식', '기타']),
  body('weather.temp').optional().isFloat({ min: -30, max: 50 }),
  body('userCondition.energy').optional().isIn(['tired', 'energetic']),
  body('userCondition.hunger').optional().isIn(['little', 'normal', 'very']),
  body('userCondition.mood').optional().isIn(['fresh', 'sad', 'stressed']),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];
```

### routes/index.js

```javascript
const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const historyController = require('../controllers/historyController');
const menuController = require('../controllers/menuController');
const { validateRecommendation } = require('../middleware/validator');
const { recommendLimiter } = require('../middleware/rateLimiter');

// 메뉴
router.get('/menus', menuController.getMenus);
router.get('/menus/:id', menuController.getMenuById);

// 추천
router.post('/recommend', 
  recommendLimiter,
  validateRecommendation,
  recommendationController.getRecommendation
);

// 히스토리
router.get('/history/:sessionId', historyController.getHistory);
router.post('/history', historyController.saveHistory);
router.delete('/history/:id', historyController.deleteHistory);

module.exports = router;
```

### app.js

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// 미들웨어
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting
app.use('/api', apiLimiter);

// 라우트
app.use('/api', routes);

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 에러 핸들러
app.use(errorHandler);

module.exports = app;
```

### server.js

```javascript
require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

## 환경 변수

**.env.example**:
```env
# Server
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key

# Frontend
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
```

## 배포 (Render)

**render.yaml**:
```yaml
services:
  - type: web
    name: todays-meal-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_KEY
        sync: false
```

## API 문서

### POST /api/recommend

**요청**:
```json
{
  "categories": ["한식", "일식"],
  "weather": {
    "temp": 15,
    "condition": "Clear"
  },
  "timeOfDay": "lunch",
  "userCondition": {
    "energy": "tired",
    "hunger": "very",
    "mood": "stressed"
  }
}
```

**응답**:
```json
{
  "success": true,
  "recommendation": {
    "id": 1,
    "name": "김치찌개",
    "category": "한식",
    "description": "얼큰한 김치찌개",
    "reason": "날씨가 추워서 따뜻한 메뉴를 추천했어요. 배고플 때 좋은 든든한 메뉴입니다"
  }
}
```

## 모니터링

- Winston 로거로 에러 로깅
- Render 대시보드에서 로그 확인
- 추후 Sentry 통합 고려

## 비용

- Supabase: 무료 (500MB)
- Render: 무료 (750시간/월)
- **총 비용: $0/월**
