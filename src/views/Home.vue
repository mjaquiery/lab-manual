<template>
  <div class="flex flex-auto justify-end flex-nowrap flex-row bg-blue-500 bg-opacity-20">
    <Sidebar>
    <!--  <ul class="sidebar-panel-nav"> -->
       <h2 class="pb-5 text-white font-bold">Dropped items</h2>
        <draggable
            v-model="binContents"
            item-key="id"
            :group='{name: "bin"}'
            class="self-start"
            handle=".handle"
        >
        <template #item="{element}">
        <div class="flex flex-row">
          <ViewListIcon class="handle h-5 w-5 pr-1 text-white"/>
          <BinItem
            :itemId="element"
          />
          </div>
        </template>
        </draggable>
   <!--   </ul> -->
   </Sidebar>
    <div class="flex flex-col flex-grow flex-shrink-0 ml-5 overflow-y-auto">
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
        ghost-class="ghost"
        handle=".handle"
        >
        <template #item="{element}">
          <div>
            <ViewListIcon class="handle h-5 w-5"/>
            <Item
              :itemId="element"
              :level=1
            />
          </div>
        </template>
        </draggable>
        <PlusCircleIcon
           class="h-5 w-5"
          @click="addItem"
        />
        <div v-if="showAddItem">
          <AddItem
            :parentItemId="getRootObj.id"
          />
          <XCircleIcon
            @click="closeAddItem"
            class="h-5 w-5"
          />
        </div>
      </section>
    </div>
<!--   <div>
    <h3 class="pb-5">Output options</h3>
    <button
      @click="printDownload"
      class="flex flex-row"
    >
      <span>Download lab manual</span>
    <DownloadIcon 
      class="h-5 w-5"
    />
    </button>
  </div> -->
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
// Icons
import { PlusCircleIcon, ViewListIcon, XCircleIcon /* DownloadIcon */ } from '@heroicons/vue/solid'

export default {
  name: 'Home',
  components: { 
    Item,
    Sidebar,
    draggable,
    BinItem,
    AddItem,
    // Icons
    PlusCircleIcon,
    ViewListIcon,
    XCircleIcon
 /*    DownloadIcon */
  },
  computed: {
    ...mapState(['flat', 'errorLoadingTemplate', 'loadingTemplate', 'markdown']),
    ...mapGetters(['getRootObj', 'getDeletedItemIds', 'getComponentOptions']),
    // componentOptions: function () {
    //   return this.getComponentOptions(this.getRootObj.id)
    // },
    // Model array of nested contents in root for draggable
    rootContents: {
      get() {
        return this.getRootObj.content.contents
      },
      set(value) {
        const me = this;
        const payload = {
          'itemId': me.getRootObj.id,
          'contents' : value.map(x => {
            if(me.flat[x].deleted)  // deleted item being restored
              me.$store.commit('RESTORE_ITEM', {itemId: x})
            return x
          })
        }
        // console.log({value, payload})
        me.$store.commit('UPDATE_ITEM_ORDER', payload)
      }
    },
    // Model array for the not used contents
    binContents: {
      get() {
        return this.getDeletedItemIds
      },
      set() {
        return this.getDeletedItemIds
      }
    }
  },
  data: function () {
    return {
      showAddItem: false
    }
  },
  methods: {
    ...mapActions(['getTemplate', 'getOutput']),
    addItem: function () {
      this.showAddItem = true
    },
    closeAddItem: function () {
      this.showAddItem = false
    },
    printDownload: function () {
      this.$store.commit('TO_MARKDOWN', this.flat)
      this.getOutput()
    }
  },
  mounted() {
    // Get template on load
    this.getTemplate()
  }
}
</script>

<style scoped>
/* .ghost {
  border: 1px dashed grey;
  font-size: 0;
  overflow: hidden;
} */
</style>
