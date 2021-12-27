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
     <form v-if="expanded && itemContent.options !== undefined">
      <div
              v-for="O in itemContent.options"
              :key="O"
              
      >
        <input
                type="radio"
                :value="O"
                v-model="selected"
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
    ...mapGetters(['getContentById', 'getSelectedId']),
    itemContent: function () {
      return this.getContentById(this.itemId)
    },
    // Decided to only communicate with the store through id
    // All modifications are made ony vuex side (vuex does the heavy lifting)
    selected: {
      get() {
        return this.getSelectedId(this.itemId)
      },
      // Set should commit not selected values as well
      // In case of not selected an array of ids will be sent
      set(value) {
        const payload = {
          'itemId': this.itemId,
          'optionId' : value 
        }
        this.$store.commit('SET_SELECTED', payload)
      }
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
