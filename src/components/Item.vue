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
     <form v-if="red">
      <div
              v-for="O in itemContent.options"
              :key="O"
      >
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

</style>
