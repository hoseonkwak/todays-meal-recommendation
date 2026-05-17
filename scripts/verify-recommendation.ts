import {
  getCurrentMealType,
  getCurrentDayOfWeek,
  recommend,
  recommendCandidates,
} from '../src/composables/recommendation'
import { menus } from '../src/data/menus'
import type { MealType } from '../src/types'

const TRIALS = 10000
const MEAL_TYPES: MealType[] = ['breakfast', 'brunch', 'lunch', 'dinner', 'latenight']

function header(title: string): void {
  console.log()
  console.log('━'.repeat(60))
  console.log(`  ${title}`)
  console.log('━'.repeat(60))
}

function pass(msg: string): void { console.log(`  ✓ ${msg}`) }
function fail(msg: string): void { console.log(`  ✗ ${msg}`) }

let failures = 0

function check(condition: boolean, msg: string): void {
  if (condition) pass(msg)
  else { fail(msg); failures++ }
}

header('1. 시간대 자동 인식')
const now = new Date()
console.log(`  현재 시각: ${now.toLocaleString('ko-KR')}`)
console.log(`  → mealType: ${getCurrentMealType(now)}`)
console.log(`  → dayOfWeek: ${getCurrentDayOfWeek(now)}`)
for (const hour of [7, 12, 18, 23]) {
  const d = new Date(2026, 0, 5, hour)
  console.log(`  ${hour}시(월) → ${getCurrentMealType(d)}`)
}

header('2. 기본 추천 동작')
const r1 = recommend()
check(r1 !== null, `recommend() 결과 반환`)
console.log(`  샘플: ${r1?.name} (${r1?.category})`)

header('3. 시간대별 적합 메뉴 빈도 (10000회 시뮬레이션)')
for (const mealType of MEAL_TYPES) {
  const counts = new Map<string, number>()
  for (let i = 0; i < TRIALS; i++) {
    const m = recommend({ mealType })
    if (m) counts.set(m.id, (counts.get(m.id) ?? 0) + 1)
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
  const top3 = sorted.slice(0, 3)
  console.log(`  [${mealType}] 상위 3:`)
  for (const [id, c] of top3) {
    const m = menus.find((x) => x.id === id)!
    const fit = m.fitness.time[mealType]
    console.log(`    ${m.name.padEnd(10)} ${c.toString().padStart(4)}회  (fitness=${fit})`)
  }

  const topFit = menus.find((m) => m.id === sorted[0][0])!.fitness.time[mealType]
  check(topFit >= 1.3, `[${mealType}] 최상위 메뉴 fitness ≥ 1.3 (실제 ${topFit})`)
}

header('4. 카테고리 필터 동작')
const onlyKorean = recommendCandidates(20, { preferredCategories: ['한식'] })
check(onlyKorean.length === 20, `한식 필터 시 20개 후보 반환`)
check(onlyKorean.every((m) => m.category === '한식'), `모두 한식 카테고리`)

header('5. 회피 동작')
const recent = menus.slice(0, 10).map((m) => m.id)
let avoidedCount = 0
for (let i = 0; i < 1000; i++) {
  const m = recommend({ recentMenuIds: recent })
  if (m && recent.includes(m.id)) avoidedCount++
}
check(avoidedCount === 0, `최근 10개 메뉴는 추천되지 않음 (실제 위반 ${avoidedCount}회)`)

header('6. 명시 제외 동작')
const excluded = ['kimchi-jjigae', 'ramen']
let excludedHit = 0
for (let i = 0; i < 1000; i++) {
  const m = recommend({ excludedMenuIds: excluded })
  if (m && excluded.includes(m.id)) excludedHit++
}
check(excludedHit === 0, `excludedMenuIds 메뉴는 추천되지 않음 (실제 위반 ${excludedHit}회)`)

header('7. 가중치 비율 검증')
const fixedRng = (() => {
  let seed = 12345
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
})()

const lunchTop = menus
  .filter((m) => m.fitness.time.lunch >= 1.6)
  .map((m) => m.id)
const lunchLow = menus
  .filter((m) => m.fitness.time.lunch <= 0.7)
  .map((m) => m.id)

let topHit = 0
let lowHit = 0
for (let i = 0; i < TRIALS; i++) {
  const m = recommend({ mealType: 'lunch' })
  if (m && lunchTop.includes(m.id)) topHit++
  if (m && lunchLow.includes(m.id)) lowHit++
}

console.log(`  점심 fitness ≥ 1.6 메뉴군 ${lunchTop.length}개: ${topHit}회 추천`)
console.log(`  점심 fitness ≤ 0.7 메뉴군 ${lunchLow.length}개: ${lowHit}회 추천`)
const topRate = topHit / lunchTop.length
const lowRate = lunchLow.length > 0 ? lowHit / lunchLow.length : 0
console.log(`  메뉴당 평균: 상위군 ${topRate.toFixed(1)}회 vs 하위군 ${lowRate.toFixed(1)}회`)
check(topRate > lowRate * 2, `상위군이 하위군보다 메뉴당 2배 이상 많이 뽑힘`)

header('8. Tournament 후보 3개 추출')
const t1 = recommendCandidates(3, { mealType: 'lunch' })
check(t1.length === 3, `3개 후보 반환`)
const t1Ids = new Set(t1.map((m) => m.id))
check(t1Ids.size === 3, `중복 없음`)

header('9. weather 가중치 동작 (rainy)')
let rainyKimchiJeon = 0
let normalKimchiJeon = 0
for (let i = 0; i < TRIALS; i++) {
  const r = recommend({ weather: 'rainy' })
  if (r?.id === 'kimchi-jeon') rainyKimchiJeon++
  const n = recommend({})
  if (n?.id === 'kimchi-jeon') normalKimchiJeon++
}
console.log(`  비 오는 날 김치전 ${rainyKimchiJeon}회 vs 일반 ${normalKimchiJeon}회`)
check(rainyKimchiJeon > normalKimchiJeon, `비 오는 날 김치전 빈도 ↑`)

header('결과')
console.log(`  실패: ${failures}건`)
console.log()
process.exit(failures > 0 ? 1 : 0)
