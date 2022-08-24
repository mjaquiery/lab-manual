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
    <div class="fixed mt-2 mr-8">
      <button @click="isTemplateModalActive = true" class="font-extrabold mr-2 text-xl rounded-2xl bg-blue-500 text-white p-2">Template</button>
      <o-modal v-model:active="isTemplateModalActive" :canCancel="['button']">
        <h2 class="ml-2 mb-2">Template options</h2>
        <p v-if="!loadingTemplate" class="text-bold">Beware that by loading a new template will lead to the loss of previous progress!</p>
        <div class="flex flex-col items-center">
          <form action="#" class="ml-2">
            <label for="fmt" class="mr-2 mb-2">Select template</label>
            <select name="output_formats" id="fmt"
                    class="rounded-md mb-6 bg-blue-300 bg-opacity-50 p-1" v-model="selectedTemplate">
              <option value="" disabled selected hidden>Please select a template</option>
              <option
                v-for="(template, i) in this.templateList"
                :key="i"
                :value="`${template.template}`"
                :title="`${template.usecase}`"
              >
                {{template.title}}
              </option>
            </select>
          </form>
          <button @click="loadTemplate" :disabled="this.selectedTemplate === '' ? true : false" class="disabled-btn rounded-md p-2 bg-blue-300 bg-opacity-50 flex flex-row font-bold">
            <span>Load {{this.loadingTemplate ? '' : 'new'}} template</span>
          </button>
          <button v-if="!loadingTemplate" @click="isTemplateModalActive = false" class="disabled-btn rounded-md p-2 bg-blue-300 bg-opacity-50 flex flex-row font-bold mt-2">
            <span>Keep current progress</span>
          </button>
        </div>
      </o-modal>
      <button @click="isDownloadModalActive = true" class="font-extrabold text-xl rounded-2xl bg-blue-500 text-white p-2">Download</button>
      <o-modal v-model:active="isDownloadModalActive">
        <h2 class="ml-2 mb-2">Download options</h2>
        <div class="flex flex-col items-center">
          <form action="#" class="ml-2">
            <label for="format" class="mr-2 mb-2">Select output format</label>
            <select name="output_formats" id="format" v-model="format" class="rounded-md mb-6 bg-blue-300 bg-opacity-50 p-1">
              <option value="pdf" :disabled="formatStatus['pdf'] !== ''">
                PDF<span v-if="formatStatus['pdf'] !== ''"> [{{formatStatus['pdf']}}]</span>
              </option>
              <option value="docx" :disabled="formatStatus['docx'] !== ''">
                Docx<span v-if="formatStatus['docx'] !== ''"> [{{formatStatus['docx']}}]</span>
              </option>
              <option value="html" :disabled="formatStatus['html'] !== ''">
                HTML<span v-if="formatStatus['html'] !== ''"> [{{formatStatus['html']}}]</span>
              </option>
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
            </select>
          </form>
          <button
              @click="printDownload"
              class="rounded-md p-2 bg-blue-300 bg-opacity-50 flex flex-row font-bold"
              :disabled="printDisabled"
          >
            <DownloadIcon class="h-5 w-5"/>
            <span>Download</span>
          </button>
        </div>
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
import { mapActions, mapState, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import Item from '@/components/Item.vue'
import BinItem from '@/components/BinItem.vue'
import AddItem from '@/components/AddItem.vue'
/* import TableOfContents from '@/components/TableOfContents.vue' */
// Icons
import { PlusCircleIcon, ViewListIcon, XCircleIcon, DownloadIcon, /* UploadIcon */ } from '@heroicons/vue/solid'

export default {
  name: 'Home',
  components: { 
    Item,
    Sidebar,
    draggable,
    BinItem,
    AddItem,
 /*    TableOfContents, */
    // Icons
    PlusCircleIcon,
    ViewListIcon,
    XCircleIcon,
    DownloadIcon,
    /* UploadIcon */
  },
  computed: {
    ...mapState(['flat', 'errorLoadingTemplate', 'loadingTemplate', 'markdown', 'templateList', 'pandoc_api_formats']),
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
    },
    formatStatus() {
      try {
        const out = {}
        this.pandoc_api_formats.forEach(x => out[x.name] = x.status)
        return out
      } catch (e) {
        return ""
      }
    },
    printDisabled() {
      return false
      // return this.format && this.formatStatus[this.format] !== ''
    }
  },
  data: function () {
    return {
      showAddItem: false,
      isDownloadModalActive: false,
      isTemplateModalActive: true,
      selectedTemplate: '',
      format: 'pdf'
    }
  },
  methods: {
    ...mapActions(['getTemplate', 'getOutput', 'getTemplateList']),
    addItem: function () {
      this.showAddItem = true
    },
    closeAddItem: function () {
      this.showAddItem = false
    },
    printDownload: function () {
      // Store the lab manual in markdown format as a state
      this.$store.commit('TO_MARKDOWN', this.flat)
      // Send markdown to pandoc-api through vuex action
      this.getOutput(this.format)
    },
    loadTemplate: function() {
      this.isTemplateModalActive = false
      this.getTemplate(this.selectedTemplate)
    }
  },
  mounted() {
    // Get templateList on load
    this.getTemplateList()
    //this.selectedTemplate = this.templateList[0].template
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
