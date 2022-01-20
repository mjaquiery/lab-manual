<template>
  <div
    :class="['item', `pl-${level * 2}`]"
    v-if="itemContent !== null"
  >
    <Title
      :level="level"
      @click="toggleExpanded"
      :contenteditable="editable"
      @blur="updateTitle"
    >
      {{ itemContent.title }}
    </Title>
    <div
      class="inline-flex"
    >
      <PencilAltIcon
        class="h-5 w-5"
        @click="toggleEdit"
      />
      <ArrowCircleLeftIcon
        class="h-5 w-5"
        @click="leftIndBtn"
      />
      <ArrowCircleRightIcon
        class="h-5 w-5"
        @click="rightIndBtn"
      />
      <TrashIcon
        class="h-5 w-5"
        @click="deleteBtn"
      />
    </div>
    <p
      v-if="expanded"
      :contenteditable="editable"
      @blur="updateDescription"
    >
      {{ itemContent.description }}
    </p>
     <form v-if="expanded && itemContent.options !== undefined">
      <div
              v-for="(O, i) in itemContent.options"
              :key="O"
              
      >
        <input
                type="radio"
                :value="i"
                v-model="selected"
                :name="`template-string-selection-${itemId}`"
        />
        <TemplateString
                :optionId="O"
                :optionKey="O"
                :formKey="itemId"
        />
      </div>
    </form>
    <PlusCircleIcon
      class="h-5 w-5"
      @click="addOption"
      v-if="expanded"
    />
    <div v-if="expanded && showAddOption">
    <AddTemplateString
      :itemId="itemId"
    />
    <button @click="closeAddOption">Close add option</button>
    </div>
    <draggable
      v-if="itemContent.contents"
      v-model="itemContents"
      item-key="id"
      :group='{name: `${level}level`, put: "bin"}'
      ghost-class="ghost"
      @add="onAdd"
      handle=".handle"
    >
    <template #item="{element}">
      <div>
        <ViewListIcon class="handle h-5 w-5"/>
        <Item 
          :level="level + 1"
          :itemId="element"
        />
      </div>
    </template>
    </draggable>
    <PlusCircleIcon
      class="h-5 w-5"
      @click="addItem"
      v-if="level < 6 "
    />
    <div v-if="showAddItem">
      <AddItem
        :parentItemId="itemId"
      />
          <button @click="closeAddItem">Close add item</button>
    </div>
  </div>
</template>

<script>
import TemplateString from '@/components/TemplateString'
import Title from '@/Title.js'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import AddTemplateString from '@/components/AddTemplateString'
import AddItem from '@/components/AddItem'
// Icons
import { PencilAltIcon, ArrowCircleRightIcon, ArrowCircleLeftIcon, PlusCircleIcon, TrashIcon, ViewListIcon } from '@heroicons/vue/solid'

export default {
  name: 'Item',
  components: {
    // Custom components
    TemplateString,
    Title,
    AddTemplateString,
    AddItem,
    // Imported components
    draggable,
    // Icons
    PencilAltIcon,
    ArrowCircleRightIcon,
    ArrowCircleLeftIcon,
    PlusCircleIcon,
    TrashIcon,
    ViewListIcon
  },
  props: {
    itemId: {type: Number, default: null},
    level: {type: Number, default: 1}
  },
  computed: {
    ...mapGetters(['getContentById', 'getSelectedId']),
    itemContent: function () {
      return this.getContentById(this.itemId)
    },
    // Model array of nested contents for draggable
    itemContents: {
      get() {
        return Object.values(this.itemContent.contents)
      },
      set(value) {
        const payload = {
          'itemId': this.itemId,
          'contents' : value 
        }
        this.$store.commit('UPDATE_ITEM_ORDER', payload)
      }
    },
    // Decided to only communicate with the store through id
    // All modifications are made ony vuex side (vuex does the heavy lifting)
    selected: {
      get() {
        return this.getSelectedId(this.itemId)
      },
      // Set should commit not selected values as well
      // In case of not selected an array of ids will be sent
      set(value) {
        const payload = {
          'itemId': this.itemId,
          'optionIndex' : value 
        }
        this.$store.commit('SET_SELECTED', payload)
      }
    }
  },
  data: function () {
    return {
      expanded: false,
      editable: false,
      showAddOption: false,
      showAddItem: false
    }
  },
  methods: {
    toggleExpanded: function () {
      if (this.editable) {
        this.expanded
      } else {
        this.expanded = !this.expanded
      }
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
    },
    toggleEdit: function () {
      this.editable = !this.editable
    },
    deleteBtn: function () {
      const payload = {
        'itemId': this.itemId,
      }
      this.$store.commit('DELETE_ITEM', payload)
    },
    leftIndBtn: function () {
      if (this.level !== 1) {
        const payload = {
          'itemId': this.itemId
          }
          this.$store.commit('INDENT_ITEM_LEFT', payload)
          } else {
            alert('The item is on the highest level already!')
          }
    },
    rightIndBtn: function () {
      if (this.level === 6) {
        alert('The item is on the lowest level aleady!')
      } else {
        const payload = {
        'itemId': this.itemId
      }
      this.$store.commit('INDENT_ITEM_RIGHT', payload)
      }
    },
    updateTitle: function (e) {
      if (this.editable) {
        const payload = {
          'itemId': this.itemId,
          'title' : e.target.innerText
        }
        this.$store.commit('SET_TITLE', payload)
      }
    },
    updateDescription: function (e) {
      if (this.editable) {
        const payload = {
          'itemId': this.itemId,
          'description' : e.target.innerText
        }
        this.$store.commit('SET_DESCRIPTION', payload)
      }
    },
    onAdd: function (evt) {
        const payload = {
          'itemId' : evt.item.__draggable_context.element
        }
        this.$store.commit('RESTORE_ITEM', payload)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ghost {
  border: 1px dashed grey;
  font-size: 0;
  overflow: hidden;
}
</style>
