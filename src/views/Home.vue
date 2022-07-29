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
          <div title="Drag topic back to the manual">
            <ViewListIcon class="handle h-5 w-5 pr-1 text-white hover:cursor-grab"/>
          </div>
          <BinItem
            class="hover:cursor-default"
            :itemId="element"
          />
          </div>
        </template>
        </draggable>
   <!--   </ul> -->
   </Sidebar>
    <div class="flex flex-col flex-grow flex-shrink-0 ml-5 overflow-y-auto pt-6">
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
          <div class="flex flex-row">
            <div title="Drag topic to replace order on the same level">
              <ViewListIcon class="handle h-5 w-5 mr-2 hover:cursor-grab"/>
            </div>
            <Item
              :itemId="element"
              :level=1
            />
          </div>
        </template>
        </draggable>
        <div title="Add new topic">
          <PlusCircleIcon
            class="icon-btn"
            @click="addItem"
          />
        </div>
        <div v-if="showAddItem">
          <AddItem
            :parentItemId="getRootObj.id"
          />
          <div title="Close add topic panel">
            <XCircleIcon
              @click="closeAddItem"
              class="icon-btn"
            />
          </div>
        </div>
      </section>
    </div>
    <button @click="isModalActive = true" class="fixed mt-2 mr-8 font-extrabold text-xl rounded-2xl bg-blue-500 text-white p-2">Download</button>
    <o-modal v-model:active="isModalActive">
      <h2 class="ml-2 mb-2">Download options</h2>
      <div class="flex flex-col items-center">
        <form action="#" class="ml-2">
          <label for="format" class="mr-2 mb-2">Select output format</label>
          <select name="output_formats" id="format" class="rounded-md mb-6 bg-blue-300 bg-opacity-50 p-1">
            <option value="pdf">PDF</option>
            <option value="docx">Docx</option>
            <option value="markdown">Markdown</option>
            <option value="json">JSON</option>
          </select>
        </form>
        <button @click="printDownload" class="rounded-md p-2 bg-blue-300 bg-opacity-50 flex flex-row font-bold">
          <DownloadIcon class="h-5 w-5"/>
          <span>Download</span>
        </button>
      </div>
    </o-modal>
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
import { PlusCircleIcon, ViewListIcon, XCircleIcon, DownloadIcon } from '@heroicons/vue/solid'

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
    XCircleIcon,
    DownloadIcon
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
      showAddItem: false,
      isModalActive: false
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
