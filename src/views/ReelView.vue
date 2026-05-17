<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { addReel, listPhotos, listReels } from '@/composables/db'
import { compileReel, generateReelId } from '@/composables/reelCompiler'
import type { MealPhoto, Reel, ReelAspect } from '@/types'

const router = useRouter()

const photos = ref<MealPhoto[]>([])
const reels = ref<Reel[]>([])
const aspect = ref<ReelAspect>('9:16')
const progress = ref(0)
const isCompiling = ref(false)
const errorMessage = ref<string | null>(null)

const ASPECT_OPTIONS: ReelAspect[] = ['9:16', '1:1', '16:9']

async function load(): Promise<void> {
  photos.value = await listPhotos()
  reels.value = await listReels()
}

const weekPhotos = computed(() => {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
  return photos.value.filter((p) => new Date(p.takenAt).getTime() >= cutoff)
})

const canCompile = computed(() => weekPhotos.value.length >= 2 && !isCompiling.value)

async function onCompile(): Promise<void> {
  if (!canCompile.value) return
  isCompiling.value = true
  progress.value = 0
  errorMessage.value = null

  try {
    const ordered = [...weekPhotos.value].sort((a, b) =>
      a.takenAt.localeCompare(b.takenAt),
    )
    const blob = await compileReel(ordered, {
      aspect: aspect.value,
      onProgress: (ratio) => {
        progress.value = ratio
      },
    })
    const now = new Date().toISOString()
    const from = ordered[0].takenAt
    const to = ordered[ordered.length - 1].takenAt
    const reel: Reel = {
      id: generateReelId(),
      range: { from, to },
      photoIds: ordered.map((p) => p.id),
      template: 'minimal',
      aspect: aspect.value,
      videoBlob: blob,
      createdAt: now,
    }
    await addReel(reel)
    router.push(`/reel/${reel.id}`)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : '영상 생성 실패'
    console.error('[reel] compile failed', err)
  } finally {
    isCompiling.value = false
  }
}

function reelLabel(reel: Reel): string {
  const from = new Date(reel.range.from)
  const to = new Date(reel.range.to)
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
  return `${fmt(from)} ~ ${fmt(to)}`
}

const progressPercent = computed(() => Math.round(progress.value * 100))

onMounted(load)
onBeforeUnmount(() => {
  // 영상 blob URL은 ReelDetailView에서 관리
})
</script>

<template>
  <main class="min-h-dvh px-5 pt-12 pb-safe">
    <header class="mb-6">
      <RouterLink to="/" class="text-callout text-text-secondary">← 홈</RouterLink>
      <h1 class="text-large-title text-text-primary mt-3">영상</h1>
    </header>

    <section class="card mb-8 relative overflow-hidden">
      <span
        class="decor-blob"
        style="top: -40px; right: -40px; width: 160px; height: 160px; background: radial-gradient(circle, var(--accent-soft) 0%, transparent 70%);"
      />
      <div class="relative">
        <p class="text-footnote text-text-tertiary mb-1">지난 7일</p>
        <p class="text-title-2 text-text-primary font-bold tracking-[-0.02em] mb-4">
          {{ weekPhotos.length }}<span class="text-callout text-text-secondary ml-1 font-normal">장의 식사 사진</span>
        </p>

        <div class="flex gap-2 mb-5">
          <button
            v-for="opt in ASPECT_OPTIONS"
            :key="opt"
            class="px-4 py-1.5 rounded-full text-subheadline font-semibold transition-all duration-fast active:scale-95"
            :class="aspect === opt
              ? 'bg-accent text-white'
              : 'bg-surface text-text-secondary'"
            @click="aspect = opt"
          >
            {{ opt }}
          </button>
        </div>

        <button
          class="w-full py-4 rounded-full text-headline font-bold text-white transition-transform duration-fast active:scale-[0.97] disabled:opacity-50"
          :class="canCompile ? 'bg-accent' : 'bg-text-tertiary'"
          :style="canCompile ? 'box-shadow: 0 4px 12px -4px rgba(255, 122, 109, 0.5);' : ''"
          :disabled="!canCompile"
          @click="onCompile"
        >
          {{ isCompiling ? `만드는 중 ${progressPercent}%` : '영상 만들기' }}
        </button>

        <div v-if="isCompiling" class="mt-3 h-1.5 bg-surface rounded-full overflow-hidden">
          <div
            class="h-full bg-accent transition-[width] duration-fast"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>

        <p v-if="errorMessage" class="mt-3 text-caption-1 text-destructive">
          {{ errorMessage }}
        </p>
        <p v-else-if="weekPhotos.length < 2" class="mt-3 text-caption-1 text-text-tertiary text-center">
          최소 2장의 사진이 필요해요 ·
          <RouterLink to="/capture" class="text-accent font-semibold">기록하러 가기</RouterLink>
        </p>
      </div>
    </section>

    <section v-if="reels.length > 0">
      <h2 class="text-footnote text-text-tertiary uppercase tracking-wider mb-2 px-1">
        지난 영상
      </h2>
      <div class="card !p-0 overflow-hidden">
        <RouterLink
          v-for="reel in reels"
          :key="reel.id"
          :to="`/reel/${reel.id}`"
          class="cell text-text-primary"
        >
          <span class="flex-1 text-body">{{ reelLabel(reel) }}</span>
          <span class="text-caption-1 text-text-tertiary mr-2">
            {{ reel.photoIds.length }}장 · {{ reel.aspect }}
          </span>
          <span class="text-text-tertiary" aria-hidden="true">›</span>
        </RouterLink>
      </div>
    </section>
  </main>
</template>
