import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'

import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Dashboard from '../components/Dashboard.vue'

const routes = [
  {
    path: '/homepage',
    name: 'HomePage',
    component: HomePage, // This is Home Page component
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard, // This is Welcome Page component
  },
  { path: '/register', component: Register }, //Register Page Component
  { path: '/login', component: Login }, //Login Page Component
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
