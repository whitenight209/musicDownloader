import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/BugsTop100.vue';
import YoutubePlayer from '@/views/YoutubePlayer';
import StoredMusic from '@/views/StoredMusic';
import YoutubeSearch from '@/views/YoutubeSearch';
import BugsSearch from '@/views/BugsSearch';
import Setting from '@/views/Settings';
import DownloadMonitor from '@/views/DownloadMonitor';
import { inject, provide } from '@vue/composition-api';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bugs/search',
    name: 'bugsSearch',
    component: BugsSearch
  },
  {
    path: '/youtube',
    name: 'Youtube',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: YoutubePlayer
  },
  {
    path: '/youtube/search',
    name: 'youtubeSearch',
    component: YoutubeSearch
  },
  {
    path: '/stored',
    name: 'Stored',
    component: StoredMusic
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Setting
  },
  {
    path: '/monitor',
    name: 'monitor',
    component: DownloadMonitor
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});
const routerSymbol = Symbol('router');

// 저장소 제공 헬퍼 함수
export const provideRouter = () => {
  provide(routerSymbol, router);
};

// 저장소 주입 헬퍼 함수
export const useRouter = () => {
  const router = inject(routerSymbol);
  if (!router) {
    throw new Error('No router provided');
  }
  return router;
};

export default router;
