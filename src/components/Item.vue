<template>
  <div :class="['item', `itemlevel-${level}`]" v-if="itemContent !== null">
    <div class="inline-flex flex items-center mb-2">
      <Title :level="level" @click="toggleExpanded" :contenteditable="componentOptions.editable" @blur="updateTitle"
        class="item-title mr-6" :title="titleTooltipLabel"
        :id="itemContent.title">
        {{ itemContent.title }}
      </Title>
      <div class="inline-flex rounded-2xl border-4 border-opacity-20 border-blue-500 p-1">
        <div :title="`Make topic ${!componentOptions.editable ? 'editable': 'non-editable'}`">
          <PencilAltIcon class="icon-btn" @click="toggleEdit" />
        </div>
        <div title="Move topic one level up">
          <ArrowCircleLeftIcon class="icon-btn" @click="leftIndBtn" />
        </div>
        <div title="Move topic one level down">
          <ArrowCircleRightIcon class="icon-btn" @click="rightIndBtn" />
        </div>
        <div title="Discard topic">
          <TrashIcon class="icon-btn" @click="deleteBtn" />
        </div>
      </div>
    </div>
    <p v-if="componentOptions.expanded" :contenteditable="componentOptions.editable" @blur="updateDescription"
      class="item-description mb-2"
      :class="`${itemContent.description == '' ? 'text-gray-400' : ''}`">
      {{ itemContent.description == "" ? 'Add description by editing this text...' : itemContent.description }}
    </p>
    <form v-if="componentOptions.expanded && itemContent.options !== undefined">
      <div v-for="(O, i) in itemContent.options" :key="O">
        <input type="radio" :value="i" v-model="selected" :name="`template-string-selection-${itemId}`" />
        <TemplateString :optionId="O" :optionKey="O" :formKey="itemId" />
      </div>
    </form>
    <div title="Add new option" v-if="componentOptions.expanded & !componentOptions.showAddOption" class="flex flex-row">
      <PlusCircleIcon class="icon-btn mb-2 mt-2" @click="addOption" @mouseover="showAddOptionSkeleton = true" @mouseleave="showAddOptionSkeleton = false" />
      <o-skeleton v-if="componentOptions.expanded && showAddOptionSkeleton && !componentOptions.showAddOption" :animated=true class="mb-2 mt-2 pl-2"></o-skeleton>
    </div>
    <div v-if="componentOptions.expanded && componentOptions.showAddOption">
      <AddTemplateString :itemId="itemId" />
      <div title="Close add option panel">
        <XCircleIcon @click="closeAddOption" class="icon-btn mb-2" />
      </div>
    </div>
    <draggable v-if="itemContent.contents" v-model="itemContents" item-key="id"
      :group='{name: `${level}level`, put: ["bin", `${level}level`]}' ghost-class="ghost" @add="onAdd" handle=".handle">
      <template #item="{element}">
        <div class="flex flex-row">
          <div title="Drag topic to replace order on the same level">
            <ViewListIcon class="handle h-5 w-5 mr-2 hover:cursor-grab" />
          </div>
          <Item :level="level + 1" :itemId="element" />
        </div>
      </template>
    </draggable>
    <div title="Add new topic">
      <PlusCircleIcon class="icon-btn" @click="addItem" v-if="level < 6 & !componentOptions.showAddItem"
        @mouseover="showAddItemSkeleton = true" @mouseleave="showAddItemSkeleton = false" />
    </div>
    <div v-if="showAddItemSkeleton && !componentOptions.showAddItem" class="flex flex-col mt-5">
      <o-skeleton :animated=true class="mb-2 pl-2"></o-skeleton>
      <o-skeleton :animated=true height="5rem" class="pt-2 pl-2"></o-skeleton>
    </div>
    <div v-if="componentOptions.showAddItem">
      <AddItem :parentItemId="itemId" />
      <div title="Close add topic panel">
        <XCircleIcon @click="closeAddItem" class="icon-btn" />
      </div>
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
import { PencilAltIcon, ArrowCircleRightIcon, ArrowCircleLeftIcon, PlusCircleIcon, TrashIcon, ViewListIcon, XCircleIcon } from '@heroicons/vue/solid'

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
    ViewListIcon,
    XCircleIcon
  },
  props: {
    itemId: {type: Number, default: null},
    level: {type: Number, default: 1}
  },
  data: function() {
    return {
      showAddItemSkeleton: false,
      showAddOptionSkeleton: false
    }
  },
  computed: {
    ...mapGetters(['getContentById', 'getSelectedId', 'getComponentOptions']),
    // Label for title tooltip
    titleTooltipLabel: function () {
      if(this.componentOptions.editable) {
        return 'Click to edit the title of the topic'
      } else {
        return `Click to ${!this.componentOptions.expanded ? 'expand': 'condense'} the topic`
      }
    },
    // Component options are stored in vuex instead of
    // the data prop
    componentOptions: function () {
      return this.getComponentOptions(this.itemId)
    },
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
  methods: {
    toggleExpanded: function () {
      let value = this.componentOptions.expanded
      if (!this.componentOptions.editable) {
        value = !value
      }
      const payload = {
        'itemId': this.itemId,
        'key' : 'expanded',
        'value': value
      }
    this.$store.commit('CHANGE_COMPONENT_OPTIONS', payload)
    },
    addOption: function () {
      const payload = {
        'itemId': this.itemId,
        'key' : 'showAddOption',
        'value': true
      }
      this.$store.commit('CHANGE_COMPONENT_OPTIONS', payload)
    },
    closeAddOption: function () {
      this.showAddOptionSkeleton = false

      const payload = {
        'itemId': this.itemId,
        'key' : 'showAddOption',
        'value': false
      }
    this.$store.commit('CHANGE_COMPONENT_OPTIONS', payload)
    },
    addItem: function () {
      const payload = {
        'itemId': this.itemId,
        'key' : 'showAddItem',
        'value': true
      }
      this.$store.commit('CHANGE_COMPONENT_OPTIONS', payload)
      this.showAddItem = true
    },
    closeAddItem: function () {
      this.showAddItemSkeleton = false

      const payload = {
        'itemId': this.itemId,
        'key' : 'showAddItem',
        'value': false
      }
      this.$store.commit('CHANGE_COMPONENT_OPTIONS', payload)
      this.showAddItem = false
    },
    toggleEdit: function () {
      let value = this.componentOptions.editable
      value = !value
      const payload = {
        'itemId': this.itemId,
        'key' : 'editable',
        'value': value
      }
    this.$store.commit('CHANGE_COMPONENT_OPTIONS', payload)
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
      if (this.componentOptions) {
        const payload = {
          'itemId': this.itemId,
          'title' : e.target.innerText
        }
        this.$store.commit('SET_TITLE', payload)
      }
    },
    updateDescription: function (e) {
      if (this.componentOptions) {
        const payload = {
          'itemId': this.itemId,
          'description' : e.target.innerText
        }
        this.$store.commit('SET_DESCRIPTION', payload)
      }
    },
    onAdd: function (evt) {
      const payload = {
        // Get the itemindex of the moved element
        'itemId' : evt.item.__draggable_context.element
      }
      // Get the element id of the start list
      const fromId = evt.from.id   
      // Use restore item if element is dragged from bin list to main
      if(fromId == "binList") {
        this.$store.commit('RESTORE_ITEM', payload)
      }
    }
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
