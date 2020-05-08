<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <Recursion 
      v-for="(childData, index) in recursionData"
      :key="index" 
      :childData="childData"
      :level="1">
    </Recursion>
  </div>
</template>

<script>
import Recursion from './Recursion'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      recursionData: [
      {
        title: "水果",
        children: [
          {
            title: "苹果",
            children: [
              {
                title: "青苹果"
              },
              {
                title: "红苹果"
              },
              {
                title: "毒苹果"
              },
            ]
          },
          {
            title: "香蕉"
          },
          {
            title: "草莓"
          },
          {
            title: "脐橙",
            children: [
              {
                title: "赣南脐橙"
              },
              {
                title: "澳洲脐橙"
              }
            ]
          },
        ]
      },
      {
        title: "蔬菜",
        children: [
          {
            title: "小白菜"
          },
          {
            title: "包菜"
          },
          {
            title: "油麦菜"
          },
          {
            title: "韭菜"
          },
        ]
      },
      {
        title: "早餐",
        children: [
          {
            title: "牛奶"
          },
          {
            title: "面包"
          },
          {
            title: "面条"
          },
          {
            title: "豆浆"
          },
        ]
      },
      ]
    }
  },
  components: {
    Recursion
  }
}
</script>

<style scoped>
</style>
