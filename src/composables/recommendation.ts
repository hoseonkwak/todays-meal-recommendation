import { menus as defaultMenus } from '@/data/menus'
import type { Category, MealType, Menu } from '@/types'

export type Weather = 'cold' | 'hot' | 'rainy'
export type DayOfWeek = 'weekday' | 'weekend'

export interface RecommendationContext {
  mealType?: MealType
  isWeekend?: boolean
  weather?: Weather
  preferredCategories?: Category[]
  excludedMenuIds?: string[]
  recentMenuIds?: string[]
  avoidanceWindow?: number
  rng?: () => number
}

interface ResolvedContext {
  mealType: MealType
  dayOfWeek: DayOfWeek
  weather: Weather | undefined
  preferredCategories: Set<Category>
  excludedMenuIds: Set<string>
  recentMenuIds: Set<string>
  rng: () => number
}

const MEAL_TYPES: readonly MealType[] = ['breakfast', 'brunch', 'lunch', 'dinner', 'latenight']

const FITNESS_MIN = 0.5
const FITNESS_MAX = 2.0

export function getCurrentMealType(now: Date = new Date()): MealType {
  const hour = now.getHours()
  const day = now.getDay()
  const isWeekend = day === 0 || day === 6

  if (hour >= 6 && hour < 10) return 'breakfast'
  if (isWeekend && hour >= 10 && hour < 14) return 'brunch'
  if (hour >= 11 && hour < 14) return 'lunch'
  if (hour >= 17 && hour < 21) return 'dinner'
  if (hour >= 22 || hour < 2) return 'latenight'

  if (hour < 11) return 'breakfast'
  if (hour < 17) return 'lunch'
  if (hour < 22) return 'dinner'
  return 'latenight'
}

export function getCurrentDayOfWeek(now: Date = new Date()): DayOfWeek {
  const day = now.getDay()
  return day === 0 || day === 6 ? 'weekend' : 'weekday'
}

export function recommend(
  ctx: RecommendationContext = {},
  pool: Menu[] = defaultMenus,
): Menu | null {
  const resolved = resolveContext(ctx)
  const candidates = buildCandidates(pool, resolved)
  if (candidates.length === 0) return null

  const weights = candidates.map((m) => computeWeight(m, resolved))
  return weightedPick(candidates, weights, resolved.rng)
}

export function recommendCandidates(
  count: number,
  ctx: RecommendationContext = {},
  pool: Menu[] = defaultMenus,
): Menu[] {
  if (count <= 0) return []
  const resolved = resolveContext(ctx)
  const candidates = buildCandidates(pool, resolved)
  if (candidates.length === 0) return []

  const weights = candidates.map((m) => computeWeight(m, resolved))
  return weightedSample(candidates, weights, Math.min(count, candidates.length), resolved.rng)
}

function resolveContext(ctx: RecommendationContext): ResolvedContext {
  const now = new Date()
  return {
    mealType: ctx.mealType ?? getCurrentMealType(now),
    dayOfWeek: ctx.isWeekend === undefined
      ? getCurrentDayOfWeek(now)
      : ctx.isWeekend ? 'weekend' : 'weekday',
    weather: ctx.weather,
    preferredCategories: new Set(ctx.preferredCategories ?? []),
    excludedMenuIds: new Set(ctx.excludedMenuIds ?? []),
    recentMenuIds: new Set(ctx.recentMenuIds ?? []),
    rng: ctx.rng ?? Math.random,
  }
}

function buildCandidates(pool: Menu[], ctx: ResolvedContext): Menu[] {
  let result = pool

  if (ctx.preferredCategories.size > 0) {
    result = result.filter((m) => ctx.preferredCategories.has(m.category))
  }
  if (ctx.excludedMenuIds.size > 0) {
    result = result.filter((m) => !ctx.excludedMenuIds.has(m.id))
  }
  if (ctx.recentMenuIds.size > 0) {
    const withoutRecent = result.filter((m) => !ctx.recentMenuIds.has(m.id))
    if (withoutRecent.length > 0) result = withoutRecent
  }
  return result
}

function computeWeight(menu: Menu, ctx: ResolvedContext): number {
  assertFitnessRange(menu)
  let w = menu.fitness.time[ctx.mealType]
  w *= menu.fitness.dayOfWeek[ctx.dayOfWeek]
  if (ctx.weather) w *= menu.fitness.weather[ctx.weather]
  return w
}

function assertFitnessRange(menu: Menu): void {
  const all = [
    ...MEAL_TYPES.map((t) => menu.fitness.time[t]),
    menu.fitness.dayOfWeek.weekday,
    menu.fitness.dayOfWeek.weekend,
    menu.fitness.weather.cold,
    menu.fitness.weather.hot,
    menu.fitness.weather.rainy,
  ]
  for (const v of all) {
    if (v < FITNESS_MIN || v > FITNESS_MAX) {
      throw new Error(`[recommendation] '${menu.id}' fitness ${v} out of [${FITNESS_MIN}, ${FITNESS_MAX}]`)
    }
  }
}

function weightedPick<T>(items: T[], weights: number[], rng: () => number): T {
  const total = weights.reduce((a, b) => a + b, 0)
  if (total <= 0) return items[Math.floor(rng() * items.length)]

  let r = rng() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

function weightedSample<T>(
  items: T[],
  weights: number[],
  count: number,
  rng: () => number,
): T[] {
  const pool = items.map((item, i) => ({ item, w: weights[i] }))
  const result: T[] = []

  for (let k = 0; k < count && pool.length > 0; k++) {
    const total = pool.reduce((s, p) => s + p.w, 0)
    if (total <= 0) {
      const idx = Math.floor(rng() * pool.length)
      result.push(pool[idx].item)
      pool.splice(idx, 1)
      continue
    }
    let r = rng() * total
    let idx = pool.length - 1
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].w
      if (r <= 0) { idx = i; break }
    }
    result.push(pool[idx].item)
    pool.splice(idx, 1)
  }
  return result
}
