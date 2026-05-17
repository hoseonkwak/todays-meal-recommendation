<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { deleteReel, getReelById } from '@/composables/db'
import type { Reel } from '@/types'

const props = defineProps<{ id: string }>()
const router = useRouter()

const reel = ref<Reel | null>(null)
const videoUrl = ref<string | null>(null)
const isSharing = ref(false)
const shareError = ref<string | null>(null)

const photoCount = computed(() => reel.value?.photoIds.length ?? 0)
const rangeLabel = computed(() => {
  if (!reel.value) return ''
  const from = new Date(reel.value.range.from)
  const to = new Date(reel.value.range.to)
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
  return `${fmt(from)} ~ ${fmt(to)}`
})

function fileName(): string {
  if (!reel.value) return 'today-meal.webm'
  const d = new Date(reel.value.createdAt)
  const ts = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const ext = reel.value.videoBlob?.type.includes('mp4') ? 'mp4' : 'webm'
  return `today-meal-${ts}.${ext}`
}

async function load(): Promise<void> {
  const found = await getReelById(props.id)
  if (!found || !found.videoBlob) {
    router.replace('/reel')
    return
  }
  reel.value = found
  videoUrl.value = URL.createObjectURL(found.videoBlob)
}

async function onShare(): Promise<void> {
  if (!reel.value?.videoBlob) return
  shareError.value = null
  isSharing.value = true
  try {
    const file = new File([reel.value.videoBlob], fileName(), {
      type: reel.value.videoBlob.type,
    })
    if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: '오늘의밥', text: '한 주의 식사' })
      return
    }
    if (typeof navigator.share === 'function') {
      await navigator.share({ title: '오늘의밥', text: '한 주의 식사' })
      return
    }
    onDownload()
  } catch (err) {
    if ((err as Error).name === 'AbortError') return
    shareError.value = '공유에 실패했어요. 다운로드를 사용해 주세요.'
    console.warn('[reel] share failed', err)
  } finally {
    isSharing.value = false
  }
}

function onDownload(): void {
  if (!videoUrl.value) return
  const a = document.createElement('a')
  a.href = videoUrl.value
  a.download = fileName()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

async function onDelete(): Promise<void> {
  if (!reel.value) return
  await deleteReel(reel.value.id)
  router.replace('/reel')
}

onMounted(load)
onBeforeUnmount(() => {
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
})
</script>

<template>
  <main class="min-h-shell h-full bg-black text-white flex flex-col">
    <header class="flex items-center justify-between p-4 pt-safe">
      <button
        class="text-headline px-3 py-2 -mx-3 -my-2"
        aria-label="닫기"
        @click="router.back()"
      >
        ×
      </button>
      <span class="text-footnote text-white/60">{{ rangeLabel }}</span>
      <button
        class="text-callout px-3 py-2 text-destructive"
        @click="onDelete"
      >
        삭제
      </button>
    </header>

    <section class="flex-1 flex items-center justify-center px-4">
      <video
        v-if="videoUrl"
        :src="videoUrl"
        controls
        autoplay
        loop
        playsinline
        class="max-w-full max-h-full rounded-md"
      />
      <p v-else class="text-callout text-white/70">불러오는 중...</p>
    </section>

    <footer class="p-6 pb-safe space-y-3">
      <p class="text-center text-footnote text-white/60">
        {{ photoCount }}장 · {{ reel?.aspect }}
      </p>
      <p
        v-if="shareError"
        class="text-center text-caption-1 text-destructive"
      >
        {{ shareError }}
      </p>
      <div class="grid grid-cols-2 gap-3">
        <button
          class="py-4 rounded-lg text-callout border border-white/20 transition-transform duration-fast active:scale-[0.98]"
          @click="onDownload"
        >
          다운로드
        </button>
        <button
          class="py-4 rounded-lg text-headline bg-accent transition-transform duration-fast active:scale-[0.98] disabled:opacity-50"
          :disabled="isSharing"
          @click="onShare"
        >
          {{ isSharing ? '준비 중...' : '공유' }}
        </button>
      </div>
    </footer>
  </main>
</template>
