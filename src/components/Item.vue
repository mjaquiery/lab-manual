<template>
  <div
    :class="['item', `pl-${level * 2}`]"
  >
    <Title
      :level="level"
      @click="toggleExpanded"
    >
      [{{level}}]: {{ itemContent.title }}
    </Title>
    <p v-if="expanded">{{ itemContent.description }}</p>
    <form v-if="expanded">
      <div
              v-for="(O, i) in itemContent.options"
              :key="O"
      >
        <input
                type="radio"
                :value="i"
                v-model="itemContent['options-selected']"
                :name="`template-string-selection-${itemId}`"
        />
        <TemplateString
                :optionId="O"
                :optionKey="O"
                :formKey="itemId"
        />
      </div>
    </form>
    <Item v-for="I in itemContent.contents" :key="I" :level="level + 1" :itemId="I"/>
  </div>
</template>

<script>
import TemplateString from '@/components/TemplateString'
import Title from '@/Title.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Item',
  components: {
    TemplateString,
    Title
  },
  props: {
    itemId: {type: Number, default: null},
    level: {type: Number, default: 1}
  },
  computed: {
    ...mapGetters(['getContentById']),
    itemContent: function () {
      return this.getContentById(this.itemId)
    }
  },
  data: function () {
    return {
      expanded: false
    }
  },
  methods: {
    toggleExpanded: function () {
      this.expanded = !this.expanded
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
