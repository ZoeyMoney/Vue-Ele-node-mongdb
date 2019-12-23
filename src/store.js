import Vue from 'vue'
import Vuex from 'vuex'
import config from './js/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: '',
    user_id: '',
    netdisc_box: ''
  },
  getters: {
    // name
    name (state) {
      if (!state.name) {
        state.name = sessionStorage.getItem(config.KEY.CACHE_LOGIN_NAME)
      }
      return state.name
    },
    //  user_id
    user_id (state) {
      if (!state.user_id) {
        state.user_id = sessionStorage.getItem(config.KEY.CACHE_USER_ID)
      }
      return state.user_id
    }
  },
  mutations: {
    name (state, msg) {
      state.name = msg
      sessionStorage.setItem(config.KEY.CACHE_LOGIN_NAME, msg)
    },
    user_id (state, msg) {
      state.user_id = msg
      sessionStorage.setItem(config.KEY.CACHE_USER_ID, msg)
    }
  },
  actions: {

  }
})
