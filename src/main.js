import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Components
const UniversalRoute = () => import('./components/UniversalRoute.vue')
const ModelsPage = () => import('./components/ModelsPage.vue')

// Create router with specific route for models and catch-all route
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/ai/models',
      name: 'ModelsPage',
      component: ModelsPage
    },
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
