<template>
  <div class="hello">
    <input v-bind="$attrs" v-on="$listeners" />
    <button @click="changeVal">changeVal</button>
    <button @click="getRef">getRef</button>
    <h2>{{msg.value}}</h2>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  inject:["msg"],
  methods: {
    changeVal() {
      // console.log(this.$parent.msg);
      this.$parent.parentVal = "hello world";
    },
    getRef() {
      // 获取失败$refs只能获取当前组件实例的refs
      // console.log(this.$refs.test1.msg);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
