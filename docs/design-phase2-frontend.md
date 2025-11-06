# 2단계 (중간 모델) - 프론트엔드 설계

## 기술 스택

- **프레임워크**: Vue 3 + Vite
- **상태 관리**: Pinia
- **라우팅**: Vue Router
- **스타일링**: Tailwind CSS
- **HTTP 클라이언트**: Axios
- **빌드 도구**: Vite
- **타입 체크**: JavaScript (TypeScript는 3단계에서)

## 프로젝트 구조

```
todays-meal-v2/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │       └── main.css
│   ├── components/
│   │   ├── Header.vue
│   │   ├── CategorySelector.vue
│   │   ├── ConditionSelector.vue
│   │   ├── WeatherDisplay.vue
│   │   ├── RecommendButton.vue
│   │   ├── ResultCard.vue
│   │   ├── HistoryModal.vue
│   │   └── AdBanner.vue
│   ├── composables/
│   │   ├── useRecommendation.js
│   │   ├── useWeather.js
│   │   ├── useGeolocation.js
│   │   └── useHistory.js
│   ├── services/
│   │   ├── api.js
│   │   ├── weatherService.js
│   │   └── sessionService.js
│   ├── stores/
│   │   └── app.js
│   ├── views/
│   │   ├── HomeView.vue
│   │   └── ResultView.vue
│   ├── router/
│   │   └── index.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.vue
│   └── main.js
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 핵심 파일 구현

### main.js

```javascript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import './assets/styles/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');
```

### stores/app.js

```javascript
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    // 카테고리
    selectedCategories: [],
    
    // 사용자 컨디션
    userCondition: {
      energy: null,      // 'tired' | 'energetic' | null
      hunger: null,      // 'little' | 'normal' | 'very' | null
      mood: null         // 'fresh' | 'sad' | 'stressed' | null
    },
    
    // 날씨
    weather: null,       // { temp, condition, location }
    
    // 위치
    location: null,      // { lat, lon }
    
    // 히스토리
    history: [],
    
    // 현재 추천
    currentRecommendation: null,
    
    // 로딩 상태
    isLoading: false,
    
    // 세션 ID
    sessionId: null
  }),
  
  actions: {
    setSelectedCategories(categories) {
      this.selectedCategories = categories;
    },
    
    toggleCategory(category) {
      const index = this.selectedCategories.indexOf(category);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      } else {
        this.selectedCategories.push(category);
      }
    },
    
    setUserCondition(type, value) {
      this.userCondition[type] = value;
    },
    
    setWeather(weatherData) {
      this.weather = weatherData;
    },
    
    setLocation(locationData) {
      this.location = locationData;
    },
    
    setHistory(historyData) {
      this.history = historyData;
    },
    
    setCurrentRecommendation(recommendation) {
      this.currentRecommendation = recommendation;
    },
    
    setLoading(status) {
      this.isLoading = status;
    },
    
    setSessionId(id) {
      this.sessionId = id;
    },
    
    resetConditions() {
      this.userCondition = {
        energy: null,
        hunger: null,
        mood: null
      };
    }
  },
  
  getters: {
    hasSelectedCategories: (state) => state.selectedCategories.length > 0,
    hasUserCondition: (state) => {
      return state.userCondition.energy !== null ||
             state.userCondition.hunger !== null ||
             state.userCondition.mood !== null;
    },
    hasWeather: (state) => state.weather !== null
  }
});
```

### services/api.js

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 세션 ID 추가
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['X-Session-ID'] = sessionId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default {
  // 메뉴 추천
  getRecommendation(data) {
    return apiClient.post('/recommend', data);
  },
  
  // 히스토리 조회
  getHistory(sessionId) {
    return apiClient.get(`/history/${sessionId}`);
  },
  
  // 히스토리 저장
  saveHistory(data) {
    return apiClient.post('/history', data);
  },
  
  // 메뉴 목록
  getMenus(category = null) {
    const params = category ? { category } : {};
    return apiClient.get('/menus', { params });
  }
};
```

### services/weatherService.js

