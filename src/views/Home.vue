<template>
  <div class="flex flex-auto justify-end flex-nowrap flex-row bg-blue-500 bg-opacity-20 overflow-y-auto">
    <Sidebar>
    <!--  <ul class="sidebar-panel-nav"> -->
       <h2 class="pb-5 text-white font-bold">Dropped topics</h2>
       <!-- <p class="text-gray-50 pb-3 text-center">Discarded topics will be collected and can be restored from here.</p> -->
        <draggable
            v-model="binContents"
            item-key="id"
            :group='{name: "bin"}'
            class="self-start"
            handle=".handle"
            id="binList"
        >
        <template #item="{element}">
        <div class="flex flex-row">
          <div title="Drag topic back to the manual">
            <ViewListIcon class="handle h-5 w-5 pr-1 hover:cursor-grab"/>
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
        <div title="Add new topic here">
          <PlusCircleIcon
            v-if="!showAddItem"
            class="icon-btn"
            @click="addItem"
            @mouseover="showAddItemSkeleton = true"
            @mouseleave="showAddItemSkeleton = false"
          />
        </div>
        <div v-if="showAddItemSkeleton && !showAddItem" class="flex flex-col mt-5">
          <o-skeleton :animated=true class="mb-2 pl-2"></o-skeleton>
          <o-skeleton :animated=true height="5rem" class="pt-2 pl-2"></o-skeleton>
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
    <div class="fixed mt-2 mr-8">
      <button @click="this.$store.commit('TEMPLATE_MODAL_TOGGLE', true)" class="font-extrabold mr-2 text-xl rounded-2xl bg-blue-500 text-white p-2" title="Select a new lab manual template">Template</button>
      <o-modal v-model:active="isTemplateModalActive" :canCancel="['button']">
        <SelectTemplate/>
      </o-modal>
      <button @click="isDownloadModalActive = true" class="font-extrabold text-xl rounded-2xl bg-blue-500 text-white p-2" title="Download your lab manual">Download</button>
      <o-modal v-model:active="isDownloadModalActive">
        <DownloadButton/>
      </o-modal>
    </div>
<!--     <sidebar>
      <h2 class="pb-5 text-white font-bold">Contents</h2>
      <div v-if="loadingTemplate">Loading...</div>
      <TableOfContents v-else/>
    </sidebar> -->
  </div>
</template>

<script>
// @ is an alias to /src
import Sidebar from '@/components/Sidebar.vue'
import { mapState, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import Item from '@/components/Item.vue'
import BinItem from '@/components/BinItem.vue'
import AddItem from '@/components/AddItem.vue'
import DownloadButton from '../components/DownloadButton'
/* import TableOfContents from '@/components/TableOfContents.vue' */
// Icons
import { PlusCircleIcon, ViewListIcon, XCircleIcon, /* UploadIcon */ } from '@heroicons/vue/solid'
import SelectTemplate from '../components/SelectTemplate.vue'

export default {
  name: 'Home',
  components: {
    DownloadButton,
    Item,
    Sidebar,
    draggable,
    BinItem,
    AddItem,
    /*    TableOfContents, */
    // Icons
    PlusCircleIcon,
    ViewListIcon,
    XCircleIcon
    /* UploadIcon */
    ,
    SelectTemplate
},
  computed: {
    ...mapState(['flat', 'errorLoadingTemplate', 'loadingTemplate', 'markdown', 'templateList', 'isTemplateModalActive']),
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
      showAddItemSkeleton: false,
      isDownloadModalActive: false
    }
  },
  methods: {
    addItem: function () {
      this.showAddItem = true
    },
    closeAddItem: function () {
      this.showAddItemSkeleton = false
      this.showAddItem = false
    }
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
