<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import CategoryFilterChips from '@/components/CategoryFilterChips.vue'
import { countPhotos } from '@/composables/db'
import { getCurrentMealType } from '@/composables/recommendation'
import { useHistoryStore } from '@/stores/history'
import { usePreferencesStore } from '@/stores/preferences'
import type { MealType } from '@/types'

const history = useHistoryStore()
const prefs = usePreferencesStore()
const photoCount = ref(0)

const showWelcome = computed(() => !prefs.preferences.onboardingCompleted)

function dismissWelcome(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(8)
  prefs.update({ onboardingCompleted: true })
}

const HEADLINES: Record<MealType, string> = {
  breakfast: '아침, 뭐 먹지?',
  brunch: '브런치, 뭐 먹지?',
  lunch: '점심, 뭐 먹지?',
  dinner: '저녁, 뭐 먹지?',
  latenight: '야식, 뭐 먹지?',
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: '아침',
  brunch: '브런치',
  lunch: '점심',
  dinner: '저녁',
  latenight: '야식',
}

const SUB_MESSAGES: Record<MealType, string> = {
  breakfast: '가볍게 하루 시작해봐요',
  brunch: '느긋한 브런치 어때요',
  lunch: '오늘은 뭘로 정해볼까요',
  dinner: '오늘 하루도 수고했어요',
  latenight: '야식의 유혹이 시작됐어요',
}

const mealType = computed(() => getCurrentMealType())
const headline = computed(() => HEADLINES[mealType.value])
const mealLabel = computed(() => MEAL_LABELS[mealType.value])
const subMessage = computed(() => SUB_MESSAGES[mealType.value])

