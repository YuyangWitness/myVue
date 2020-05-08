import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  mutations: {
    increment(state) {
      state.counter++;
    }
  },
  actions: {
    increment({commit}){
      setTimeout(function() {
        commit("increment");
      }, 2000);
    }
  },
  modules: {
  }
})
