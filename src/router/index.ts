import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/decide/quick',
      name: 'decide-quick',
      component: () => import('@/views/DecideQuickView.vue'),
    },
    {
      path: '/decide/tournament',
      name: 'decide-tournament',
      component: () => import('@/views/DecideTournamentView.vue'),
    },
    {
      path: '/decide/slot',
      name: 'decide-slot',
      component: () => import('@/views/DecideSlotView.vue'),
    },
    {
      path: '/decide/result/:id',
      name: 'decide-result',
      component: () => import('@/views/DecideResultView.vue'),
      props: true,
    },
    {
      path: '/capture',
      name: 'capture',
      component: () => import('@/views/CaptureView.vue'),
    },
    {
      path: '/log',
      name: 'log',
      component: () => import('@/views/LogView.vue'),
    },
    {
      path: '/reel',
      name: 'reel',
      component: () => import('@/views/ReelView.vue'),
    },
    {
      path: '/reel/:id',
      name: 'reel-detail',
      component: () => import('@/views/ReelDetailView.vue'),
      props: true,
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/HistoryView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
