<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  getCurrentMealType,
  recommendCandidates,
} from '@/composables/recommendation'
import { useHistoryStore } from '@/stores/history'
import { usePreferencesStore } from '@/stores/preferences'
import type { Menu } from '@/types'

const POOL_SIZE = 40
const SPIN_INITIAL_INTERVAL_MS = 80
const DECEL_STEPS = [120, 180, 260, 380, 560, 820] as const

const router = useRouter()
const history = useHistoryStore()
const prefs = usePreferencesStore()

const pool = ref<Menu[]>([])
const currentMenu = ref<Menu | null>(null)
const spinning = ref(false)
const decelerating = ref(false)

let timerId: number | null = null
const mealType = getCurrentMealType()

function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

function pickFromPool(): Menu | null {
  if (pool.value.length === 0) return null
  const idx = Math.floor(Math.random() * pool.value.length)
  return pool.value[idx]
}

function clearTimer(): void {
  if (timerId !== null) {
    window.clearTimeout(timerId)
    timerId = null
  }
}

function tickWhileSpinning(): void {
  currentMenu.value = pickFromPool()
  if (!spinning.value) return
  timerId = window.setTimeout(tickWhileSpinning, SPIN_INITIAL_INTERVAL_MS)
}

function startSpin(): void {
  clearTimer()
  decelerating.value = false
  spinning.value = true
  tickWhileSpinning()
}

function decelerateThenConfirm(stepIndex: number): void {
  if (stepIndex >= DECEL_STEPS.length) {
    confirmCurrent()
    return
  }
  currentMenu.value = pickFromPool()
  timerId = window.setTimeout(() => decelerateThenConfirm(stepIndex + 1), DECEL_STEPS[stepIndex])
}

function onStop(): void {
  if (!spinning.value || decelerating.value) return
  vibrate(10)
  spinning.value = false
  decelerating.value = true
  clearTimer()
  decelerateThenConfirm(0)
}

function confirmCurrent(): void {
  if (!currentMenu.value) return
  vibrate([20, 40, 20])
  const entry = history.add({
    menuId: currentMenu.value.id,
    mode: 'slot',
    mealType,
  })
  router.push(`/decide/result/${entry.id}`)
}

function refillPool(): void {
  const recentList = history.recentMenuIds(prefs.preferences.avoidanceWindowDays)
  pool.value = recommendCandidates(POOL_SIZE, {
    mealType,
    preferredCategories: prefs.preferences.preferredCategories,
    excludedMenuIds: prefs.preferences.excludedMenuIds,
    recentMenuIds: recentList,
  })
}

const buttonLabel = computed(() => {
  if (decelerating.value) return '결정 중...'
  if (spinning.value) return '멈춰!'
  return '시작'
})

const isStopDisabled = computed(() => decelerating.value || pool.value.length === 0)

onMounted(() => {
  refillPool()
  startSpin()
})

onBeforeUnmount(() => {
  spinning.value = false
  clearTimer()
})
</script>

<template>
  <main class="min-h-shell h-full px-5 pt-12 pb-safe flex flex-col">
    <header class="flex items-center justify-between mb-8">
      <RouterLink to="/" class="text-callout text-text-secondary">← 홈</RouterLink>
      <span class="text-footnote text-text-tertiary">Slot</span>
    </header>

    <section class="flex-1 flex flex-col items-center justify-center gap-8">
      <article class="card w-full py-16 text-center min-h-[180px] flex flex-col justify-center">
        <p
          v-if="currentMenu"
          class="text-footnote text-text-tertiary mb-2"
        >
          {{ currentMenu.category }}
        </p>
        <h1
          class="text-large-title text-text-primary"
          :class="{ 'transition-opacity duration-fast': decelerating }"
        >
          {{ currentMenu?.name ?? '...' }}
        </h1>
      </article>

      <p class="text-callout text-text-secondary text-center">
        멈추는 순간이 오늘의 메뉴
      </p>
    </section>

    <button
      class="w-full py-5 rounded-lg text-headline text-white transition-transform duration-fast active:scale-[0.98] disabled:opacity-50"
      :class="decelerating ? 'bg-text-tertiary' : 'bg-accent'"
      :disabled="isStopDisabled"
      @click="onStop"
    >
      {{ buttonLabel }}
    </button>
  </main>
</template>
