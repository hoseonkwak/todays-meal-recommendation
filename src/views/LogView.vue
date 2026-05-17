<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { deletePhoto, listPhotos } from '@/composables/db'
import type { MealPhoto, MealType } from '@/types'

const photos = ref<MealPhoto[]>([])
const selected = ref<MealPhoto | null>(null)
const urlCache = new Map<string, string>()

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: '아침',
  brunch: '브런치',
  lunch: '점심',
  dinner: '저녁',
  latenight: '야식',
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function urlFor(photo: MealPhoto, full = false): string {
  const key = full ? `${photo.id}:full` : photo.id
  const cached = urlCache.get(key)
  if (cached) return cached
  const blob = full ? photo.imageBlob : photo.thumbnailBlob
  const url = URL.createObjectURL(blob)
  urlCache.set(key, url)
  return url
}

function releaseAllUrls(): void {
  for (const url of urlCache.values()) URL.revokeObjectURL(url)
  urlCache.clear()
}

const grouped = computed(() => {
  const map = new Map<string, MealPhoto[]>()
  for (const p of photos.value) {
    const d = new Date(p.takenAt)
    const key = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-')
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(p)
  }
  return [...map.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, entries]) => {
      const [, mm, dd] = key.split('-')
      const dow = DAY_LABELS[new Date(`${key}T00:00:00`).getDay()]
      return {
        label: `${Number(mm)}/${Number(dd)} ${dow}`,
        entries: entries.sort((a, b) => b.takenAt.localeCompare(a.takenAt)),
      }
    })
})

async function load(): Promise<void> {
  photos.value = await listPhotos()
}

function openPhoto(photo: MealPhoto): void {
  selected.value = photo
}

function closePhoto(): void {
  selected.value = null
}

async function removeSelected(): Promise<void> {
  if (!selected.value) return
  const id = selected.value.id
  await deletePhoto(id)
  urlCache.delete(id)
  urlCache.delete(`${id}:full`)
  selected.value = null
  await load()
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

onMounted(load)
onBeforeUnmount(releaseAllUrls)
</script>

<template>
  <main class="min-h-dvh px-5 pt-12 pb-safe">
    <header class="mb-6">
      <RouterLink to="/" class="text-callout text-text-secondary">← 홈</RouterLink>
      <div class="flex items-end justify-between mt-3">
        <h1 class="text-large-title text-text-primary">식사 로그</h1>
        <RouterLink to="/capture" class="text-callout text-accent">
          + 기록
        </RouterLink>
      </div>
    </header>

    <section v-if="photos.length > 0" class="space-y-8">
      <div v-for="group in grouped" :key="group.label">
        <h2 class="text-footnote text-text-tertiary uppercase tracking-wider mb-2 px-1">
          {{ group.label }}
        </h2>
        <div class="grid grid-cols-3 gap-1">
          <button
            v-for="p in group.entries"
            :key="p.id"
            class="aspect-square overflow-hidden rounded-sm bg-surface relative"
            @click="openPhoto(p)"
          >
            <img
              :src="urlFor(p)"
              :alt="p.menuName"
              class="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <span class="absolute left-1 bottom-1 text-caption-2 text-white px-1.5 py-0.5 bg-black/40 rounded-sm backdrop-blur-sm">
              {{ MEAL_LABELS[p.mealType] }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <section v-else class="text-center py-20 relative overflow-hidden">
      <span
        class="decor-blob"
        style="top: -20px; left: 50%; transform: translateX(-50%); width: 280px; height: 220px; background: radial-gradient(ellipse, var(--accent-soft) 0%, transparent 70%);"
      />
      <div class="relative">
        <div class="empty-illust animate-float">
          <svg viewBox="0 0 64 64" class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="8" y="18" width="48" height="36" rx="6" />
            <circle cx="32" cy="38" r="9" />
            <path d="M20 18l4-6h16l4 6" />
            <circle cx="48" cy="26" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <p class="text-body text-text-primary font-semibold mb-1">아직 기록한 식사가 없어요</p>
        <p class="text-footnote text-text-tertiary mb-5">
          한 컷씩 모이면 한 주를 영상으로 돌려드려요
        </p>
        <RouterLink
          to="/capture"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-accent text-white text-callout font-semibold transition-transform duration-fast active:scale-95"
          style="box-shadow: 0 4px 12px -4px rgba(255, 122, 109, 0.5);"
        >
          지금 한 컷 남기기
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </RouterLink>
      </div>
    </section>

    <div
      v-if="selected"
      class="fixed inset-0 z-50 bg-black/95 flex flex-col"
      role="dialog"
      @click.self="closePhoto"
    >
      <header class="flex items-center justify-between p-4 pt-safe text-white">
        <button class="text-headline px-3 py-2 -mx-3 -my-2" @click="closePhoto">×</button>
        <button
          class="text-callout px-3 py-2 text-destructive"
          @click="removeSelected"
        >
          삭제
        </button>
      </header>
      <section class="flex-1 flex items-center justify-center px-4">
        <img
          :src="urlFor(selected, true)"
          :alt="selected.menuName"
          class="max-w-full max-h-full object-contain rounded-md"
        />
      </section>
      <footer class="p-6 pb-safe text-white text-center">
        <p class="text-title-3">{{ selected.menuName }}</p>
        <p class="text-footnote text-white/60 mt-1">
          {{ MEAL_LABELS[selected.mealType] }} · {{ formatTime(selected.takenAt) }}
        </p>
      </footer>
    </div>
  </main>
</template>
