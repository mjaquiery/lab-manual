<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Item v-for="(I, index) in template.contents" :template="I" :key="index"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Item from '@/components/Item.vue'; // @ is an alias to /src
import template from '@/assets/example.json';

@Options({
  components: {
    Item,
  },
  data: function () {
    return {
      dataSource: './example.json',
      template
    }
  },
  mounted () {
    console.log(this.template)
  }
})
export default class Home extends Vue {}
</script>
