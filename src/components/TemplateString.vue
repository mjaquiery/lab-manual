<template>
  <div class="template-string">
    <span class="template-string-content" v-for="(c,i) in optionContent" :key="i">
      <span v-if="typeof c === 'string' && !isOption">{{c}}</span>
      <TemplateOptions v-else-if="typeof c !== 'string'" isOption="true" :templateOptionId="c.templateOptions"/>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TemplateString',
  props: {
    optionId: {type: Number, default: null},
    optionKey: {type: Number, default: 1},
    formKey: {type: Number, default: null},
    isOption: {type: Boolean, default: false}
  },
  computed: {
    ...mapGetters(['getContentById']),
    // Get content of templateString
    optionContent: function () {
      // Read content from the store by id
      let template = this.getContentById(this.optionId)
      
      let contents = [];
      // Return template if it's just a string
      if (typeof template === 'string') {
        contents.push(template)
      // Return template.text if it is an object but does not include
      // templateOptions
      } else if (template.templateOptions === undefined) {
        contents.push(template.text)
      // Return template splitted if it includes templateOptions
      } else {
        const matches = template.text.matchAll(/\\([0-9]+)/g)
        const splitted = template.text.split(/\\([0-9])+/g)
        const optionsObject = []
        for (const match of matches) {
          const i = parseInt(match[1]) - 1
          const templateOptions = template.templateOptions[i]
          optionsObject.push({match, i, templateOptions})
        }
        contents = splitted.map(obj => optionsObject.find(o => o.match[1] === obj) || obj)
      }
      return contents;
    }
  }
}
</script>

<style scoped>
div {
  @apply inline-flex;
}
</style>
