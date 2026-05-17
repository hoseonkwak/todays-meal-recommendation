import type { MealPhoto, ReelAspect } from '@/types'

export interface CompileOptions {
  aspect: ReelAspect
  slideDurationMs?: number
  fadeMs?: number
  showWatermark?: boolean
  onProgress?: (ratio: number) => void
}

interface Dimensions {
  width: number
  height: number
}

const ASPECT_DIMENSIONS: Record<ReelAspect, Dimensions> = {
  '9:16': { width: 1080, height: 1920 },
  '1:1': { width: 1080, height: 1080 },
  '16:9': { width: 1920, height: 1080 },
}

const WATERMARK = '@오늘의밥'

export async function compileReel(
  photos: MealPhoto[],
  options: CompileOptions,
): Promise<Blob> {
  if (photos.length === 0) throw new Error('사진이 없어요')

  const slideMs = options.slideDurationMs ?? 1500
  const fadeMs = options.fadeMs ?? 250
  const showWatermark = options.showWatermark ?? true

  const dims = ASPECT_DIMENSIONS[options.aspect]
  const canvas = document.createElement('canvas')
  canvas.width = dims.width
  canvas.height = dims.height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context unavailable')

  const bitmaps = await Promise.all(
    photos.map((p) => createImageBitmap(p.imageBlob)),
  )

  const stream = canvas.captureStream(30)
  const mimeType = pickSupportedMimeType()
  if (!mimeType) throw new Error('이 브라우저는 영상 녹화를 지원하지 않아요')

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4_000_000 })
  const chunks: Blob[] = []
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  const done = new Promise<Blob>((resolve, reject) => {
    recorder.onerror = (e) => reject(e)
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }))
  })

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, dims.width, dims.height)

  recorder.start()

  await runSlideshow({
    canvas,
    ctx,
    dims,
    bitmaps,
    photos,
    slideMs,
    fadeMs,
    showWatermark,
    onProgress: options.onProgress,
  })

  recorder.stop()
  for (const bitmap of bitmaps) bitmap.close()

  return done
}

interface RunArgs {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  dims: Dimensions
  bitmaps: ImageBitmap[]
  photos: MealPhoto[]
  slideMs: number
  fadeMs: number
  showWatermark: boolean
  onProgress?: (ratio: number) => void
}

function runSlideshow(args: RunArgs): Promise<void> {
  const totalMs = args.photos.length * args.slideMs

  return new Promise<void>((resolve) => {
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      if (elapsed >= totalMs) {
        drawFrame(args, args.photos.length - 1, args.slideMs)
        args.onProgress?.(1)
        resolve()
        return
      }
      const slideIdx = Math.min(
        args.photos.length - 1,
        Math.floor(elapsed / args.slideMs),
      )
      const slideElapsed = elapsed - slideIdx * args.slideMs
      drawFrame(args, slideIdx, slideElapsed)
      args.onProgress?.(elapsed / totalMs)
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

function drawFrame(args: RunArgs, slideIdx: number, slideElapsed: number): void {
  const { ctx, dims, bitmaps, photos, slideMs, fadeMs, showWatermark } = args
  const bitmap = bitmaps[slideIdx]
  const photo = photos[slideIdx]

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, dims.width, dims.height)

  const fadeIn = Math.min(1, slideElapsed / fadeMs)
  const fadeOutStart = slideMs - fadeMs
  const fadeOut = slideElapsed > fadeOutStart
    ? Math.max(0, 1 - (slideElapsed - fadeOutStart) / fadeMs)
    : 1
  const alpha = Math.min(fadeIn, fadeOut)

  ctx.globalAlpha = alpha
  drawCovered(ctx, bitmap, dims)
  ctx.globalAlpha = 1

  drawMenuLabel(ctx, photo.menuName, dims)
  if (showWatermark) drawWatermark(ctx, dims)
}

function drawCovered(
  ctx: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  dims: Dimensions,
): void {
  const ratio = Math.max(dims.width / bitmap.width, dims.height / bitmap.height)
  const w = bitmap.width * ratio
  const h = bitmap.height * ratio
  const x = (dims.width - w) / 2
  const y = (dims.height - h) / 2
  ctx.drawImage(bitmap, x, y, w, h)
}

function drawMenuLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  dims: Dimensions,
): void {
  const fontSize = Math.round(dims.width * 0.06)
  const padX = Math.round(dims.width * 0.08)
  const padBottom = Math.round(dims.height * 0.12)

  ctx.font = `700 ${fontSize}px "Pretendard Variable", Pretendard, system-ui, sans-serif`
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'

  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)'
  ctx.shadowBlur = 12
  ctx.shadowOffsetY = 2
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(text, padX, dims.height - padBottom)
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0
}

function drawWatermark(ctx: CanvasRenderingContext2D, dims: Dimensions): void {
  const fontSize = Math.round(dims.width * 0.022)
  const padX = Math.round(dims.width * 0.04)
  const padY = Math.round(dims.height * 0.04)
  ctx.font = `500 ${fontSize}px system-ui, sans-serif`
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.fillText(WATERMARK, dims.width - padX, dims.height - padY)
}

function pickSupportedMimeType(): string | null {
  const candidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ]
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }
  return null
}

export function generateReelId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
