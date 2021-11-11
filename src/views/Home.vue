<template>
  <div class="home">
    <BurgerButton></BurgerButton>
    <Sidebar>
     <ul class="sidebar-panel-nav">
     </ul>
   </Sidebar>
    <img alt="Vue logo" src="../assets/logo.png">
    <Item v-for="(I, index) in template.contents" :template="I" :key="index"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Item from '@/components/Item.vue'
import template from '@/assets/example.json'
import Sidebar from '@/components/Sidebar.vue'
import BurgerButton from '@/components/BurgerButton.vue';

export default {
  name: 'Home',
  components: {
    Item,
    Sidebar,
    BurgerButton
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
