/**
 * 쿠팡 파트너스 Deep Link API 프록시
 *
 * - POST /api/coupang-deeplink
 * - body: { menuName: string }
 * - 환경변수: COUPANG_ACCESS_KEY, COUPANG_SECRET_KEY (Vercel Project Settings)
 * - 응답: { url: string, original: string }
 *
 * 쿠팡 시그니처: HMAC-SHA256 (datetime + method + path [+ query])
 * Authorization 헤더: CEA algorithm=HmacSHA256, access-key={KEY}, signed-date={DT}, signature={SIG}
 */

import crypto from 'node:crypto'

interface CoupangDeeplinkResponse {
  rCode?: string
  rMessage?: string
  data?: Array<{
    originalUrl?: string
    shortenUrl?: string
    landingUrl?: string
  }>
}

const HOST = 'https://api-gateway.coupang.com'
const DEEPLINK_PATH = '/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink'

function formatDatetime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    String(date.getUTCFullYear()).slice(2) +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  )
}

function generateAuthHeader(method: string, path: string, query: string, accessKey: string, secretKey: string): string {
  const datetime = formatDatetime(new Date())
  const message = datetime + method + path + query
  const signature = crypto.createHmac('sha256', secretKey).update(message).digest('hex')
  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const accessKey = process.env.COUPANG_ACCESS_KEY
  const secretKey = process.env.COUPANG_SECRET_KEY
  if (!accessKey || !secretKey) {
    return res.status(503).json({ error: 'Coupang Partners not configured' })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const menuName: string | undefined = body?.menuName
  if (!menuName || typeof menuName !== 'string') {
    return res.status(400).json({ error: 'menuName required' })
  }

  const searchQuery = encodeURIComponent(`${menuName} 밀키트`)
  const coupangUrl = `https://www.coupang.com/np/search?q=${searchQuery}`

  const authHeader = generateAuthHeader('POST', DEEPLINK_PATH, '', accessKey, secretKey)

  try {
    const response = await fetch(`${HOST}${DEEPLINK_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: authHeader,
      },
      body: JSON.stringify({ coupangUrls: [coupangUrl] }),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('[coupang-deeplink] HTTP', response.status, text.slice(0, 200))
      return res.status(502).json({ error: 'Coupang API failed', status: response.status })
    }

    const data = (await response.json()) as CoupangDeeplinkResponse
    const entry = data.data?.[0]
    if (!entry?.shortenUrl) {
      console.error('[coupang-deeplink] Empty response', data.rCode, data.rMessage)
      return res.status(502).json({ error: 'No deeplink returned', detail: data.rMessage })
    }

    // 1일 캐시 (CDN), 7일 stale-while-revalidate
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
    return res.status(200).json({
      url: entry.shortenUrl,
      original: entry.originalUrl ?? coupangUrl,
    })
  } catch (err) {
    console.error('[coupang-deeplink] fetch error', err)
    return res.status(500).json({ error: 'Internal error' })
  }
}
