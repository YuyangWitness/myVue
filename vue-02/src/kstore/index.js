import Vue from 'vue'
import Vuex from './kstore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  getters: {
    totalCounter(state) {
      return parseInt(state.counter) + 100;
    },
    name() {
      return "hello world";
    }
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
