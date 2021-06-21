import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/BugsTop100.vue';
import YoutubePlayer from '@/views/YoutubePlayer';
import StoredMusic from '@/views/StoredMusic';
import YoutubeSearch from '@/views/YoutubeSearch';
import BugsSearch from '@/views/BugsSearch';
import Setting from '@/views/Settings';
import DownloadMonitor from '@/views/DownloadMonitor';

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

export default router;
