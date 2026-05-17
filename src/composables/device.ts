export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof navigator === 'undefined') return false

  const ua = navigator.userAgent
  const mobileUA = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const iPadOS = /Macintosh/.test(ua) && (navigator.maxTouchPoints ?? 0) > 1
  if (mobileUA || iPadOS) return true

  const coarsePointer = typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches
  const hasTouch = (navigator.maxTouchPoints ?? 0) > 0
  return coarsePointer && hasTouch
}
