<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { menus } from '@/data/menus'
import { useHistoryStore } from '@/stores/history'
import type { Category, DecisionEntry, MealType } from '@/types'

type RangeTab = 'week' | 'month' | 'all'

const router = useRouter()
const history = useHistoryStore()

const range = ref<RangeTab>('week')

const TABS: RangeTab[] = ['week', 'month', 'all']

const RANGE_LABELS: Record<RangeTab, string> = {
  week: '이번 주',
  month: '이번 달',
  all: '전체',
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: '아침',
  brunch: '브런치',
  lunch: '점심',
  dinner: '저녁',
  latenight: '야식',
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

const menuById = new Map(menus.map((m) => [m.id, m]))

const entriesInRange = computed<DecisionEntry[]>(() => {
  const all = history.entries
  if (range.value === 'all') return all
  const now = Date.now()
  const cutoff = range.value === 'week'
    ? now - 7 * 24 * 60 * 60 * 1000
    : now - 30 * 24 * 60 * 60 * 1000
  return all.filter((e) => new Date(e.timestamp).getTime() >= cutoff)
})

const grouped = computed(() => {
  const map = new Map<string, DecisionEntry[]>()
  for (const entry of entriesInRange.value) {
    const date = new Date(entry.timestamp)
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getDay()}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(entry)
  }
  return [...map.entries()].map(([key, entries]) => {
    const [y, m, d, dayIdx] = key.split('-').map(Number)
    return {
      label: `${m}/${d} ${DAY_LABELS[dayIdx]}`,
      year: y,
      entries,
    }
  })
})

const categoryStats = computed(() => {
  const counts = new Map<Category, number>()
  let total = 0
  for (const entry of entriesInRange.value) {
    const menu = menuById.get(entry.menuId)
    if (!menu) continue
    counts.set(menu.category, (counts.get(menu.category) ?? 0) + 1)
    total += 1
  }
  if (total === 0) return []
  return [...counts.entries()]
    .map(([category, count]) => ({
      category,
      count,
      percent: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
})

function lookupMenu(entry: DecisionEntry) {
  return menuById.get(entry.menuId)
}

function outcomeLabel(entry: DecisionEntry): string {
  if (entry.outcome === 'eaten') return '먹음'
  if (entry.outcome === 'passed') return '패스'
  return ''
}

function outcomeClass(entry: DecisionEntry): string {
  if (entry.outcome === 'eaten') return 'text-success'
  if (entry.outcome === 'passed') return 'text-text-tertiary'
  return 'text-text-tertiary'
}

function openEntry(entry: DecisionEntry): void {
  router.push(`/decide/result/${entry.id}`)
}

function removeEntry(entry: DecisionEntry, event: Event): void {
  event.stopPropagation()
  history.remove(entry.id)
}
</script>

<template>
  <main class="min-h-dvh px-5 pt-12 pb-safe">
    <header class="mb-6">
      <RouterLink to="/" class="text-callout text-text-secondary">← 홈</RouterLink>
      <h1 class="text-large-title text-text-primary mt-3">결정 기록</h1>
    </header>

    <div class="grid grid-cols-3 gap-1 p-1 bg-surface rounded-md mb-6">
      <button
        v-for="tab in TABS"
        :key="tab"
        class="py-2 rounded-sm text-subheadline transition-colors duration-fast"
        :class="range === tab
          ? 'bg-surface-elevated text-text-primary shadow-sm'
          : 'text-text-secondary'"
        @click="range = tab"
      >
        {{ RANGE_LABELS[tab] }}
      </button>
    </div>

    <section v-if="entriesInRange.length > 0" class="space-y-8">
      <div v-for="group in grouped" :key="group.label">
        <h2 class="text-footnote text-text-tertiary uppercase tracking-wider mb-2 px-4">
          {{ group.label }}
        </h2>
        <div class="card !p-0 overflow-hidden">
          <button
            v-for="entry in group.entries"
            :key="entry.id"
            class="cell w-full text-left"
            @click="openEntry(entry)"
          >
            <span class="text-caption-1 text-text-tertiary w-12 shrink-0">
              {{ MEAL_LABELS[entry.mealType] }}
            </span>
            <span class="flex-1 text-body text-text-primary">
              {{ lookupMenu(entry)?.name ?? '(삭제된 메뉴)' }}
            </span>
            <span class="text-caption-1 mr-2" :class="outcomeClass(entry)">
              {{ outcomeLabel(entry) }}
            </span>
            <button
              class="text-text-tertiary hover:text-destructive text-callout w-8 h-8 -m-2"
              aria-label="삭제"
              @click="removeEntry(entry, $event)"
            >
              ×
            </button>
          </button>
        </div>
      </div>

      <section v-if="categoryStats.length > 0">
        <h2 class="text-footnote text-text-tertiary uppercase tracking-wider mb-2 px-4">
          카테고리 분포
        </h2>
        <div class="card space-y-3">
          <div
            v-for="stat in categoryStats"
            :key="stat.category"
            class="flex items-center gap-3"
          >
            <span class="text-callout text-text-primary w-16 shrink-0">
              {{ stat.category }}
            </span>
            <div class="flex-1 h-2 bg-surface rounded-full overflow-hidden">
              <div
                class="h-full bg-accent"
                :style="{ width: `${stat.percent}%` }"
              />
            </div>
            <span class="text-caption-1 text-text-secondary w-16 text-right">
              {{ stat.count }}회 · {{ stat.percent }}%
            </span>
          </div>
        </div>
      </section>
    </section>

    <section v-else class="text-center py-20 relative overflow-hidden">
      <span
        class="decor-blob"
        style="top: -20px; left: 50%; transform: translateX(-50%); width: 280px; height: 220px; background: radial-gradient(ellipse, var(--accent-soft) 0%, transparent 70%);"
      />
      <div class="relative">
        <div class="empty-illust animate-float">
          <svg viewBox="0 0 64 64" class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="32" cy="32" r="22" />
            <path d="M32 18v14l9 5" />
            <circle cx="32" cy="32" r="2" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <p class="text-body text-text-primary font-semibold mb-1">아직 결정 기록이 없어요</p>
        <p class="text-footnote text-text-tertiary mb-5">
          홈에서 한 끼 정해보세요
        </p>
        <RouterLink
          to="/"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-accent text-white text-callout font-semibold transition-transform duration-fast active:scale-95"
          style="box-shadow: 0 4px 12px -4px rgba(255, 122, 109, 0.5);"
        >
          지금 정하러 가기
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </RouterLink>
      </div>
    </section>
  </main>
</template>
