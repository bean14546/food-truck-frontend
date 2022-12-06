import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/layout/blank.vue'),
    children: [
      {
        path: '',
        name: 'StartPage',
        component: () => import('@/views/Frontend/startPage.vue')
      }
    ]
  },
  {
    path: '/foodtruck',
    component: () => import('@/layout/frontend.vue'),
    children: [
      {
        path: '',
        name: 'HomePage',
        component: () => import('@/views/Frontend/homePage.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
