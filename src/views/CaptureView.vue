<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  captureFrame,
  getCameraStream,
  makeThumbnail,
  stopStream,
} from '@/composables/camera'
import { addPhoto, generatePhotoId } from '@/composables/db'
import { isMobileDevice } from '@/composables/device'
import { getCurrentMealType } from '@/composables/recommendation'
import { menus } from '@/data/menus'
import { useHistoryStore } from '@/stores/history'
import type { MealPhoto, Menu } from '@/types'

const route = useRoute()
const router = useRouter()
const history = useHistoryStore()

const isMobile = isMobileDevice()
const isSecure = typeof window !== 'undefined' && (window.isSecureContext || window.location.hostname === 'localhost')
const hasMediaApi = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
const canUseCamera = isMobile && isSecure && hasMediaApi

const errorMessage = ref<string | null>(null)
const menuQuery = ref('')
const manuallyPickedMenu = ref<Menu | null>(null)
const showMenuPicker = ref(false)

const videoRef = ref<HTMLVideoElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const stream = ref<MediaStream | null>(null)
const isCameraReady = ref(false)
const isCapturing = ref(false)

const desktopPreviewUrl = ref<string | null>(null)
const desktopPendingBlob = ref<Blob | null>(null)
const isDragOver = ref(false)
const isSaving = ref(false)

const linkedMenu = computed<Menu | null>(() => {
  const entryId = route.query.entryId
  if (typeof entryId !== 'string') return null
  const entry = history.findById(entryId)
  if (!entry) return null
  return menus.find((m) => m.id === entry.menuId) ?? null
})

const activeMenu = computed<Menu | null>(() => manuallyPickedMenu.value ?? linkedMenu.value)

const filteredMenus = computed(() => {
  const q = menuQuery.value.trim()
  if (!q) return menus.slice(0, 12)
  return menus.filter((m) => m.name.includes(q)).slice(0, 24)
})

const canDesktopSave = computed(() =>
  desktopPendingBlob.value !== null
  && (activeMenu.value !== null || menuQuery.value.trim() !== '')
  && !isSaving.value,
)

function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

async function startCamera(): Promise<void> {
  try {
    stream.value = await getCameraStream()
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      await videoRef.value.play()
      isCameraReady.value = true
    }
  } catch (err) {
    errorMessage.value = '카메라를 사용할 수 없어요'
    console.warn('[capture] getUserMedia failed', err)
  }
}

async function persistPhoto(blob: Blob): Promise<void> {
  const name = activeMenu.value?.name ?? menuQuery.value.trim()
  if (!name) {
    errorMessage.value = '메뉴를 먼저 선택해 주세요'
    return
  }
  const thumbnail = await makeThumbnail(blob)
  const photo: MealPhoto = {
    id: generatePhotoId(),
    menuId: activeMenu.value?.id,
    menuName: name,
    imageBlob: blob,
    thumbnailBlob: thumbnail,
    takenAt: new Date().toISOString(),
    mealType: getCurrentMealType(),
  }
  await addPhoto(photo)
  vibrate([20, 40, 20])
  router.push('/log')
}

async function onShutter(): Promise<void> {
  if (!videoRef.value || !isCameraReady.value || isCapturing.value) return
  isCapturing.value = true
  vibrate(10)
  try {
    const blob = await captureFrame(videoRef.value)
    await persistPhoto(blob)
  } catch (err) {
    errorMessage.value = '촬영 중 문제가 생겼어요'
    console.error('[capture] capture failed', err)
  } finally {
    isCapturing.value = false
  }
}

function openFilePicker(): void {
  fileInputRef.value?.click()
}

async function onFileSelected(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (canUseCamera) {
    isCapturing.value = true
    try {
      await persistPhoto(file)
    } catch (err) {
      errorMessage.value = '저장에 실패했어요'
      console.error('[capture] mobile gallery save failed', err)
    } finally {
      isCapturing.value = false
      target.value = ''
    }
    return
  }

  if (desktopPreviewUrl.value) URL.revokeObjectURL(desktopPreviewUrl.value)
  desktopPendingBlob.value = file
  desktopPreviewUrl.value = URL.createObjectURL(file)
  target.value = ''
}

function onDragOver(event: DragEvent): void {
  event.preventDefault()
  isDragOver.value = true
}

function onDragLeave(): void {
  isDragOver.value = false
}

async function onDrop(event: DragEvent): Promise<void> {
  event.preventDefault()
  isDragOver.value = false
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorMessage.value = '이미지 파일만 가능해요'
    return
  }
  if (desktopPreviewUrl.value) URL.revokeObjectURL(desktopPreviewUrl.value)
  desktopPendingBlob.value = file
  desktopPreviewUrl.value = URL.createObjectURL(file)
  errorMessage.value = null
}

