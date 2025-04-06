import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  }
  // 其他路由稍后添加
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router