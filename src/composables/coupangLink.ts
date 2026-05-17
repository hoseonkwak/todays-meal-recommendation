/**
 * 쿠팡 파트너스 Deep Link 클라이언트
 *
 * - 메모리 + sessionStorage 2단 캐시
 * - 동일 메뉴 중복 요청 방지 (in-flight Promise 공유)
 * - 실패 시 일반 검색 URL fallback
 */

const STORAGE_PREFIX = 'coupang:deeplink:'
const memCache = new Map<string, string>()
const inFlight = new Map<string, Promise<string | null>>()

function readSessionCache(key: string): string | null {
  if (typeof sessionStorage === 'undefined') return null
  try {
    return sessionStorage.getItem(STORAGE_PREFIX + key)
  } catch {
    return null
  }
}

function writeSessionCache(key: string, value: string): void {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, value)
  } catch {
    // quota 등 무시
  }
}

export function getCoupangSearchUrl(menuName: string): string {
  const q = encodeURIComponent(`${menuName} 밀키트`)
  return `https://www.coupang.com/np/search?q=${q}`
}

export async function getCoupangDeeplink(menuName: string): Promise<string | null> {
  if (!menuName) return null

  if (memCache.has(menuName)) return memCache.get(menuName)!

  const cached = readSessionCache(menuName)
  if (cached) {
    memCache.set(menuName, cached)
    return cached
  }

  if (inFlight.has(menuName)) return inFlight.get(menuName)!

  const promise = fetch('/api/coupang-deeplink', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ menuName }),
  })
    .then(async (response) => {
      if (!response.ok) {
        if (response.status !== 503) {
          console.warn('[coupang] deeplink HTTP', response.status)
        }
        return null
      }
      const data = (await response.json()) as { url?: string }
      if (!data.url) return null
      memCache.set(menuName, data.url)
      writeSessionCache(menuName, data.url)
      return data.url
    })
    .catch((err) => {
      console.warn('[coupang] deeplink fetch failed', err)
      return null
    })
    .finally(() => {
      inFlight.delete(menuName)
    })

  inFlight.set(menuName, promise)
  return promise
}

/**
 * 클릭 시점에 deeplink 변환 시도 → 실패 시 일반 검색 URL
 */
export async function resolveCoupangUrl(menuName: string): Promise<string> {
  const deeplink = await getCoupangDeeplink(menuName)
  return deeplink ?? getCoupangSearchUrl(menuName)
}
