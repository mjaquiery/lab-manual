<template>
  <div id="app">
    <img src="./assets/logo.png">
    <Item v-for="(I, index) in template.contents" :template="I" :key="index"/>
  </div>
</template>

<script>
import Item from './components/Item'
import template from './assets/example.json'

export default {
  name: 'App',
  components: {
    Item
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
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
