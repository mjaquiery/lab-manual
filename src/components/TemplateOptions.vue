<template>
  <div class="template-options">
    <select ref="select" v-model="select_keys">
      <option value="-1">...</option>
      <option v-for="(x, i) in optsList" :key="i" :title="x.help" :value="i">
        {{x.text.replace(/\\[0-9]+/g, '...')}}
      </option>
    </select>
    <div>
    <span v-if="selected.length">
      <TemplateString v-for="(x, i) in selected" :key="i" :template="x"/>
    </span>
      <span class="placeholder" v-else>...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemplateOptions',
  props: {
    opts: {type: Array, required: true}
  },
  data: () => {
    return {
      select_keys: "",
      select_indices: []
    }
  },
  computed: {
    optsList() {
      const options = this.opts.map(o => {
        if(typeof o === 'string')
          return {text: o}
        return o
      })
      try {
        return options.map((o, i) => {
          return {...o, selected: this.select_indices.includes(i)}
        });
      } catch(e) {
        return options
      }
    },
    selected() {
      return this.optsList.filter(o => o.selected)
    }
  },
  watch: {
    select_keys(v) {
      this.select_indices = v instanceof Array? v : [v] //.split(',').map(v => parseInt(v))
      this.optsList.forEach((o, i) => {
        o.selected = this.select_indices.includes(i)
      })
    }
  },
  mounted () {
    // Set initial selectedness
    this.opts.forEach((o, i) => {
      if(typeof o === 'object' && o.selected)
        this.select_keys = this.select_keys.length? i : `${this.select_keys},${i}`
    })
    if(!this.select_keys.length)
      this.select_keys = "-1"
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  select {max-width: 100px}
  span.placeholder {background-color: #42b983; min-width: 4em;}
</style>
