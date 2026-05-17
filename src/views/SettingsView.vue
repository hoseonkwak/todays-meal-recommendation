<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { deletePhoto, deleteReel, listPhotos, listReels } from '@/composables/db'
import { useHistoryStore } from '@/stores/history'
import { usePreferencesStore } from '@/stores/preferences'
import { useThemeStore } from '@/stores/theme'
import type { Theme } from '@/types'

const theme = useThemeStore()
const prefs = usePreferencesStore()
const history = useHistoryStore()

const themeOptions: { value: Theme; label: string }[] = [
  { value: 'system', label: '시스템 기본' },
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
]

const AVOIDANCE_OPTIONS = [1, 2, 3, 5, 7]

type ClearTarget = 'decisions' | 'photos' | 'reels' | 'all'

const clearTarget = ref<ClearTarget | null>(null)
const isClearing = ref(false)
const toast = ref<string | null>(null)

function vibrate(p: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(p)
  }
}

function setAvoidance(days: number) {
  vibrate(4)
  prefs.update({ avoidanceWindowDays: days })
}

function toggleLocation() {
  vibrate(4)
  prefs.update({ locationEnabled: !prefs.preferences.locationEnabled })
}

function toggleNotifications() {
  vibrate(4)
  prefs.update({ notificationsEnabled: !prefs.preferences.notificationsEnabled })
}

function openClear(t: ClearTarget) {
  clearTarget.value = t
}

function cancelClear() {
  clearTarget.value = null
}

function showToast(message: string) {
  toast.value = message
  setTimeout(() => { toast.value = null }, 2400)
}

async function clearAllPhotos() {
  const photos = await listPhotos()
  for (const p of photos) await deletePhoto(p.id)
}

async function clearAllReels() {
  const reels = await listReels()
  for (const r of reels) await deleteReel(r.id)
}

async function performClear() {
  if (!clearTarget.value || isClearing.value) return
  isClearing.value = true
  const target = clearTarget.value
  try {
    if (target === 'decisions' || target === 'all') history.clear()
    if (target === 'photos' || target === 'all') await clearAllPhotos()
    if (target === 'reels' || target === 'all') await clearAllReels()
    if (target === 'all') prefs.reset()
    vibrate([10, 30, 10])
    const labels: Record<ClearTarget, string> = {
      decisions: '결정 기록이 모두 삭제됐어요',
      photos: '식사 사진이 모두 삭제됐어요',
      reels: '영상이 모두 삭제됐어요',
      all: '모든 데이터가 초기화됐어요',
    }
    showToast(labels[target])
  } catch (err) {
    showToast('삭제 중 문제가 생겼어요')
    console.error('[settings] clear failed', err)
  } finally {
    isClearing.value = false
    clearTarget.value = null
  }
}

const CLEAR_MESSAGES: Record<ClearTarget, string> = {
  decisions: '모든 결정 기록이 삭제돼요. 추천 정확도에 영향이 있어요.',
  photos: '저장된 모든 식사 사진이 삭제돼요. 되돌릴 수 없어요.',
  reels: '만들었던 모든 영상이 삭제돼요.',
  all: '모든 기록·사진·영상·설정이 초기화돼요. 되돌릴 수 없어요.',
}
</script>

