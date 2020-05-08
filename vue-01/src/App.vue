<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" :value="value" :type="type" @click="click" @focus="focus" />
    <Test1 ref="test1" />
    <input type="button" value="getChild" @click="getChild" />
    <p>{{parentVal}}</p> -->
    <FormTest />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import Test1 from './components/Test1.vue'
import FormTest from './FormTest.vue'


import vue from 'vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    // Test1
    FormTest
  },
  data() {
    return {
      parentVal: 123,
      value: "attrTest",
      type: "input"
    }
  },
  methods: {
    getChild() {
      console.log(this.$children);
    },
    click() {
      console.log("click");
      // console.log(this.$refs.test1.msg);
    },
    focus() {
      console.log("focus");
    }
  },
  provide() {
    return {
      msg: vue.observable({
        value: "observable value"
      }),
      getHello() {
        console.log("hello");
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