```javascript
import axios from 'axios';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export default {
  async getCurrentWeather(lat, lon) {
    try {
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'kr'
        }
      });
      
      return {
        temp: Math.round(response.data.main.temp),
        condition: response.data.weather[0].main,
        description: response.data.weather[0].description,
        location: response.data.name
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      return null;
    }
  }
};
```

### composables/useGeolocation.js

```javascript
import { ref } from 'vue';

export function useGeolocation() {
  const location = ref(null);
  const error = ref(null);
  const isLoading = ref(false);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        error.value = '위치 서비스를 지원하지 않는 브라우저입니다.';
        reject(error.value);
        return;
      }

      isLoading.value = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.value = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          isLoading.value = false;
          resolve(location.value);
        },
        (err) => {
          error.value = '위치 정보를 가져올 수 없습니다.';
          isLoading.value = false;
          reject(err);
        },
        {
          timeout: 10000,
          maximumAge: 300000 // 5분 캐시
        }
      );
    });
  };

  return {
    location,
    error,
    isLoading,
    getCurrentLocation
  };
}
```


### composables/useRecommendation.js

```javascript
import { ref } from 'vue';
import { useAppStore } from '../stores/app';
import api from '../services/api';

export function useRecommendation() {
  const store = useAppStore();
  const isLoading = ref(false);
  const error = ref(null);

  const getRecommendation = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const requestData = {
        categories: store.selectedCategories,
        weather: store.weather,
        timeOfDay: getCurrentTimeOfDay(),
        userCondition: store.userCondition
      };

      const response = await api.getRecommendation(requestData);
      
      if (response.data.success) {
        store.setCurrentRecommendation(response.data.recommendation);
        return response.data.recommendation;
      } else {
        throw new Error('추천 실패');
      }
    } catch (err) {
      error.value = '메뉴 추천 중 오류가 발생했습니다.';
      console.error('Recommendation Error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'breakfast';
    if (hour >= 11 && hour < 14) return 'lunch';
    if (hour >= 17 && hour < 21) return 'dinner';
    return 'other';
  };

  return {
    isLoading,
    error,
    getRecommendation
  };
}
```

### composables/useWeather.js

```javascript
import { ref } from 'vue';
import { useAppStore } from '../stores/app';
import weatherService from '../services/weatherService';

export function useWeather() {
  const store = useAppStore();
  const isLoading = ref(false);
  const error = ref(null);

  const fetchWeather = async (lat, lon) => {
    isLoading.value = true;
    error.value = null;

    try {
      const weather = await weatherService.getCurrentWeather(lat, lon);
      
      if (weather) {
        store.setWeather(weather);
        // 캐시에 저장 (10분)
        localStorage.setItem('weather', JSON.stringify({
          data: weather,
          timestamp: Date.now()
        }));
        return weather;
      } else {
        throw new Error('날씨 정보를 가져올 수 없습니다.');
      }
    } catch (err) {
      error.value = err.message;
      console.error('Weather Error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const getCachedWeather = () => {
    try {
      const cached = localStorage.getItem('weather');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // 10분 이내면 캐시 사용
        if (Date.now() - timestamp < 10 * 60 * 1000) {
          store.setWeather(data);
          return data;
        }
      }
    } catch (err) {
      console.error('Cache Error:', err);
    }
    return null;
  };

  return {
    isLoading,
    error,
    fetchWeather,
    getCachedWeather
  };
}
```

### components/CategorySelector.vue

```vue
<template>
  <div class="category-selector">
    <h2 class="text-xl font-semibold text-center mb-4">
      원하는 종류를 선택하세요 (선택사항)
    </h2>
    <div class="flex flex-wrap gap-3 justify-center">
      <button
        v-for="category in categories"
        :key="category"
        @click="toggleCategory(category)"
        :class="getCategoryClass(category)"
        class="px-6 py-3 rounded-full font-semibold transition border-2"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '../stores/app';

const store = useAppStore();

const categories = ['한식', '일식', '중식', '양식', '분식', '기타'];

const toggleCategory = (category) => {
  store.toggleCategory(category);
};

const getCategoryClass = (category) => {
  const isSelected = store.selectedCategories.includes(category);
  return isSelected
    ? 'bg-orange-500 text-white border-orange-500'
    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500';
};
</script>
```

### components/ConditionSelector.vue

