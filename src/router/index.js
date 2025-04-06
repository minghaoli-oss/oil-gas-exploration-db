import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'
import DataManagement from '../views/DataManagement.vue'
import AppQuery from '../views/AppQuery.vue'
import AppAnalysis from '@/views/AppAnalysis.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  // 其他路由稍后添加
  {
    path: '/data-management',
    name: 'DataManagement',
    component: DataManagement
  },
  {
    path: '/query',
    name: 'Query',
    component: AppQuery
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: AppAnalysis
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router