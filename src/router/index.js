import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

function authGuard (to, from, next) {
  try {
    let authentication = false
    const adminStorageEncoded = localStorage.getItem('admin')
    const adminStorageDecoded = adminStorageEncoded ? atob(adminStorageEncoded) : false
    const adminStorageJSON = adminStorageDecoded ? JSON.parse(adminStorageDecoded) : false
    const token = adminStorageJSON ? adminStorageJSON.token : false
    if (token) {
      authentication = true
    } else {
      authentication = false
    }
    if (authentication) {
      next()
    } else {
      next({ name: 'login' })
    }
  } catch (error) {
    console.log('error from file router.JS', error)
  }
}

const routes = [
  // index
  {
    path: '/',
    component: () => import('@/layout/blank.vue'),
    children: [
      {
        path: '',
        name: 'StartPage',
        component: () => import('@/views/Frontend/index.vue')
      }
    ]
  },
  // content frontend layout
  {
    path: '/food-truck',
    component: () => import('@/layout/frontend.vue'),
    children: [
      {
        path: '',
        name: 'HomePage',
        component: () => import('@/views/Frontend/home.vue')
      },
      {
        path: 'food',
        name: 'FoodPage',
        component: () => import('@/views/Frontend/food/index.vue')
      },
      {
        path: 'order',
        name: 'OrderPage',
        component: () => import('@/views/Frontend/order/index.vue')
      },
      {
        path: '_order_slug/:_slug',
        name: 'OrderSlugPage',
        component: () => import('@/views/Frontend/order/_slug.vue')
      }
    ]
  },
  // content blank layout
  {
    path: '/food-truck',
    component: () => import('@/layout/blank.vue'),
    children: [
      {
        path: '_food_slug/:_slug',
        name: 'FoodSlugPage',
        component: () => import('@/views/Frontend/food/_slug.vue')
      },
      {
        path: '_detail_slug/:_slug',
        name: 'DetailOrderPage',
        component: () => import('@/views/Frontend/order/_detail.vue')
      },
      {
        path: 'cart',
        name: 'CartPage',
        component: () => import('@/views/Frontend/cart/index.vue')
      },
      {
        path: '_detail_food_in_cart_slug/:_slug',
        name: 'DetailCartPage',
        component: () => import('@/views/Frontend/cart/_detail.vue')
      },
      {
        path: 'backend/login',
        name: 'login',
        component: () => import('@/views/Backend/login.vue')
      }
    ]
  },
  // content backend layout
  {
    path: '/food-truck/backend',
    component: () => import('@/layout/backend'),
    beforeEnter: authGuard,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Backend/dashboard.vue')
      },
      {
        path: 'orderManagement',
        name: 'orderManagement',
        component: () => import('@/views/Backend/order/orderManagement.vue')
      },
      {
        path: 'orderStatusManagement',
        name: 'orderStatusManagement',
        component: () => import('@/views/Backend/order/orderStatusManagement.vue')
      },
      {
        path: 'countdownManagement',
        name: 'countdownManagement',
        component: () => import('@/views/Backend/order/countdownManagement.vue')
      },
      {
        path: 'foodManagement',
        name: 'foodManagement',
        component: () => import('@/views/Backend/food/foodManagement.vue')
      },
      {
        path: 'categoryManagement',
        name: 'categoryManagement',
        component: () => import('@/views/Backend/food/categoryManagement.vue')
      },
      {
        path: 'optionManagement',
        name: 'optionManagement',
        component: () => import('@/views/Backend/food/options/optionManagement.vue')
      },
      {
        path: 'optionDetailManagement',
        name: 'optionDetailManagement',
        component: () => import('@/views/Backend/food/options/optionDetailManagement.vue')
      },
      {
        path: 'toppingManagement',
        name: 'toppingManagement',
        component: () => import('@/views/Backend/food/toppingManagement.vue')
      },
      {
        path: 'ingredientsManagement',
        name: 'ingredientsManagement',
        component: () => import('@/views/Backend/ingredients/ingredientsManagement.vue')
      },
      {
        path: 'groupManagement',
        name: 'groupManagement',
        component: () => import('@/views/Backend/ingredients/groupManagement.vue')
      },
      {
        path: 'unitManagement',
        name: 'unitManagement',
        component: () => import('@/views/Backend/ingredients/unitManagement.vue')
      },
      {
        path: 'stockManagement',
        name: 'stockManagement',
        component: () => import('@/views/Backend/ingredients/stockManagement.vue')
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
