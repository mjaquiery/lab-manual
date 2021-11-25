<template>
  <div class="template-string">
    <span class="template-string-content" v-for="(c,i) in contents" :key="i">
      <span v-if="typeof c === 'string'">{{c}}</span>
      <TemplateOptions v-else :opts="c.options"/>
    </span>
  </div>
</template>

<script>
export default {
  name: 'TemplateString',
  props: {
    template: {default: null},
    optionKey: {type: Number, default: 1},
    formKey: {type: Number}
  },
  data: function () {
    return {
      selected: false,
      picked: ''
    }
  },
  methods: {
    selectOption() {
      // const selectedValue = event.target.value;
      // this.selected = true
      // const test = this.value === this.picked
      // console.log(test);
    }
  },
  computed: {
    contents() {
      let contents = [];
      if (typeof this.template === 'string') {
        contents.push(this.template)
      } else if (this.template.templateOptions === undefined) {
        contents.push(this.template.text)
      } else {
        const matches = this.template.text.matchAll(/\\([0-9]+)/g)
        const splitted = this.template.text.split(/\\([0-9])+/g)
        const optionsObject = []
        for (const match of matches) {
          // console.log(match)
          const i = parseInt(match[1]) - 1
          const options = this.template.templateOptions[i]
          optionsObject.push({match, i, options})
        }
        contents = splitted.map(obj => optionsObject.find(o => o.match[1] === obj) || obj)
      }
      return contents;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: inline-flex;
  background-color: lightblue;
}
</style>
