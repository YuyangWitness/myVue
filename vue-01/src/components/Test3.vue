<template>
  <div>
    <h1>{{msg.value}}</h1>
    <button @click="changeInject"></button>
    <h2>{{name}}</h2>
  </div>
  
</template>

<script>
export default {
  inject: ["msg", "getHello", "name"],
  methods: {
    changeInject() {
      console.log(this.msg.value);
      this.msg.value = "provider change";
    }
  }
}
</script>

