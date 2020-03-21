import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Top100.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