async function onDesktopSave(): Promise<void> {
  if (!canDesktopSave.value || !desktopPendingBlob.value) return
  isSaving.value = true
  errorMessage.value = null
  try {
    await persistPhoto(desktopPendingBlob.value)
  } catch (err) {
    errorMessage.value = '저장에 실패했어요'
    console.error('[capture] desktop save failed', err)
  } finally {
    isSaving.value = false
  }
}

function pickMenu(menu: Menu): void {
  manuallyPickedMenu.value = menu
  menuQuery.value = ''
  showMenuPicker.value = false
}

function closeView(): void {
  router.back()
}

onMounted(() => {
  if (canUseCamera) startCamera()
})

onBeforeUnmount(() => {
  stopStream(stream.value)
  stream.value = null
  if (desktopPreviewUrl.value) {
    URL.revokeObjectURL(desktopPreviewUrl.value)
    desktopPreviewUrl.value = null
  }
})
</script>

<template>
  <div class="contents">
  <input
    ref="fileInputRef"
    type="file"
    accept="image/*"
    :capture="isMobile ? 'environment' : undefined"
    class="hidden"
    @change="onFileSelected"
  />

  <main v-if="canUseCamera" class="min-h-dvh bg-black text-white flex flex-col">
    <header class="flex items-center justify-between p-4 pt-safe">
      <button
        class="text-headline px-3 py-2 -mx-3 -my-2"
        aria-label="닫기"
        @click="closeView"
      >
        ×
      </button>
      <button
        class="text-callout px-3 py-2"
        @click="showMenuPicker = !showMenuPicker"
      >
        {{ activeMenu?.name ?? '메뉴 선택' }}
      </button>
      <span class="w-8" aria-hidden="true" />
    </header>

    <section class="flex-1 relative overflow-hidden">
      <video
        ref="videoRef"
        class="absolute inset-0 w-full h-full object-cover"
        playsinline
        muted
      />
      <div
        v-if="!isCameraReady && !errorMessage"
        class="absolute inset-0 flex items-center justify-center text-callout text-white/70"
      >
        카메라 준비 중...
      </div>
      <div
        v-if="errorMessage"
        class="absolute inset-0 flex items-center justify-center text-callout text-white/80 px-8 text-center"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="showMenuPicker"
        class="absolute inset-x-0 top-0 p-4 bg-black/85 backdrop-blur space-y-3"
      >
        <input
          v-model="menuQuery"
          type="text"
          placeholder="메뉴 검색 또는 직접 입력"
          class="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-body text-white placeholder-white/40"
        />
        <div class="flex flex-wrap gap-2">
          <button
            v-for="menu in filteredMenus"
            :key="menu.id"
            class="px-3 py-1.5 rounded-sm text-caption-1 bg-white/10 border border-white/20"
            @click="pickMenu(menu)"
          >
            {{ menu.name }}
          </button>
        </div>
      </div>
    </section>

    <footer class="flex items-center justify-around p-6 pb-safe">
      <button
        class="text-callout text-white/80 w-16 h-16 flex items-center justify-center"
        aria-label="갤러리에서 선택"
        @click="openFilePicker"
      >
        갤러리
      </button>

      <button
        class="w-[72px] h-[72px] rounded-full bg-white shadow-md transition-transform duration-fast active:scale-95 disabled:opacity-50"
        aria-label="촬영"
        :disabled="!isCameraReady || isCapturing"
        @click="onShutter"
      >
        <span class="block w-16 h-16 rounded-full border-2 border-black/10 mx-auto" />
      </button>

      <span class="w-16" aria-hidden="true" />
    </footer>
  </main>

  <main v-else class="px-5 pt-10 pb-safe">
    <header class="mb-6 flex items-center justify-between">
      <button
        class="text-callout text-text-secondary -mx-2 px-2 py-1"
        @click="closeView"
      >
        ← 뒤로
      </button>
      <span class="text-footnote text-text-tertiary">기록</span>
    </header>

    <div class="flex items-center gap-2 mb-3">
      <span class="block w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
      <span class="text-footnote text-text-tertiary">
        한 끼 한 컷
      </span>
    </div>
    <h1 class="text-large-title text-text-primary mb-2">
      사진으로 남기기
    </h1>
    <p class="text-body text-text-secondary mb-6">
      모이면 한 주를 영상으로 돌려드려요
    </p>

    <div
      v-if="isMobile && !isSecure"
      class="card mb-6 flex items-start gap-3"
      style="background: var(--accent-soft);"
    >
      <svg viewBox="0 0 24 24" class="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v5M12 16h.01" />
      </svg>
      <div class="flex-1">
        <p class="text-callout text-text-primary font-semibold mb-1">
          인앱 카메라는 HTTPS에서만 열려요
        </p>
        <p class="text-footnote text-text-secondary">
          아래 버튼을 누르면 시스템 카메라가 열려요
        </p>
      </div>
    </div>

    <section class="space-y-6">
      <button
        v-if="isMobile && !desktopPreviewUrl"
        class="w-full py-12 rounded-3xl flex flex-col items-center justify-center gap-3 text-white transition-transform duration-fast active:scale-[0.98]"
        style="background: var(--accent); box-shadow: 0 8px 24px -8px rgba(255, 122, 109, 0.5);"
        @click="openFilePicker"
      >
        <svg viewBox="0 0 24 24" class="w-12 h-12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="6" width="18" height="14" rx="3" />
          <circle cx="12" cy="13" r="4" />
          <path d="M8 6l1.5-2h5L16 6" />
        </svg>
        <span class="text-title-3 font-bold">촬영하기</span>
        <span class="text-footnote opacity-85">또는 갤러리에서 사진 선택</span>
      </button>

      <button
        v-else-if="!desktopPreviewUrl"
        class="w-full aspect-square rounded-xl border-2 border-dashed transition-all duration-normal flex flex-col items-center justify-center gap-4 text-text-secondary group"
        :class="isDragOver
          ? 'border-accent bg-accent/5 scale-[0.99]'
          : 'border-separator hover:border-text-tertiary hover:bg-surface/60'"
        @click="openFilePicker"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
      >
        <span
          class="w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-normal"
          :class="isDragOver ? 'bg-accent text-white' : 'bg-surface text-text-tertiary group-hover:text-accent'"
        >
          <svg viewBox="0 0 24 24" class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="6" width="18" height="14" rx="2" />
            <circle cx="12" cy="13" r="3.5" />
            <path d="M8 6l1.5-2h5L16 6" />
          </svg>
        </span>
        <span class="text-center px-6">
          <span class="block text-headline" :class="isDragOver ? 'text-accent' : 'text-text-primary'">
            {{ isDragOver ? '여기에 놓아주세요' : '사진을 끌어다 놓기' }}
          </span>
          <span v-if="!isDragOver" class="block text-footnote text-text-tertiary mt-1">
            클릭해서 파일을 선택할 수도 있어요
          </span>
        </span>
      </button>

      <div v-else class="space-y-3">
        <div class="relative aspect-square rounded-xl overflow-hidden bg-surface">
          <img
            :src="desktopPreviewUrl"
            alt="미리보기"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <button
            class="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center transition-transform duration-fast active:scale-95"
            aria-label="다른 사진 선택"
            @click="openFilePicker"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 4v5h-5" />
            </svg>
          </button>
        </div>
      </div>

      <section>
        <h2 class="text-footnote text-text-tertiary uppercase tracking-wider mb-2 px-1">
          메뉴
        </h2>
        <div class="card !p-0 overflow-hidden">
          <div class="cell" :class="{ '!border-b-0': !showMenuPicker }">
            <span class="flex-1 text-body text-text-primary">
              {{ activeMenu?.name ?? (menuQuery.trim() || '선택 안 됨') }}
            </span>
            <button
              class="text-callout text-accent"
              @click="showMenuPicker = !showMenuPicker"
            >
              {{ showMenuPicker ? '닫기' : '바꾸기' }}
            </button>
          </div>
          <div v-if="showMenuPicker" class="p-4 space-y-3 border-t border-separator">
            <input
              v-model="menuQuery"
              type="text"
              placeholder="메뉴 검색 또는 직접 입력"
              class="w-full bg-surface border border-separator rounded-md px-3 py-2 text-body text-text-primary placeholder:text-text-tertiary"
            />
            <div class="flex flex-wrap gap-2">
              <button
                v-for="menu in filteredMenus"
                :key="menu.id"
                class="px-3 py-1.5 rounded-sm text-caption-1 bg-surface border border-separator text-text-secondary hover:border-accent hover:text-accent"
                @click="pickMenu(menu)"
              >
                {{ menu.name }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <p v-if="errorMessage" class="text-caption-1 text-destructive">
        {{ errorMessage }}
      </p>

      <button
        class="w-full py-4 rounded-lg text-headline text-white transition-transform duration-fast active:scale-[0.98] disabled:opacity-50"
        :class="canDesktopSave ? 'bg-accent' : 'bg-text-tertiary'"
        :disabled="!canDesktopSave"
        @click="onDesktopSave"
      >
        {{ isSaving ? '저장 중...' : '저장하기' }}
      </button>
    </section>
  </main>
  </div>
</template>
