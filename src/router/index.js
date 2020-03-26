import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Top100.vue'
import YoutubePlayer from "../views/YoutubePlayer";

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/youtube',
    name: 'youtube',
    component: YoutubePlayer
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
