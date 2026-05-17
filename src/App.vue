<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()

onMounted(() => {
  theme.applyTheme()
})
</script>

<template>
  <div class="app-outer">
    <div class="app-shell">
      <RouterView v-slot="{ Component, route }">
        <Suspense :timeout="0">
          <Transition name="page" appear>
            <component :is="Component" :key="route.path" />
          </Transition>
          <template #fallback>
            <div class="min-h-shell" />
          </template>
        </Suspense>
      </RouterView>
    </div>
  </div>
</template>

<style>
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-enter-active {
  transition: opacity 220ms var(--ease-spring), transform 220ms var(--ease-spring);
  position: relative;
  z-index: 1;
}
.page-leave-to {
  opacity: 0;
}
.page-leave-active {
  transition: opacity 150ms var(--ease-spring);
  position: absolute;
  inset: 0;
  z-index: 0;
}
</style>
