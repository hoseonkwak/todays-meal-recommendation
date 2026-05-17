import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Theme } from '@/types'

const STORAGE_KEY = 'today-meal:theme'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(loadTheme())

  function loadTheme(): Theme {
    if (typeof localStorage === 'undefined') return 'system'
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    return stored ?? 'system'
  }

  function setTheme(next: Theme) {
    theme.value = next
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme()
  }

  function applyTheme() {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    if (theme.value === 'light') {
      root.classList.add('light')
    } else if (theme.value === 'dark') {
      root.classList.add('dark')
    }
    // 'system'은 클래스 없음 → @media (prefers-color-scheme)가 처리
  }

  // 시스템 테마 변경 감지 (theme === 'system'일 때만 의미 있음)
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    mql.addEventListener('change', () => {
      if (theme.value === 'system') applyTheme()
    })
  }

  watch(theme, applyTheme)

  return { theme, setTheme, applyTheme }
})
