<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { buildResultActions } from '@/composables/resultActions'
import { menus } from '@/data/menus'
import { useHistoryStore } from '@/stores/history'
import type { DecisionEntry, DecisionOutcome, Menu, ResultAction } from '@/types'

const props = defineProps<{ id: string }>()

const router = useRouter()
const history = useHistoryStore()

const entry = ref<DecisionEntry | null>(null)
const menu = ref<Menu | null>(null)

const actions = computed<ResultAction[]>(() =>
  menu.value ? buildResultActions(menu.value) : [],
)

const feedback = computed<DecisionOutcome>(() => entry.value?.outcome ?? 'unknown')

function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

function setOutcome(outcome: DecisionOutcome): void {
  if (!entry.value) return
  vibrate(10)
  history.updateOutcome(entry.value.id, outcome)
  entry.value = { ...entry.value, outcome }
}

function onAction(action: ResultAction): void {
  vibrate(5)
  if (action.route) {
    if (action.type === 'capture' && entry.value) {
      router.push({ path: action.route, query: { entryId: entry.value.id } })
    } else {
      router.push(action.route)
    }
    return
  }
  if (action.url) {
    window.open(action.url, '_blank', 'noopener,noreferrer')
  }
}

onMounted(() => {
  const found = history.findById(props.id)
  if (!found) {
    router.replace('/')
    return
  }
  entry.value = found
  menu.value = menus.find((m) => m.id === found.menuId) ?? null
})
</script>

<template>
  <main class="min-h-dvh px-5 pt-12 pb-safe">
    <header class="flex items-center justify-between mb-8">
      <RouterLink to="/" class="text-callout text-text-secondary">← 홈</RouterLink>
      <span class="text-footnote text-text-tertiary">Result</span>
    </header>

    <section v-if="menu" class="space-y-7">
      <article class="card py-14 text-center">
        <span class="inline-flex items-center px-3 py-1 rounded-full bg-accent/12 text-accent text-caption-1 font-semibold mb-5">
          {{ menu.category }}
        </span>
        <h1
          class="text-text-primary font-bold tracking-[-0.03em] leading-[1.1] mb-3"
          style="font-size: 40px;"
        >
          {{ menu.name }}
        </h1>
        <p v-if="menu.tags.length" class="text-callout text-text-secondary">
          {{ menu.tags.slice(0, 4).join(' · ') }}
        </p>
      </article>

      <section>
        <h2 class="text-footnote text-text-tertiary mb-3 px-1">이어서</h2>
        <div class="space-y-2">
          <button
            v-for="action in actions"
            :key="action.type"
            class="card card-tap flex items-center gap-3 w-full text-left"
            @click="onAction(action)"
          >
            <span class="icon-squircle icon-squircle--muted !w-10 !h-10 !rounded-xl">
              <svg v-if="action.type === 'capture'" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="6" width="18" height="14" rx="2.5" />
                <circle cx="12" cy="13" r="3.5" />
                <path d="M8 6l1.5-2h5L16 6" />
              </svg>
              <svg v-else-if="action.type === 'mealkit'" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 7h12l-1 13H7L6 7z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              <svg v-else-if="action.type === 'map'" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 21s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="6" cy="18" r="2" />
                <circle cx="17" cy="18" r="2" />
                <path d="M4 6h11l3 8" />
                <path d="M8 18h7" />
              </svg>
            </span>
            <span class="flex-1 text-body text-text-primary font-medium">
              {{ action.label }}
            </span>
            <svg viewBox="0 0 24 24" class="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </section>

      <section>
        <h2 class="text-footnote text-text-tertiary mb-3 px-1">기록</h2>
        <div class="grid grid-cols-2 gap-2">
          <button
            class="py-4 rounded-2xl font-semibold transition-all duration-fast active:scale-[0.98]"
            :class="feedback === 'eaten'
              ? 'bg-accent text-white'
              : 'bg-surface text-text-primary'"
            @click="setOutcome('eaten')"
          >
            먹었어요
          </button>
          <button
            class="py-4 rounded-2xl font-semibold transition-all duration-fast active:scale-[0.98]"
            :class="feedback === 'passed'
              ? 'bg-text-tertiary text-white'
              : 'bg-surface text-text-primary'"
            @click="setOutcome('passed')"
          >
            패스
          </button>
        </div>
      </section>
    </section>

    <section v-else class="text-center py-24 text-text-secondary">
      메뉴를 불러오는 중...
    </section>
  </main>
</template>
