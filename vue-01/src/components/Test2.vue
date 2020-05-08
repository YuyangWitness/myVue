<template>
  <div>
    <Test3 />
  </div>
</template>

<script>
import Test3 from './Test3.vue'
export default {
  provide: {
    "name": "name11"
  },
  components: {
    Test3
  }
}
</script>