<template>
  <main class="min-h-shell px-5 pt-12 pb-safe">
    <header class="mb-8">
      <RouterLink to="/" class="text-callout text-text-secondary">← 홈</RouterLink>
      <h1 class="text-large-title text-text-primary mt-3 font-bold tracking-[-0.03em]">설정</h1>
    </header>

    <section class="mb-8">
      <h2 class="text-footnote text-text-tertiary mb-2 px-1">테마</h2>
      <div class="card !p-0 overflow-hidden">
        <button
          v-for="opt in themeOptions"
          :key="opt.value"
          class="cell w-full text-left"
          :class="theme.theme === opt.value ? 'text-accent' : 'text-text-primary'"
          @click="theme.setTheme(opt.value)"
        >
          <span class="flex-1 text-body">{{ opt.label }}</span>
          <svg
            v-if="theme.theme === opt.value"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        </button>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-footnote text-text-tertiary mb-2 px-1">추천</h2>
      <div class="card">
        <div class="flex items-baseline justify-between mb-1">
          <p class="text-body text-text-primary font-semibold">최근 먹은 메뉴 피하기</p>
          <span class="text-callout text-accent font-bold">
            {{ prefs.preferences.avoidanceWindowDays }}일
          </span>
        </div>
        <p class="text-caption-1 text-text-tertiary mb-4">
          최근 {{ prefs.preferences.avoidanceWindowDays }}일 내 먹은 메뉴는 추천에서 빠져요
        </p>
        <div class="flex gap-2">
          <button
            v-for="d in AVOIDANCE_OPTIONS"
            :key="d"
            class="flex-1 py-2.5 rounded-full text-subheadline font-semibold transition-all duration-fast active:scale-95"
            :class="prefs.preferences.avoidanceWindowDays === d
              ? 'bg-accent text-white shadow-sm'
              : 'bg-surface text-text-secondary'"
            @click="setAvoidance(d)"
          >
            {{ d }}일
          </button>
        </div>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-footnote text-text-tertiary mb-2 px-1">권한</h2>
      <div class="card !p-0 overflow-hidden">
        <button class="cell w-full text-left" @click="toggleLocation">
          <span class="flex-1">
            <span class="block text-body text-text-primary">위치 정보</span>
            <span class="block text-caption-1 text-text-tertiary mt-1">
              날씨 기반 추천에 사용 (v2.1 예정)
            </span>
          </span>
          <span
            class="toggle"
            :class="{ 'is-on': prefs.preferences.locationEnabled }"
            aria-hidden="true"
          />
        </button>
        <button class="cell w-full text-left" @click="toggleNotifications">
          <span class="flex-1">
            <span class="block text-body text-text-primary">식사 시간 알림</span>
            <span class="block text-caption-1 text-text-tertiary mt-1">
              아침·점심·저녁·야식 시간에 알림 (v2.1 예정)
            </span>
          </span>
          <span
            class="toggle"
            :class="{ 'is-on': prefs.preferences.notificationsEnabled }"
            aria-hidden="true"
          />
        </button>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-footnote text-text-tertiary mb-2 px-1">데이터</h2>
      <div class="card !p-0 overflow-hidden">
        <button class="cell w-full text-left" @click="openClear('decisions')">
          <span class="flex-1 text-body text-text-primary">결정 기록 삭제</span>
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        <button class="cell w-full text-left" @click="openClear('photos')">
          <span class="flex-1 text-body text-text-primary">식사 사진 삭제</span>
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        <button class="cell w-full text-left" @click="openClear('reels')">
          <span class="flex-1 text-body text-text-primary">영상 삭제</span>
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
        <button class="cell w-full text-left" @click="openClear('all')">
          <span class="flex-1 text-body text-destructive font-semibold">모두 초기화</span>
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-destructive" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-footnote text-text-tertiary mb-2 px-1">앱 정보</h2>
      <div class="card text-center relative overflow-hidden">
        <span
          class="decor-blob"
          style="top: -40px; right: -40px; width: 140px; height: 140px; background: radial-gradient(circle, var(--accent-soft) 0%, transparent 70%);"
        />
        <div class="relative">
          <div class="inline-flex w-12 h-12 items-center justify-center rounded-2xl mb-2" style="background: var(--accent);">
            <svg viewBox="0 0 64 64" class="w-7 h-7" aria-hidden="true">
              <ellipse cx="32" cy="38" rx="24" ry="6" fill="#FFFFFF"/>
              <path d="M8 38 Q32 60 56 38 Z" fill="#FFFFFF"/>
            </svg>
          </div>
          <p class="text-body text-text-primary font-bold">오늘의 밥</p>
          <p class="text-caption-1 text-text-tertiary mt-1">v2.0</p>
          <p class="text-caption-1 text-text-tertiary mt-3">
            5초 안에 끼니를 결정하게 해주는 도구
          </p>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="page">
        <div
          v-if="clearTarget"
          class="modal-backdrop"
          role="dialog"
          aria-modal="true"
          @click.self="cancelClear"
        >
          <div class="modal-sheet">
            <div class="sheet-handle sm:hidden" />
            <h3 class="text-title-3 text-text-primary mt-4 sm:mt-0 mb-2 font-bold">
              정말 삭제할까요?
            </h3>
            <p class="text-callout text-text-secondary mb-6">
              {{ CLEAR_MESSAGES[clearTarget] }}
            </p>
            <div class="space-y-2">
              <button
                class="btn-primary"
                style="background: var(--destructive); box-shadow: 0 4px 12px -4px rgba(255, 90, 95, 0.5);"
                :disabled="isClearing"
                @click="performClear"
              >
                {{ isClearing ? '삭제 중...' : '삭제하기' }}
              </button>
              <button class="btn-secondary" @click="cancelClear">취소</button>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="page">
        <div
          v-if="toast"
          class="fixed left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl bg-text-primary text-bg text-callout font-semibold shadow-lg"
          style="bottom: calc(24px + env(safe-area-inset-bottom));"
          role="status"
        >
          {{ toast }}
        </div>
      </Transition>
    </Teleport>
  </main>
</template>
