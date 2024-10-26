import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import StatisticsPage from '@/views/StatisticsPage.vue';
import DetailDesk from '@/components/desk/DetailDesk.vue';
import NewCard from '@/components/card/NewCard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'home' },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/desk/:id',
      name: 'desk',
      component: DetailDesk,
    },
    {
      path: '/card/new/:deskId',
      name: 'new-card',
      component: NewCard,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsPage,
    },
  ],
});

export default router;
