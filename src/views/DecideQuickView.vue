<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  getCurrentMealType,
  recommend,
  recommendCandidates,
} from '@/composables/recommendation'
import { useHistoryStore } from '@/stores/history'
import { usePreferencesStore } from '@/stores/preferences'
import type { Menu } from '@/types'

const MAX_REJECTIONS = 5
const PREVIEW_FLASH_COUNT = 5
const PREVIEW_FLASH_MS = 140

const router = useRouter()
const history = useHistoryStore()
const prefs = usePreferencesStore()

const currentMenu = ref<Menu | null>(null)
const rejectionCount = ref(0)
const sessionExcluded = ref<string[]>([])
const isPicking = ref(false)

const mealType = getCurrentMealType()
const isForcedFinalRound = computed(() => rejectionCount.value >= MAX_REJECTIONS)
const remainingRejections = computed(() => Math.max(0, MAX_REJECTIONS - rejectionCount.value))

function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

function buildContext() {
  const recentList = history.recentMenuIds(prefs.preferences.avoidanceWindowDays)
  return {
    mealType,
    preferredCategories: prefs.preferences.preferredCategories,
    excludedMenuIds: [
      ...prefs.preferences.excludedMenuIds,
      ...sessionExcluded.value,
    ],
    recentMenuIds: recentList,
  }
}

async function pickMenu(): Promise<void> {
  isPicking.value = true

  const ctx = buildContext()
  const previews = recommendCandidates(Math.max(3, PREVIEW_FLASH_COUNT), ctx)
  if (previews.length === 0) {
    currentMenu.value = null
    isPicking.value = false
    return
  }

  for (let i = 0; i < PREVIEW_FLASH_COUNT; i++) {
    const idx = Math.floor(Math.random() * previews.length)
    currentMenu.value = previews[idx]
    vibrate(3)
    await new Promise((r) => setTimeout(r, PREVIEW_FLASH_MS))
  }

  currentMenu.value = recommend(ctx) ?? previews[0]
  vibrate(18)
  isPicking.value = false
}

function onLike(): void {
  if (!currentMenu.value || isPicking.value) return
  vibrate(10)
  const entry = history.add({
    menuId: currentMenu.value.id,
    mode: 'quick',
    mealType,
  })
  router.push(`/decide/result/${entry.id}`)
}

function onReject(): void {
  if (!currentMenu.value || isPicking.value || isForcedFinalRound.value) return
  vibrate(5)
  sessionExcluded.value = [...sessionExcluded.value, currentMenu.value.id]
  rejectionCount.value += 1
  pickMenu()
}

onMounted(() => {
  pickMenu()
})
</script>

<template>
  <main class="min-h-shell px-5 pt-12 pb-safe">
    <header class="flex items-center justify-between mb-8">
      <RouterLink to="/" class="text-callout text-text-secondary" aria-label="홈으로">
        ← 홈
      </RouterLink>
      <span class="text-footnote text-text-tertiary">Quick</span>
    </header>

    <section v-if="currentMenu" class="space-y-6">
      <div
        v-if="isForcedFinalRound && !isPicking"
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft text-accent text-footnote font-semibold"
      >
        <span class="block w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
        이번엔 이걸로 결정해 보세요
      </div>

      <article
        class="card py-14 text-center relative overflow-hidden transition-all duration-fast"
        :class="isPicking ? 'scale-[0.98]' : 'scale-100'"
      >
        <span
          class="decor-blob"
          style="top: -50px; right: -50px; width: 160px; height: 160px; background: radial-gradient(circle, var(--accent-soft) 0%, transparent 70%);"
        />
        <div class="relative">
          <div class="flex items-center justify-center gap-1.5 mb-3 h-4">
            <template v-if="isPicking">
              <span class="block w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style="animation-delay: 0ms" />
              <span class="block w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style="animation-delay: 120ms" />
              <span class="block w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style="animation-delay: 240ms" />
            </template>
            <p v-else class="text-footnote text-text-tertiary">
              {{ currentMenu.category }}
            </p>
          </div>
          <h1
            class="text-text-primary font-bold tracking-[-0.03em] leading-[1.1] mb-3 transition-all duration-fast"
            style="font-size: 38px;"
            :class="isPicking ? 'opacity-70 blur-[1px]' : 'opacity-100 blur-0'"
          >
            {{ currentMenu.name }}
          </h1>
          <p
            v-if="!isPicking && currentMenu.tags.length"
            class="text-callout text-text-secondary"
          >
            {{ currentMenu.tags.slice(0, 4).join(' · ') }}
          </p>
          <p
            v-else-if="isPicking"
            class="text-callout text-text-secondary"
          >
            오늘의 한 끼 고르는 중
          </p>
        </div>
      </article>

      <div class="grid grid-cols-2 gap-3">
        <button
          v-if="!isForcedFinalRound"
          class="card text-callout text-text-primary py-4 disabled:opacity-50"
          :disabled="isPicking"
          @click="onReject"
        >
          이거 말고
          <span class="block text-caption-1 text-text-tertiary mt-1">
            {{ remainingRejections }}회 남음
          </span>
        </button>
        <button
          v-else
          class="card text-callout text-text-tertiary py-4 cursor-not-allowed"
          disabled
        >
          더 못 미뤄요
        </button>

        <button
          class="bg-accent text-white rounded-2xl text-headline font-bold py-4 transition-transform duration-fast active:scale-[0.97] disabled:opacity-50"
          style="box-shadow: 0 4px 12px -4px rgba(255, 122, 109, 0.5);"
          :disabled="isPicking"
          @click="onLike"
        >
          좋아요
        </button>
      </div>
    </section>

    <section v-else class="text-center py-24 text-text-secondary">
      메뉴를 찾고 있어요...
    </section>
  </main>
</template>
