import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import StatisticsPage from '@/views/StatisticsPage.vue'
import DetailDesk from '@/components/desk/DetailDesk.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'home' }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/desks/:id',
      name: 'desks',
      component: DetailDesk
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsPage
    },
  ]
})

export default router
