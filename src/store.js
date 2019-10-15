import Vue from 'vue'
import Vuex from 'vuex'
import config from './js/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: '',
  },
  getters: {
    // name
    name (state) {
      if (!state.name) {
        state.name = sessionStorage.getItem(config.KEY.CACHE_LOGIN_NAME)
      }
      return state.name
    },
  },
  mutations: {
    name (state, msg) {
      state.name = msg
      sessionStorage.setItem(config.KEY.CACHE_LOGIN_NAME, msg)
    },
  },
  actions: {

  }
})
