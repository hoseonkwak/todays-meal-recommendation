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
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style>
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-enter-active {
  transition: opacity 250ms var(--ease-spring), transform 250ms var(--ease-spring);
}
.page-leave-to {
  opacity: 0;
}
.page-leave-active {
  transition: opacity 150ms var(--ease-spring);
}
</style>
