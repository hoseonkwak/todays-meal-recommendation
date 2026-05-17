import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { DecisionEntry, DecisionMode, DecisionOutcome, MealType } from '@/types'

const STORAGE_KEY = 'today-meal:history'
const MAX_ENTRIES = 500

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const useHistoryStore = defineStore('history', () => {
  const entries = ref<DecisionEntry[]>(load())

  function load(): DecisionEntry[] {
    if (typeof localStorage === 'undefined') return []
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
  }

  function add(payload: {
    menuId: string
    mode: DecisionMode
    mealType: MealType
    outcome?: DecisionOutcome
  }): DecisionEntry {
    const entry: DecisionEntry = {
      id: generateId(),
      menuId: payload.menuId,
      timestamp: new Date().toISOString(),
      outcome: payload.outcome ?? 'unknown',
      mode: payload.mode,
      mealType: payload.mealType,
    }
    entries.value.unshift(entry)
    if (entries.value.length > MAX_ENTRIES) {
      entries.value = entries.value.slice(0, MAX_ENTRIES)
    }
    return entry
  }

  function findById(id: string): DecisionEntry | undefined {
    return entries.value.find((e) => e.id === id)
  }

  function updateOutcome(id: string, outcome: DecisionOutcome): void {
    const entry = entries.value.find((e) => e.id === id)
    if (entry) entry.outcome = outcome
  }

  function remove(id: string): void {
    entries.value = entries.value.filter((e) => e.id !== id)
  }

  function clear(): void {
    entries.value = []
  }

  const recentMenuIds = computed(() => (windowDays: number) => {
    const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000
    return entries.value
      .filter((e) => new Date(e.timestamp).getTime() >= cutoff)
      .map((e) => e.menuId)
  })

  watch(entries, save, { deep: true })

  return {
    entries,
    add,
    findById,
    updateOutcome,
    remove,
    clear,
    recentMenuIds,
  }
})
