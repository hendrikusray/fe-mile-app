import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import TasksView from '../views/TaskView.vue'

const routes = [
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  { path: '/tasks', name: 'tasks', component: TasksView, meta: { requiresAuth: true } },
  { path: '/', redirect: { name: 'tasks' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  // baca langsung localStorage untuk menghindari race dengan Pinia init
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && token) {
    return { name: 'tasks' }
  }
})

export default router
