import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Universal route component
const UniversalRoute = () => import('./components/UniversalRoute.vue')

// Create router with catch-all route
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'UniversalRoute',
      component: UniversalRoute
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
