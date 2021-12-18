<template>
  <div class="template-options">
    <select 
      ref="select"
      v-model="select_keys"
    >
      <option value="-1">...</option>
      <option v-for="(x, i) in templateOptionContent" :key="i" :title="x.help" :value="i">
        {{x.text.replace(/\\[0-9]+/g, '...')}}
      </option>
    </select>
    <div>
    <span v-if="selected.length">
      <!-- return id of selected component! -->
      <TemplateString v-for="x in selected" :key="x" :optionId="x"/>
    </span>
      <span class="placeholder" v-else>...</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TemplateOptions',
  props: {
    templateOptionId: {type: Array, required: true}
  },
  data: () => {
    return {
      select_keys: "",
      select_indices: []
    }
  },
  computed: {
    ...mapGetters(['getContentById']),
    // Get the content of the templateOtions
    templateOptionContent() {
      // Get content from store by id
      const template = this.templateOptionId.map(o => {
        return this.getContentById(o)
      })
      
      // Return text if the templateOption is only a string
      const options = template.map(o => {
        if(typeof o === 'string')
          return {text: o}
        return o
      })
      // Add selected object id to the object
      try {
        return options.map((o, i) => {
          return {...o, selected: this.select_indices.includes(i)}
        });
      } catch(e) {
        return options
      }
    },
    selected() {
      // Get id of selected component
      return this.templateOptionId.filter((a, index) => index === this.select_keys)
    }
  },
  watch: {
    select_keys(v) {
      this.select_indices = v instanceof Array? v : [v] //.split(',').map(v => parseInt(v))
      this.templateOptionContent.forEach((o, i) => {
        o.selected = this.select_indices.includes(i)
      })
    }
  },
  mounted () {
    // Set initial selectedness
    this.templateOptionContent.forEach((o, i) => {
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
