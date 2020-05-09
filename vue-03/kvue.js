//数据响应式

function handlerArray(array) {
  // 获取原生数组的prototype
  const proto = Array.prototype;

  const newArray = Object.create(proto);

  const resetArrayFun = ["push", "shift", "unshift", "pop", "splice"];
  resetArrayFun.forEach(fun => {
    // args是个数组
    array[fun] = function(...args) {
      console.log("update view");
      newArray[fun].call(this, ...args);
      // 如果是新增操作，那么就要保证新增对象也会被监听
      let inserts;
      switch (fun) {
        case "push":
        case "unshift":
          inserts = args;
          break;
        case "splice":
          inserts = args.slice(2);
          break;
        default:
          break;
      }
      // 监听args数组
      observeArray(args);
    }
  }) 
}

function observeArray(array) {
  // 遍历数组，如果数组里面有对象，则监听
  for(let i = 0; i < array.length; i++) {
    observe(array[i]);
  }
  // 数组有push, shift, unshift, pop, splice等对数组长度进行操作的函数
  handlerArray(array);
}


function observe(obj) {
  if(typeof obj !== "object" || obj == null) return;

  // 对数组的响应式监听
  if(Array.isArray(obj)) {
    observeArray(obj);
  } else {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key]);
    })
  }
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
        this.createText(node, RegExp.$1);
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

  createText(node, exp) {
    this.update(node, exp, "text");
  }

  update(node, key, dir) {
    const fn = this[dir + "Updater"];
    const resultVal = getVmValue(this.vm, key);
    fn && fn(node, resultVal);
    new Watcher(this.vm, key, (value) => {
      fn && fn(node, value);
    });
  }

  htmlUpdater(node, value) {
    node.innerHTML = value;
  }

  textUpdater(node, value) {
    if(typeof value === "object") {
      node.textContent = JSON.stringify(value);
    } else {
      node.textContent = value;
    }
  }
}

// 监听触发视图改变
class Watcher {
  constructor(vm, key, fn) {
    this.vm = vm;
    this.key = key;
    this.fn = fn;

    Dep.target = this;
    getVmValue(this.vm, this.key);
    // this.vm[this.key];
    Dep.target = null;
  }

  update() {
    const resultVal = getVmValue(this.vm, this.key);
    this.fn.call(this.vm, resultVal);
  }
}

// handler deep nest object or array
function getVmValue(vm, exp) {
  return _.get(vm, exp);
  // if(isObj && /(.*)\[(.*)\]/.test(exp)) {
  //   return vm[RegExp.$1][RegExp.$2];
  // } else {
  //   return vm[exp];
  // }
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