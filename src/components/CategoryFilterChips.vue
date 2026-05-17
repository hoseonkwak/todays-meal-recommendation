<script setup lang="ts">
import { computed } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'
import type { Category } from '@/types'

const ALL_CATEGORIES: Category[] = ['한식', '일식', '중식', '양식', '분식', '아시안', '기타']

const CATEGORY_MODIFIER: Record<Category, string> = {
  한식: 'chip-cat--korean',
  일식: 'chip-cat--japanese',
  중식: 'chip-cat--chinese',
  양식: 'chip-cat--western',
  분식: 'chip-cat--snack',
  아시안: 'chip-cat--asian',
  기타: 'chip-cat--other',
}

const prefs = usePreferencesStore()

const selected = computed(() => new Set(prefs.preferences.preferredCategories))

function toggle(category: Category): void {
  const current = prefs.preferences.preferredCategories
  const next = current.includes(category)
    ? current.filter((c) => c !== category)
    : [...current, category]
  prefs.update({ preferredCategories: next })

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(5)
  }
}

function clearAll(): void {
  prefs.update({ preferredCategories: [] })
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-3 px-1">
      <h2 class="text-footnote text-text-tertiary">
        카테고리
      </h2>
      <button
        v-if="selected.size > 0"
        class="text-caption-1 text-accent font-semibold"
        @click="clearAll"
      >
        초기화
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="category in ALL_CATEGORIES"
        :key="category"
        class="chip-cat"
        :class="[CATEGORY_MODIFIER[category], { 'is-on': selected.has(category) }]"
        @click="toggle(category)"
      >
        {{ category }}
      </button>
    </div>
  </section>
</template>
