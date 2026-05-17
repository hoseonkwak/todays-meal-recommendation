<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  getCurrentMealType,
  recommendCandidates,
} from '@/composables/recommendation'
import { useHistoryStore } from '@/stores/history'
import { usePreferencesStore } from '@/stores/preferences'
import type { Menu } from '@/types'

const COUNT_OPTIONS = [3, 5, 7] as const
type CountOption = typeof COUNT_OPTIONS[number]

const router = useRouter()
const history = useHistoryStore()
const prefs = usePreferencesStore()

const count = ref<CountOption>(5)
const candidates = ref<Menu[]>([])
const round = ref(1)
const winner = ref<Menu | null>(null)
const mealType = getCurrentMealType()

const totalRounds = computed(() => Math.max(0, candidates.value.length - 1))

const matchup = computed<[Menu, Menu] | null>(() => {
  const list = candidates.value
  if (list.length < 2) return null
  if (round.value === 1) return [list[0], list[1]]
  if (winner.value && round.value < list.length) {
    return [winner.value, list[round.value]]
  }
  return null
})

const isFinalRound = computed(() => round.value === totalRounds.value && totalRounds.value > 0)

function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

function pickCandidates(): void {
  const recentList = history.recentMenuIds(prefs.preferences.avoidanceWindowDays)
  candidates.value = recommendCandidates(count.value, {
    mealType,
    preferredCategories: prefs.preferences.preferredCategories,
    excludedMenuIds: prefs.preferences.excludedMenuIds,
    recentMenuIds: recentList,
  })
  round.value = 1
  winner.value = null
}

function onPick(menu: Menu): void {
  vibrate(10)
  winner.value = menu
  if (isFinalRound.value) {
    const entry = history.add({
      menuId: menu.id,
      mode: 'tournament',
      mealType,
    })
    router.push(`/decide/result/${entry.id}`)
    return
  }
  round.value += 1
}

function changeCount(next: CountOption): void {
  if (next === count.value) return
  vibrate(4)
  count.value = next
  pickCandidates()
}

function onRestart(): void {
  vibrate(4)
  pickCandidates()
}

onMounted(() => {
  pickCandidates()
})
</script>

<template>
  <main class="min-h-shell px-5 pt-12 pb-safe">
    <header class="flex items-center justify-between mb-6">
      <RouterLink to="/" class="text-callout text-text-secondary">← 홈</RouterLink>
      <span class="text-footnote text-text-tertiary">Tournament</span>
    </header>

    <div class="flex items-center justify-center gap-1.5 mb-6 p-1 bg-surface rounded-full w-fit mx-auto">
      <button
        v-for="opt in COUNT_OPTIONS"
        :key="opt"
        class="px-4 py-1.5 rounded-full text-subheadline font-semibold transition-all duration-fast active:scale-95"
        :class="count === opt
          ? 'bg-accent text-white shadow-sm'
          : 'text-text-secondary'"
        @click="changeCount(opt)"
      >
        {{ opt }}개
      </button>
    </div>

    <section v-if="matchup" class="space-y-6">
      <div class="flex items-center justify-center gap-2">
        <div class="flex items-center gap-1">
          <span
            v-for="n in totalRounds"
            :key="n"
            class="block h-1.5 rounded-full transition-all duration-fast"
            :class="n < round
              ? 'w-6 bg-accent'
              : n === round
                ? 'w-8 bg-accent'
                : 'w-6 bg-surface'"
          />
        </div>
      </div>

      <p class="text-center text-footnote text-text-tertiary">
        <span v-if="isFinalRound" class="text-accent font-semibold">최종 라운드</span>
        <span v-else>Round {{ round }} / {{ totalRounds }} · 더 끌리는 거 골라주세요</span>
      </p>

      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="menu in matchup"
          :key="menu.id"
          class="card card-tap text-center py-10 px-4"
          @click="onPick(menu)"
        >
          <p class="text-caption-1 text-text-tertiary mb-2">{{ menu.category }}</p>
          <h2 class="text-title-2 text-text-primary mb-2 leading-tight">{{ menu.name }}</h2>
          <p v-if="menu.tags.length" class="text-caption-1 text-text-secondary">
            {{ menu.tags.slice(0, 2).join(' · ') }}
          </p>
        </button>
      </div>

      <div class="pt-2 text-center">
        <button
          class="inline-flex items-center gap-1.5 text-callout text-text-secondary px-3 py-2"
          @click="onRestart"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 4v5h-5" />
          </svg>
          후보 다시 뽑기
        </button>
      </div>
    </section>

    <section v-else class="text-center py-24 text-text-secondary">
      후보를 준비하고 있어요...
    </section>
  </main>
</template>
