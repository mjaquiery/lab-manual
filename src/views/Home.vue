<template>
  <div class="home">
    <Sidebar>
     <ul class="sidebar-panel-nav">
       <h3>Bin</h3>
        <draggable
            v-model="binContents"
            item-key="id"
            group="bin"
            @add="onAdd"
        >
        <template #item="{element}">
          <h1>{{element.content.title}}</h1>
        </template>
        </draggable>
     </ul>
   </Sidebar>
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
        group="manual"
        ghost-class="ghost"
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
    Item,
    Sidebar,
    draggable
  },
  computed: {
    ...mapState(['flat', 'errorLoadingTemplate', 'loadingTemplate']),
    ...mapGetters(['getRootObj', 'getDeletedItems', 'getNonDeletedObjs']),
    // Model array of nested contents in root for draggable
    rootContents: {
      get() {
        return this.getRootObj.content.contents
      },
      set(value) {
        const payload = {
          'itemId': this.getRootObj.id,
          'contents' : value 
        }
        this.$store.commit('UPDATE_ITEM_ORDER', payload)
      }
    },
    // Model array for the not used contents
    binContents: {
      get() {
        console.log(this.getNonDeletedObjs)
        return this.getDeletedItems
      }
      // set(value) {

      // }
    }
  },
  methods: {
    ...mapActions(['getTemplate'])
    // onAdd: function (evt) {
    //     const payload = {
    //       'itemId' : evt.item.__draggable_context.element
    //     }
    //     this.$store.commit('ADD_TO_BIN', payload)
    // }
    // onMove: function (evt) {
    //   console.log(evt);
    // },
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

.ghost {
  border: 1px dashed grey;
  font-size: 0;
  overflow: hidden;
}
</style>