```vue
<template>
  <div class="condition-selector bg-white rounded-xl shadow-md p-6 mb-6">
    <h3 class="text-lg font-semibold mb-4 text-center">
      지금 기분은 어떠세요? (선택사항)
    </h3>
    
    <!-- 에너지 레벨 -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        컨디션
      </label>
      <div class="flex gap-2">
        <button
          @click="setCondition('energy', 'tired')"
          :class="getButtonClass('energy', 'tired')"
          class="flex-1 py-2 px-4 rounded-lg font-medium transition"
        >
          😴 피곤해요
        </button>
        <button
          @click="setCondition('energy', 'energetic')"
          :class="getButtonClass('energy', 'energetic')"
          class="flex-1 py-2 px-4 rounded-lg font-medium transition"
        >
          😊 활기차요
        </button>
      </div>
    </div>

    <!-- 배고픔 정도 -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        배고픔 정도
      </label>
      <div class="flex gap-2">
        <button
          @click="setCondition('hunger', 'little')"
          :class="getButtonClass('hunger', 'little')"
          class="flex-1 py-2 px-4 rounded-lg font-medium transition text-sm"
        >
          조금
        </button>
        <button
          @click="setCondition('hunger', 'normal')"
          :class="getButtonClass('hunger', 'normal')"
          class="flex-1 py-2 px-4 rounded-lg font-medium transition text-sm"
        >
          보통
        </button>
        <button
          @click="setCondition('hunger', 'very')"
          :class="getButtonClass('hunger', 'very')"
          class="flex-1 py-2 px-4 rounded-lg font-medium transition text-sm"
        >
          매우
        </button>
      </div>
    </div>

    <!-- 기분 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        기분
      </label>
      <div class="flex gap-2">
        <button
          @click="setCondition('mood', 'fresh')"
          :class="getButtonClass('mood', 'fresh')"
          class="flex-1 py-2 px-4 rounded-lg font-medium transition text-sm"
        >
          🌟 상쾌
        </button>
        <button
          @click="setCondition('mood', 'sad')"
          :class="getButtonClass('mood', 'sad')"
          class="flex-1 py-2 px-4 rounded-lg font-medium transition text-sm"
        >
          😢 우울
        </button>
        <button
          @click="setCondition('mood', 'stressed')"
          :class="getButtonClass('mood', 'stressed')"
          class="flex-1 py-2 px-4 rounded-lg font-medium transition text-sm"
        >
          😤 스트레스
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/app';

const store = useAppStore();

const setCondition = (type, value) => {
  // 같은 값 클릭 시 토글
  if (store.userCondition[type] === value) {
    store.setUserCondition(type, null);
  } else {
    store.setUserCondition(type, value);
  }
};

const getButtonClass = (type, value) => {
  const isSelected = store.userCondition[type] === value;
  return isSelected
    ? 'bg-orange-500 text-white'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
};
</script>
```

### components/WeatherDisplay.vue

```vue
<template>
  <div v-if="weather" class="weather-display bg-blue-50 rounded-lg p-4 mb-6">
    <div class="flex items-center justify-center gap-3">
      <span class="text-3xl">{{ getWeatherIcon(weather.condition) }}</span>
      <div>
        <p class="text-lg font-semibold">{{ weather.location }}</p>
        <p class="text-2xl font-bold text-blue-600">{{ weather.temp }}°C</p>
        <p class="text-sm text-gray-600">{{ weather.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '../stores/app';

const store = useAppStore();
const weather = computed(() => store.weather);

const getWeatherIcon = (condition) => {
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Snow': '❄️',
    'Thunderstorm': '⛈️',
    'Drizzle': '🌦️',
    'Mist': '🌫️'
  };
  return icons[condition] || '🌤️';
};
</script>
```

### components/AdBanner.vue

```vue
<template>
  <div class="ad-banner my-6">
    <p class="text-xs text-gray-400 text-center mb-1">광고</p>
    <div class="ad-container bg-gray-100 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
      <ins
        class="adsbygoogle"
        style="display: block"
        :data-ad-client="adClient"
        :data-ad-slot="slot"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  slot: {
    type: String,
    required: true
  }
});

const adClient = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-XXXXXXXX';

onMounted(() => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error('Ad loading failed', e);
  }
});
</script>
```

