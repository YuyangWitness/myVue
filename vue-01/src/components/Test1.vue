<template>
  <div>
    {{msg}}
    {{parentVal}}
    <Test2 />
  </div>
  
</template>

<script>
import Test2 from './Test2.vue'

export default {
  data() {
    return {
      msg: "hello world",
      parentVal: this.$parent.parentVal
    }
  },
  components: {
    Test2
  }
}
</script>


