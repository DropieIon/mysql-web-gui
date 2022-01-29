import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    vizibil: false
  },
  mutations: {
    changeVis(state) {
      state.vizibil = !state.vizibil
    }
  },
  actions: {
  },
  modules: {
  }
})
