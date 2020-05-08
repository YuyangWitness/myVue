//数据响应式
function observe(obj) {
  if(typeof obj !== "object" || obj == null) return;

  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
  })
}


function defineReactive(obj, key, value) {
  observe(obj[key]);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.addDep(Dep.target);
      return value;
    },
    set(newVal) {
      value = newVal;

      dep.notify();
    }
  })
}


class KVue {
  constructor(options) {
    this.options = options;
    this.$data = options.data
    this.$methods = options.methods;
    this.mountData();
    observe(this.options.data);

    new Compile(this, document.querySelector(this.options.el));
  }

  // 代理data到KVue实例里面
  mountData() {
    Object.keys(this.options.data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return this.$data[key];
        },
        set(newVal) {
          this.$data[key] = newVal;

        }
      })
    })
  }

}

// 模板引擎Compile, 解析html里面的文本和节点
class Compile {
  constructor(vm, node) {
    const childNodes = node.childNodes;
    this.vm = vm;
    this.compile(childNodes);
  }

  compile(nodes) {
    Array.from(nodes).forEach(node => {
      if(node.nodeType === 1) {
        // k-text/k-html指令
        this.createElement(node)
      } else if(node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.nodeValue)) {
        this.createText(node);
      }

      if(node.childNodes) {
        this.compile(node.childNodes);
      }
    });
  }

  createElement(node) {
    Array.from(node.attributes).forEach(attr => {
      const {name, value} = attr;
      if(name.indexOf("k-") !== -1) {
        const dir = name.substring(2);
        this.update(node, value, dir);
      }
      // 进入事件处理
      if(/^@(.*)$/.test(name)) {
        this.handlerEvent(node, RegExp.$1, value);
      }
    })
  }

  handlerEvent(node, type, method) {
    if(this.vm.$methods[method]) {
      node.addEventListener(type, this.vm.$methods[method].bind(this.vm));
    } else {
      throw new Error(`${method} can't be found`);
    }
  }

  createText(node) {
    this.update(node, RegExp.$1, "text");
  }

  update(node, value, dir) {
    const fn = this[dir + "Updater"];
    fn && fn(node, this.vm[value]);
    new Watcher(this.vm, value, (value) => {
      fn && fn(node, value);
    });
  }

  htmlUpdater(node, value) {
    node.innerHTML = value;
  }

  textUpdater(node, value) {
    node.textContent = value;
  }
}

// 监听触发视图改变
class Watcher {
  constructor(vm, key, fn) {
    this.vm = vm;
    this.key = key;
    this.fn = fn;

    Dep.target = this;
    this.vm[this.key];
    Dep.target = null;
  }

  update() {
    this.fn.call(this.vm, this.vm[this.key])
  }
}

// 一个Dep管理key相同的watcher, 每个watcher对应模板中每一个变量，这样某个key的值发生改变，只会update对应的模板
class Dep {
  constructor() {
    this.dep = [];
  }

  addDep(watch) {
    this.dep.push(watch);
  }

  notify() {
    this.dep.forEach(watch => watch.update());
  }
}