<template>
  <input type="radio" :name="formKey" :value="optionKey" @change="selectOption" v-model="picked">
  <label :for="optionKey" contenteditable="true" :class="selected? 'red' : 'blue'">
    [{{optionKey}}]: {{ text }} {{picked}}
  </label>
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
      text: null,
      selected: false,
      picked: '',
      templateOptionsObject: null
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
  mounted: function () {
    // console.log(this.template.templateOptions)
    if (typeof this.template === 'string') {
      this.text = this.template
    } else if (this.template.templateOptions === undefined) {
      this.text = this.template.text
    } else {
      this.text = this.template.text
      const matches = this.text.matchAll(/\\([0-9]+)/g)
      var splitted = this.text.split(/\\([0-9])+/g)
      var optionsObject = []
      for (const match of matches) {
        // console.log(match)
        const options = this.template.templateOptions
        const i = parseInt(match[1]) - 1
        optionsObject.push({match, i, options})
      }
      var templateOptionsObject = splitted.map(obj => optionsObject.find(o => o.match[1] === obj) || obj)
      console.log(templateOptionsObject)
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
label {
  background-color: lightblue;
}
.red {color: red;}

.blue {color: blue;}
</style>