const currentTime = computed(() => {
  const now = new Date()
  const h = now.getHours()
  const m = String(now.getMinutes()).padStart(2, '0')
  const ampm = h < 12 ? '오전' : '오후'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${ampm} ${hour12}:${m}`
})

const weekDecisions = computed(() => {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
  return history.entries.filter(
    (e) => new Date(e.timestamp).getTime() >= cutoff,
  ).length
})

onMounted(async () => {
  try {
    photoCount.value = await countPhotos()
  } catch {
    photoCount.value = 0
  }
})
</script>

<template>
  <main class="relative isolate px-5 pt-12 pb-10">
    <span
      class="decor-blob"
      style="top: -60px; right: -40px; width: 240px; height: 240px; background: radial-gradient(circle, #FFB4A8 0%, transparent 70%);"
    />
    <span
      class="decor-blob"
      style="top: 40px; left: -80px; width: 200px; height: 200px; background: radial-gradient(circle, #FFD5B5 0%, transparent 70%);"
    />

    <div class="relative">
      <div class="flex items-center justify-between mb-5">
        <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated shadow-sm text-footnote text-text-secondary" style="box-shadow: 0 1px 2px rgba(60,60,67,0.05), 0 0 0 1px var(--separator);">
          <span class="block w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" aria-hidden="true" />
          {{ currentTime }} · {{ mealLabel }}
        </span>
        <span class="w-12 h-12 flex items-center justify-center animate-wobble">
          <svg v-if="mealType === 'breakfast'" viewBox="0 0 64 64" class="w-11 h-11" aria-hidden="true">
            <circle cx="32" cy="36" r="22" fill="#FFD23F"/>
            <ellipse cx="26" cy="28" rx="6" ry="4" fill="#FFFFFF" opacity="0.7"/>
            <circle cx="44" cy="22" r="6" fill="#FFB4A8"/>
            <path d="M44 18c-2 0-3 2-3 4" stroke="#FF7A6D" stroke-width="2" stroke-linecap="round" fill="none"/>
          </svg>
          <svg v-else-if="mealType === 'brunch'" viewBox="0 0 64 64" class="w-11 h-11" aria-hidden="true">
            <circle cx="32" cy="32" r="22" fill="#FFE3DE"/>
            <circle cx="32" cy="32" r="14" fill="#FF7A6D"/>
            <circle cx="26" cy="28" r="3" fill="#FFFFFF" opacity="0.5"/>
          </svg>
          <svg v-else-if="mealType === 'lunch'" viewBox="0 0 64 64" class="w-11 h-11" aria-hidden="true">
            <ellipse cx="32" cy="38" rx="24" ry="6" fill="#FFFFFF" stroke="#FF7A6D" stroke-width="2"/>
            <path d="M10 38 Q32 60 54 38 Z" fill="#FF7A6D"/>
            <circle cx="24" cy="22" r="4" fill="#2C2C2E"/>
            <circle cx="34" cy="18" r="3" fill="#2C2C2E"/>
            <circle cx="42" cy="24" r="3" fill="#2C2C2E"/>
          </svg>
          <svg v-else-if="mealType === 'dinner'" viewBox="0 0 64 64" class="w-11 h-11" aria-hidden="true">
            <rect x="14" y="20" width="36" height="24" rx="4" fill="#C56430"/>
            <rect x="18" y="24" width="28" height="16" rx="2" fill="#FF8E73"/>
            <circle cx="50" cy="14" r="6" fill="#FFD23F"/>
          </svg>
          <svg v-else viewBox="0 0 64 64" class="w-11 h-11" aria-hidden="true">
            <path d="M14 30 Q32 18 50 30 L50 42 Q32 50 14 42 Z" fill="#FFB7A8"/>
            <path d="M22 32 Q32 26 42 32" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none"/>
            <path d="M22 36 Q32 30 42 36" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none"/>
            <circle cx="50" cy="14" r="4" fill="#B58CFF"/>
            <circle cx="14" cy="18" r="3" fill="#FFD23F"/>
          </svg>
        </span>
      </div>

      <header class="mb-10">
        <h1
          class="text-text-primary font-bold tracking-[-0.03em] leading-[1.1]"
          style="font-size: 38px;"
        >
          {{ headline }}
        </h1>
        <p class="mt-3 text-body text-text-secondary">{{ subMessage }}</p>
      </header>
    </div>

    <section class="relative space-y-3">
      <RouterLink to="/decide/quick" class="card card-tap flex items-center gap-4">
        <span class="icon-squircle icon-squircle--quick">
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor" aria-hidden="true">
            <path d="M9 5v14l11-7z" />
          </svg>
        </span>
        <span class="flex-1 min-w-0">
          <span class="block text-title-3 text-text-primary">바로 추천</span>
          <span class="block text-footnote text-text-secondary font-normal mt-1">
            지금 끌리는 한 가지
          </span>
        </span>
        <svg viewBox="0 0 24 24" class="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </RouterLink>

      <RouterLink to="/decide/tournament" class="card card-tap flex items-center gap-4">
        <span class="icon-squircle icon-squircle--tournament">
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor" aria-hidden="true">
            <rect x="3" y="6" width="7" height="12" rx="2" />
            <rect x="14" y="6" width="7" height="12" rx="2" />
            <rect x="10.5" y="11" width="3" height="2" rx="1" />
          </svg>
        </span>
        <span class="flex-1 min-w-0">
          <span class="block text-title-3 text-text-primary">토너먼트</span>
          <span class="block text-footnote text-text-secondary font-normal mt-1">
            셋 중 하나씩 비교해서
          </span>
        </span>
        <svg viewBox="0 0 24 24" class="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </RouterLink>

      <RouterLink to="/decide/slot" class="card card-tap flex items-center gap-4">
        <span class="icon-squircle icon-squircle--slot">
          <svg viewBox="0 0 24 24" class="w-6 h-6" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4" />
            <path d="M12 3 a9 9 0 0 1 7.794 4.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </span>
        <span class="flex-1 min-w-0">
          <span class="block text-title-3 text-text-primary">슬롯</span>
          <span class="block text-footnote text-text-secondary font-normal mt-1">
            운에 한 번 맡겨보기
          </span>
        </span>
        <svg viewBox="0 0 24 24" class="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </RouterLink>
    </section>

    <div class="mt-8 relative">
      <CategoryFilterChips />
    </div>

    <section v-if="weekDecisions > 0 || photoCount > 0" class="mt-8 grid grid-cols-2 gap-3 relative">
      <RouterLink to="/history" class="card card-tap">
        <p class="text-caption-1 text-text-tertiary mb-1">이번 주 결정</p>
        <p class="text-text-primary font-bold tracking-[-0.02em]" style="font-size: 28px;">
          {{ weekDecisions }}<span class="text-callout text-text-secondary ml-1 font-normal">번</span>
        </p>
      </RouterLink>
      <RouterLink to="/log" class="card card-tap">
        <p class="text-caption-1 text-text-tertiary mb-1">기록한 식사</p>
        <p class="text-text-primary font-bold tracking-[-0.02em]" style="font-size: 28px;">
          {{ photoCount }}<span class="text-callout text-text-secondary ml-1 font-normal">컷</span>
        </p>
      </RouterLink>
    </section>

    <section v-else class="mt-8 card text-center relative overflow-hidden">
      <span
        class="decor-blob"
        style="bottom: -60px; right: -60px; width: 160px; height: 160px; background: radial-gradient(circle, #FFE3DE 0%, transparent 70%);"
      />
      <div class="relative">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-soft text-accent mb-3 animate-float">
          <svg viewBox="0 0 24 24" class="w-7 h-7" fill="currentColor" aria-hidden="true">
            <path d="M12 2 L14.39 8.26 L21 9.27 L16 13.97 L17.18 20.66 L12 17.27 L6.82 20.66 L8 13.97 L3 9.27 L9.61 8.26 Z" />
          </svg>
        </div>
        <p class="text-body text-text-primary font-semibold">아직 기록이 없어요</p>
        <p class="text-footnote text-text-tertiary mt-1">
          오늘 한 끼부터 정해보세요
        </p>
      </div>
    </section>

    <section class="mt-10 relative">
      <h2 class="text-footnote text-text-tertiary mb-3 px-1">바로가기</h2>
      <div class="grid grid-cols-4 gap-2">
        <RouterLink to="/capture" class="flex flex-col items-center gap-2 py-3 rounded-2xl bg-surface transition-transform duration-fast active:scale-95">
          <span class="w-10 h-10 rounded-2xl bg-accent-soft text-accent flex items-center justify-center">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="6" width="18" height="14" rx="2.5" />
              <circle cx="12" cy="13" r="3.5" />
              <path d="M8 6l1.5-2h5L16 6" />
            </svg>
          </span>
          <span class="text-caption-1 text-text-primary font-medium">기록</span>
        </RouterLink>
        <RouterLink to="/log" class="flex flex-col items-center gap-2 py-3 rounded-2xl bg-surface transition-transform duration-fast active:scale-95">
          <span class="w-10 h-10 rounded-2xl bg-surface-elevated text-text-secondary flex items-center justify-center" style="box-shadow: inset 0 0 0 1px var(--separator);">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="4" y="4" width="6" height="6" rx="1.5" />
              <rect x="14" y="4" width="6" height="6" rx="1.5" />
              <rect x="4" y="14" width="6" height="6" rx="1.5" />
              <rect x="14" y="14" width="6" height="6" rx="1.5" />
            </svg>
          </span>
          <span class="text-caption-1 text-text-primary font-medium">로그</span>
        </RouterLink>
        <RouterLink to="/reel" class="flex flex-col items-center gap-2 py-3 rounded-2xl bg-surface transition-transform duration-fast active:scale-95">
          <span class="w-10 h-10 rounded-2xl bg-surface-elevated text-text-secondary flex items-center justify-center" style="box-shadow: inset 0 0 0 1px var(--separator);">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span class="text-caption-1 text-text-primary font-medium">영상</span>
        </RouterLink>
        <RouterLink to="/history" class="flex flex-col items-center gap-2 py-3 rounded-2xl bg-surface transition-transform duration-fast active:scale-95">
          <span class="w-10 h-10 rounded-2xl bg-surface-elevated text-text-secondary flex items-center justify-center" style="box-shadow: inset 0 0 0 1px var(--separator);">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3.5 2" />
            </svg>
          </span>
          <span class="text-caption-1 text-text-primary font-medium">결정</span>
        </RouterLink>
      </div>
    </section>

    <div class="mt-8 text-center relative">
      <RouterLink to="/settings" class="text-caption-1 text-text-tertiary">
        설정
      </RouterLink>
    </div>
  </main>

  <Teleport to="body">
    <Transition name="page">
      <div
        v-if="showWelcome"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        @click.self="dismissWelcome"
      >
        <div class="modal-sheet relative overflow-hidden">
          <div class="sheet-handle sm:hidden" />
          <span
            class="decor-blob"
            style="top: -80px; right: -60px; width: 220px; height: 220px; background: radial-gradient(circle, var(--accent-soft) 0%, transparent 70%);"
          />
          <span
            class="decor-blob"
            style="bottom: -60px; left: -40px; width: 180px; height: 180px; background: radial-gradient(circle, #FFE3DE 0%, transparent 70%);"
          />

          <button
            class="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface flex items-center justify-center text-text-secondary z-10 transition-transform duration-fast active:scale-90"
            aria-label="닫기"
            @click="dismissWelcome"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>

          <div class="relative pt-6 sm:pt-2 pb-2">
            <div class="text-center mb-6">
              <div class="inline-flex w-20 h-20 items-center justify-center rounded-3xl mb-4 animate-float" style="background: var(--accent); box-shadow: 0 8px 24px -8px rgba(255, 122, 109, 0.5);">
                <svg viewBox="0 0 64 64" class="w-12 h-12" aria-hidden="true">
                  <ellipse cx="32" cy="38" rx="24" ry="6" fill="#FFFFFF"/>
                  <path d="M8 38 Q32 60 56 38 Z" fill="#FFFFFF"/>
                  <circle cx="22" cy="22" r="3" fill="#FFFFFF" opacity="0.8"/>
                  <circle cx="32" cy="18" r="2.5" fill="#FFFFFF" opacity="0.65"/>
                  <circle cx="42" cy="24" r="2" fill="#FFFFFF" opacity="0.5"/>
                </svg>
              </div>
              <h2 class="text-text-primary font-bold tracking-[-0.03em] leading-[1.15]" style="font-size: 28px;">
                반가워요! 👋
              </h2>
              <p class="text-callout text-text-secondary mt-2">
                오늘의 밥에 오신 걸 환영해요
              </p>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex gap-3 items-start">
                <span class="icon-squircle icon-squircle--quick !w-10 !h-10 !rounded-xl shrink-0">
                  <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M9 5v14l11-7z" />
                  </svg>
                </span>
                <div class="flex-1">
                  <p class="text-body text-text-primary font-semibold">5초 안에 끼니 결정</p>
                  <p class="text-footnote text-text-tertiary mt-0.5">
                    Quick · 토너먼트 · 슬롯 세 가지 모드로
                  </p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <span class="icon-squircle icon-squircle--tournament !w-10 !h-10 !rounded-xl shrink-0">
                  <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="6" width="18" height="14" rx="2.5" />
                    <circle cx="12" cy="13" r="3.5" />
                    <path d="M8 6l1.5-2h5L16 6" />
                  </svg>
                </span>
                <div class="flex-1">
                  <p class="text-body text-text-primary font-semibold">한 끼 한 컷 기록</p>
                  <p class="text-footnote text-text-tertiary mt-0.5">
                    먹은 메뉴를 사진으로 남겨두면
                  </p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <span class="icon-squircle icon-squircle--slot !w-10 !h-10 !rounded-xl shrink-0">
                  <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <div class="flex-1">
                  <p class="text-body text-text-primary font-semibold">한 주를 영상으로</p>
                  <p class="text-footnote text-text-tertiary mt-0.5">
                    자동으로 영상이 만들어져요
                  </p>
                </div>
              </div>
            </div>

            <button class="btn-primary" @click="dismissWelcome">
              시작하기
            </button>
            <p class="text-caption-1 text-text-tertiary text-center mt-3">
              모든 기록은 이 기기에만 저장돼요
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