### views/HomeView.vue

```vue
<template>
  <div class="home-view">
    <!-- 헤더 -->
    <header class="text-center mb-12">
      <h1 class="text-5xl font-bold text-orange-600 mb-2">오늘의밥</h1>
      <p class="text-gray-600">오늘 뭐 먹을지 고민되시나요?</p>
    </header>

    <!-- 날씨 정보 -->
    <WeatherDisplay />

    <!-- 카테고리 선택 -->
    <div class="max-w-2xl mx-auto mb-8">
      <CategorySelector />
    </div>

    <!-- 컨디션 선택 -->
    <div class="max-w-xl mx-auto mb-8">
      <ConditionSelector />
    </div>

    <!-- 광고 -->
    <AdBanner slot="main-banner" />

    <!-- 추천 버튼 -->
    <div class="text-center mb-8">
      <button
        @click="handleRecommend"
        :disabled="isLoading"
        class="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-6 px-12 rounded-full text-2xl shadow-lg transform transition hover:scale-105 disabled:scale-100"
      >
        <span v-if="!isLoading">🍽️ 추천받기</span>
        <span v-else>⏳ 추천 중...</span>
      </button>
    </div>

    <!-- 히스토리 버튼 -->
    <div class="fixed bottom-8 right-8">
      <button
        @click="showHistory"
        class="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-full shadow-lg"
      >
        📋 히스토리
      </button>
    </div>

    <!-- 히스토리 모달 -->
    <HistoryModal v-model:show="isHistoryOpen" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/app';
import { useGeolocation } from '../composables/useGeolocation';
import { useWeather } from '../composables/useWeather';
import { useRecommendation } from '../composables/useRecommendation';
import CategorySelector from '../components/CategorySelector.vue';
import ConditionSelector from '../components/ConditionSelector.vue';
import WeatherDisplay from '../components/WeatherDisplay.vue';
import AdBanner from '../components/AdBanner.vue';
import HistoryModal from '../components/HistoryModal.vue';

const router = useRouter();
const store = useAppStore();
const { getCurrentLocation } = useGeolocation();
const { fetchWeather, getCachedWeather } = useWeather();
const { getRecommendation, isLoading } = useRecommendation();

const isHistoryOpen = ref(false);

onMounted(async () => {
  // 세션 ID 생성 또는 로드
  initSession();
  
  // 캐시된 날씨 확인
  const cachedWeather = getCachedWeather();
  
  // 캐시가 없으면 위치 및 날씨 가져오기
  if (!cachedWeather) {
    try {
      const location = await getCurrentLocation();
      store.setLocation(location);
      await fetchWeather(location.lat, location.lon);
    } catch (error) {
      console.log('위치 또는 날씨 정보를 가져올 수 없습니다.');
    }
  }
});

const initSession = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('sessionId', sessionId);
  }
  store.setSessionId(sessionId);
};

const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const handleRecommend = async () => {
  const recommendation = await getRecommendation();
  if (recommendation) {
    router.push('/result');
  }
};

const showHistory = () => {
  isHistoryOpen.value = true;
};
</script>
```

## 환경 변수 설정

**.env.example**:
```env
VITE_API_URL=http://localhost:3000/api
VITE_WEATHER_API_KEY=your_openweather_api_key
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXX
```

## 빌드 및 배포

### package.json

```json
{
  "name": "todays-meal-v2",
  "version": "2.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "vite": "^4.3.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### vite.config.js

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
});
```

## 성능 최적화

1. **Lazy Loading**: 라우트별 코드 스플리팅
2. **이미지 최적화**: WebP, lazy loading
3. **API 캐싱**: 날씨 정보 10분 캐시
4. **번들 최적화**: Tree shaking, minification

## 테스트 체크리스트

- [ ] 위치 권한 요청 및 처리
- [ ] 날씨 정보 표시
- [ ] 카테고리 선택/해제
- [ ] 컨디션 선택/해제
- [ ] 추천 API 호출
- [ ] 결과 페이지 이동
- [ ] 히스토리 저장 및 표시
- [ ] 광고 표시
- [ ] 모바일 반응형
- [ ] 에러 처리
