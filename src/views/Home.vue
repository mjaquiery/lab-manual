<template>
  <div class="home">
    <Sidebar>
     <ul class="sidebar-panel-nav">
       <h3>Bin</h3>
        <draggable
            v-model="binContents"
            item-key="id"
            :group='{name: "bin"}'
        >
        <template #item="{element}">
          <BinItem
            :itemId="element"
          />
        </template>
        </draggable>
     </ul>
   </Sidebar>
    <div class="manual">
      <section v-if="errorLoadingTemplate">
        <p>We're sorry, we're not able to retrieve this information at the moment, please try back later.</p>
      </section>
      <section v-else>
        <div v-if="loadingTemplate">Loading...</div>
        <draggable
        v-else
        v-model="rootContents"
        item-key="id"
        :group='{name: "0level", put: "bin"}'
        @add="onAdd"
        ghost-class="ghost"
        >
        <template #item="{element}">
          <Item
            :itemId="element"
            :level=1
          />
        </template>
        </draggable>
        <button @click="addItem">Add new item</button>
        <div v-if="showAddItem">
          <AddItem
            :parentItemId="getRootObj.id"
          />
          <button @click="closeAddItem">Close add item</button>
        </div>
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
import BinItem from '@/components/BinItem.vue'
import AddItem from '@/components/AddItem.vue'

export default {
  name: 'Home',
  components: { 
    Item,
    Sidebar,
    draggable,
    BinItem,
    AddItem
  },
  computed: {
    ...mapState(['flat', 'errorLoadingTemplate', 'loadingTemplate']),
    ...mapGetters(['getRootObj', 'getDeletedItemIds']),
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
        return this.getDeletedItemIds
        //return this.bin
      },
      set() {
        return this.getDeletedItemIds
        // const payload = {
        //   'itemIds': value 
        // }
        // this.$store.commit('UPDATE_BIN_ITEM_ORDER', payload)
      }
    }
  },
  data: function () {
    return {
      showAddOption: false,
      showAddItem: false
    }
  },
  methods: {
    ...mapActions(['getTemplate']),
    onAdd: function (evt) {
        const payload = {
          'itemId' : evt.item.__draggable_context.element
        }
        this.$store.commit('RESTORE_ITEM', payload)
    },
    addOption: function () {
      this.showAddOption = true
    },
    closeAddOption: function () {
      this.showAddOption = false
    },
    addItem: function () {
      this.showAddItem = true
    },
    closeAddItem: function () {
      this.showAddItem = false
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

.ghost {
  border: 1px dashed grey;
  font-size: 0;
  overflow: hidden;
}
</style>
