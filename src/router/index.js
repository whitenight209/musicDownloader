import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/BugsTop100.vue';
import YoutubePlayer from '@/views/YoutubePlayer';
import StoredMusic from '@/views/StoredMusic';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    path: '/stored',
    name: 'Stored',
    component: StoredMusic
  }

];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
