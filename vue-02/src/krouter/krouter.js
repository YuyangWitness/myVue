let Vue;

class VueRouter{
  constructor(init) {
    this.current = "/";
    this.compMap = {};
    init.routes.forEach(router => {
      this.compMap[router.path] = router;
    });
    // Vue.util.defineReactive(this, "current", '');
    Vue.observable(this);
    // 注意这里的this指针
    window.addEventListener("hashchange", () => {
      this.current = window.location.hash.split("#")[1];
    });
    window.addEventListener("load", () => {
      this.current = "/";
    });
  }

}

VueRouter.install = function(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      //将VueRouter对象挂载在到全局的Vue上面，提供给内部组件使用
      // Vue.prototype.$router = this.$options.router
      // 一定要有这个判断，因为这个mixin会给所有组件做mixin，而只需要最初的new Vue，否则后面都是undefined
      if(this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    }
  });

  // 创建router-view和router-link组件
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render(h) {
      return h('a', {
        attrs: {
          href: `#${this.to}`
        }
      }, this.$slots.default)
    }
  });

  Vue.component('router-view', {
    // 这里的render函数很重要
    render(h) {
      console.log(this.$router.current);
      let component;
      const { current, compMap } = this.$router;
      if(compMap[current]) {
        component = compMap[current].component;
      }
      return h(component);
    }
  });
}

export default VueRouter;