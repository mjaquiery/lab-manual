<template>
  <div 
    :class="['item', `pl-${level * 2}`]" 
  >
    <Title
      :level="level"
      @click="toggleRed"
    >
      [{{level}}]: {{ itemContent.title }}
    </Title>
    <p v-if="red">{{ itemContent.description }}</p>
     <form v-if="red && itemContent.options !== undefined">
      <label
              v-for="O in itemContent.options"
              :key="O"
              
      >
      <input type="radio" :name="itemId" :value="O" v-model="picked">
        <TemplateString
                :optionId="O"
                :optionKey="O"
                :formKey="itemId"
        />
      </label>
    </form>
    <Item v-for="I in itemContent.contents" :key="I" :level="level + 1" :itemId="I"/>
  </div>
</template>

<script>
import TemplateString from '@/components/TemplateString'
import Title from '@/Title.js'
import { mapGetters, mapMutations } from 'vuex'

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
    picked: {
      get() {
        return this.getSelectedId(this.itemContent.options)
      },
      // Set should commit not selected values as well
      // In case of not selected an array of ids will be sent
      set(value) {
        // Get non-selected values
        const notSelectedIds = this.itemContent.options.filter(o => o !== value)
        this.$store.commit('SET_NOT_SELECTED', notSelectedIds)
        this.$store.commit('SET_SELECTED', value)
      }
    }
  },
  data: function () {
    return {
      red: false
    }
  },
  methods: {
    toggleRed: function () {
      this.red = !this.red
    },
    ...mapMutations(['SET_SELECTED'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
