<template>
  <div>
    <p :style="{paddingLeft: level * 15 + 'px'}" @click="showChild">{{childData.title}}</p>
    <div v-show="isOpen" v-if="childData.children && childData.children.length > 0">
      <Recursion 
        v-for="(data, index) in childData.children"
        :key="index" 
        :childData="data"
        :level="level+1"></Recursion>
    </div>
  </div>
</template>

<script>
export default {
  name: "Recursion",
  props: {
    childData: Object,
    level: Number
  },
  data(){
    return {
      isOpen: false
    }
  },
  methods: {
    showChild() {
      if(this.childData.children && this.childData.children.length > 0) {
        this.isOpen = !this.isOpen;
      }
    }
  }
}
</script>

