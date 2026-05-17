import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Preferences } from '@/types'

const STORAGE_KEY = 'today-meal:preferences'

const DEFAULT_PREFERENCES: Preferences = {
  excludedMenuIds: [],
  preferredCategories: [],
  avoidanceWindowDays: 3,
  theme: 'system',
  locationEnabled: false,
  notificationsEnabled: false,
  reelAutoGenerate: 'weekly',
  premium: false,
  onboardingCompleted: false,
}

export const usePreferencesStore = defineStore('preferences', () => {
  const preferences = ref<Preferences>(load())

  function load(): Preferences {
    if (typeof localStorage === 'undefined') return { ...DEFAULT_PREFERENCES }
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return { ...DEFAULT_PREFERENCES }
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) }
    } catch {
      return { ...DEFAULT_PREFERENCES }
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences.value))
  }

  function update(patch: Partial<Preferences>) {
    preferences.value = { ...preferences.value, ...patch }
  }

  function reset() {
    preferences.value = { ...DEFAULT_PREFERENCES }
  }

  watch(preferences, save, { deep: true })

  return { preferences, update, reset }
})
