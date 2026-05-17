export async function getCameraStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'environment',
      width: { ideal: 1920 },
      height: { ideal: 1920 },
    },
    audio: false,
  })
}

export function stopStream(stream: MediaStream | null): void {
  if (!stream) return
  for (const track of stream.getTracks()) track.stop()
}

export function captureFrame(
  video: HTMLVideoElement,
  options: { quality?: number; maxSize?: number } = {},
): Promise<Blob> {
  const quality = options.quality ?? 0.85
  const maxSize = options.maxSize ?? 1920

  const ratio = Math.min(maxSize / video.videoWidth, maxSize / video.videoHeight, 1)
  const w = Math.round(video.videoWidth * ratio)
  const h = Math.round(video.videoHeight * ratio)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.reject(new Error('Canvas context unavailable'))
  ctx.drawImage(video, 0, 0, w, h)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/jpeg',
      quality,
    )
  })
}

export async function makeThumbnail(blob: Blob, maxSize = 320): Promise<Blob> {
  const url = URL.createObjectURL(blob)
  try {
    const img = await loadImage(url)
    const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1)
    const w = Math.round(img.width * ratio)
    const h = Math.round(img.height * ratio)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context unavailable')
    ctx.drawImage(img, 0, 0, w, h)
    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('thumbnail toBlob failed'))),
        'image/jpeg',
        0.7,
      )
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function blobFromFile(file: File): Blob {
  return file
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('image load failed'))
    img.src = src
  })
}
