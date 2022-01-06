<template>
  <div class="home">
    <Sidebar>
     <ul class="sidebar-panel-nav">
     </ul>
   </Sidebar>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <div class="manual">
      <section v-if="errorLoadingTemplate">
        <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
      </section>
      <section v-else>
        <div v-if="loadingTemplate">Loading...</div>
    <draggable
      v-else
      v-model="rootContents"
      item-key="id"
      :move="onMove"
      group="manual"
    >
    <template #item="{element}">
        <Item
          :itemId="element"
          :level=1
        />
        </template>
        </draggable>
      </section>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Sidebar from '@/components/Sidebar.vue'
import { mapActions, mapState, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import Item from '@/components/Item.vue'

export default {
  name: 'Home',
  components: { 
    // Item,
    Item,
    Sidebar,
    draggable
  },
  data: function () {
    return {
      // dataSource: './example.json',
      // template
    }
  },
  computed: {
    ...mapState(['flat', 'errorLoadingTemplate', 'loadingTemplate']),
    ...mapGetters(['getRootObj']),
    // Model array of nested contents in root for draggable
    rootContents: {
      get() {
        // Object.values(this.getRootObj.content.contents)
        return this.getRootObj.content.contents
      },
      set(value) {
        const payload = {
          'itemId': this.getRootObj.id,
          'contents' : value 
        }
        this.$store.commit('UPDATE_ITEM_ORDER', payload)
      }
    }
  },
  methods: {
    ...mapActions(['getTemplate']),
    onMove: function (evt) {
      console.log(evt);
    }
  },
  mounted() {
    // Get template on load
    this.getTemplate()
  }
}
</script>

<style scoped>
.home {
  display: flex;
  /* position: relative; */
}

.manual {
  /* flex-direction: column; */
  flex: 1;
}

</style>
