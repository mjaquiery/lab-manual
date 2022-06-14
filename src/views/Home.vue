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
      <section>
        <h1>Download:</h1>
        <DownloadButton/>
      </section>
    </div>
  <div>
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
// Icons
import { PlusCircleIcon, ViewListIcon, XCircleIcon } from '@heroicons/vue/solid'
import DownloadButton
  from '../components/DownloadButton'

export default {
  name: 'Home',
  components: {
    DownloadButton,
    Item,
    Sidebar,
    draggable,
    BinItem,
    AddItem,
    // Icons
    PlusCircleIcon,
    ViewListIcon,
    XCircleIcon
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
