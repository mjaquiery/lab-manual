<template>
  <div class="hello">
    <Title
      :level="level"
      @click="toggleRed"
      :class="[red? 'red' : 'blue', `level${level}`]"
    >
      [{{level}}]: {{ template.title }}
    </Title>
    <p v-if="red">{{ template.description }}</p>
    <TemplateText
      contenteditable="true"
      v-for="(O, index) in template.options"
      :template="O"
      :key="index"
    />
    <Item v-for="(I, index) in template.contents" :template="I" :key="index" :level="level + 1"/>
  </div>
</template>

<script>
import TemplateText from '@/components/TemplateText'
import Title from '@/Title.js'

export default {
  name: 'Item',
  components: {
    TemplateText,
    Title
  },
  props: {
    template: {type: Object, default: null},
    level: {type: Number, default: 1}
  },
  data: function () {
    return {
      red: false
    }
  },
  methods: {
    toggleRed: function () {
      this.red = !this.red
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

.red {color: red;}

.blue {color: blue;}
</style>
