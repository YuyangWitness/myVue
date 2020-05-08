let Vue;

class Store {
  constructor(store) {
    // 定义一个可监听的state
    this._vm = new Vue({
      data: {
        $$state: store.state
      },
      computed: {
        $$getters() {
          const getters = {};
          for(let key in store.getters) {
            getters[key] = store.getters[key](this._data.$$state);
          }
          return getters;
        }
      }
    });

    this._mutations = store.mutations;
    this._actions = store.actions;

    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);

  }

  get getters() {
    return this._vm.$$getters;
  }

  set getters(val) {
    throw new Error("Can't change getters");
  }

  get state() {
    return this._vm._data.$$state;
  }

  set state(val) {
    throw new Error("Can't change state");
  }

  commit(type, payload) {
    const entry = this._mutations[type];
    if(!entry) {
      throw new Error(`Can't found ${type}`);
    }
    entry(this.state, payload);
  }

  dispatch(type, payload) {
    const entry = this._actions[type];
    if(!entry) {
      throw new Error(`Can't found ${type}`);
    }
    entry(this, payload);
  }
}

function install(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      if(this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  });
}

export default {
  Store,
  install
}