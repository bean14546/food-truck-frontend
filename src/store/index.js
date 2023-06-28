import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: [],
    menu: {},
    detail: {},
    currentPage: 1
  },
  mutations: {
    addToCart (state, payload) {
      state.cart.push(payload)
    },
    clearCart (state) {
      state.cart = []
    },
    menuEdit (state, payload) {
      state.menu = payload
    },
    detailOrder (state, payload) {
      state.detail = payload
    },
    deleteOrder (state, index) {
      state.cart.splice(index, 1)
    },
    setCurrentPage (state, payload) {
      state.currentPage = payload
    }
  },
  actions: {
  },
  getters: {
    total (state) {
      return state.cart.length > 0 ? state.cart.map((res) => res.total).reduce((prev, curr) => prev + curr) : false
    },
    getCurrentPage (state) {
      return state.currentPage
    }
  }
})
