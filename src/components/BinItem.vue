<template>
  <div class="BinItem">
    <Title
    :level=3
    class="pb-3 text-white"
    >
      {{ itemContent.title }}
    </Title>
  </div>
</template>

<script>
import Title from '@/Title.js'
import { mapGetters } from 'vuex'

export default {
  name: 'BinItem',
  components: {
    Title 
  },
  props: {
    itemId: {type: Number, default: null},
  },
  computed: {
    ...mapGetters(['getBinContentById']),
    itemContent: function () {
      return this.getBinContentById(this.itemId)
    }
  },
  methods: {
    // onChange(evt) {
    //   // On change get changed element id
    //     if (Object.keys(evt).includes("moved")) {
    //       return evt.moved.element
    //     } else if (Object.keys(evt).includes("added")) {
    //       return evt.added.element
    //     }
    // }
    // onMove: function (evt) {
    //   console.log(evt);
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .ghost {
  border: 1px dashed grey;
  font-size: 0;
  overflow: hidden;
} */
</style>
