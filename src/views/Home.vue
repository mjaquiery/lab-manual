<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Item v-for="(I, index) in template.contents" :template="I" :key="index"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Item from '@/components/Item.vue'
import template from '@/assets/example.json'

export default {
  name: 'Home',
  components: {
    Item
  },
  data: function () {
    return {
      dataSource: './example.json',
      template
    }
  }
  // ,
  // mounted () {
  //   console.log(this.template)
  // }
}
</script>
