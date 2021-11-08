<template>
  <p contenteditable="true" class="template-text">
    {{ text }}
  </p>
</template>

<script>
export default {
  name: 'TemplateText',
  props: {
    template: {default: null}
  },
  data: function () {
    return {
      text: null
    }
  },
  mounted: function () {
    console.log({template: this.template})

    if (typeof this.template === 'string') {
      this.text = this.template
    } else {
      this.text = this.template.text
      const matches = this.text.matchAll(/\\([0-9]+)/g)
      for (const match of matches) {
        console.log(match)
        const options = this.template.templateOptions
        const i = parseInt(match[1]) - 1
        console.log({match, i, options})
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
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
  p {
    background-color: lightblue;
  }
</style>
