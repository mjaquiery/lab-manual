import { createStore } from 'vuex'
import axios from 'axios'
// Import utility functions
import {toFlat, toNested, toMarkdown} from '@/utils.js'

const state = {
  flat: [],
  markdown: [],
  nested: [],
  output: [],
  templateList: [],
  // template: [],
  errorLoadingTemplate: false,
  loadingTemplate: true,
  pandoc_api_url: "https://pandoc-rest-api.herokuapp.com"
}

const mutations = {
  // Set chosen template
  // LOAD_TEMPLATE: (state, template) => {
  //   state.template = template
  // },
  LOAD_TEMPLATELIST: (state, templateList) => {
    state.templateList = templateList
  },
  OUTPUT: (state) => {
    state.output = state.output.push('html')
  },
  TO_MARKDOWN: (state, flat) => {
    state.markdown = toMarkdown(flat).join('\n\n')
  },
  // Flatten template
  TO_FLAT: (state, template) => {
    state.flat = toFlat(template)
  },
  // Create nested template
  TO_NESTED: (state, template) => {
    state.nested = toNested(template)
  },
  // Add error on load
  ERROR_ON_LOAD: (state) => {
    state.errorLoadingTemplate = true
  },
  // Set waiter for loading
  SET_LOADING: (state, value) => {
    state.loadingTemplate = value
  },
  // Set selected value
  // Receives selected id as input
  SET_SELECTED: (state, payload) => {
    const content = state.flat[payload.itemId].content
    // const optionId = state.flat[payload.itemId].content.options[payload.optionIndex]
    state.flat[payload.itemId].content = {...content, 'options-selected': payload.optionIndex}
  },
  // Set selected for templateOptions
  SET_TEMPLATEOPTIONS_SELECTED: (state, payload) => {
    // Get parent obj
    let parentObj = state.flat.filter(o => o.content.templateOptions !== undefined && o.content.templateOptions.includes(payload.optionId))[0]
    // Get the index of the parent obj
    const parentObjIndex = state.flat.findIndex(o => o.id === parentObj.id)
    // Get the option index
    const optionIndex = parentObj.content.templateOptions.findIndex(a => a === payload.optionId)
    // Change to new value
    parentObj.content['options-selected'][optionIndex] = payload.optionIndex
    state.flat[parentObjIndex] = {...parentObj}
  },
  // Change title in flat
  SET_TITLE: (state, payload) => {
    const content = state.flat[payload.itemId].content
    state.flat[payload.itemId].content = {...content, 'title': payload.title}
  },
  // Change description in flat
  SET_DESCRIPTION: (state, payload) => {
    const content = state.flat[payload.itemId].content
    state.flat[payload.itemId].content = {...content, 'description': payload.description}
  },
  SET_PANDOC_STATUS: (state, {format, status}) => {
    state.pandoc_api_formats.find(f => f.name === format).status = status
  },
  // Update manual content order with draggable
  UPDATE_ITEM_ORDER: (state, payload) => {
    const content = state.flat[payload.itemId].content
    state.flat[payload.itemId].content = {...content, 'contents': payload.contents}
  },
  ADD_DELETED_PROP: (state) => {
    state.flat = state.flat.map(o => {
      if (o.content.title !== undefined) {
        return {...o, 'deleted': false}
      } else {
        return {...o}
      }
    })
  },
  // Add option-selected prop to items and templateStrings and templateOptions
  // As templateOptions can be a lists of list options-selected can be an array
  // of the same length as the number of lists are in template options
  ADD_OPTION_SELECTED_PROP: (state) => {
    // TODO: check of it is there already?
    state.flat = state.flat.map(o => {
      // For options in items
      if (o.content.title !== undefined) {
        return {...o, 'content': {...o.content, 'options-selected': -1}}
        // For options in templateOptions
      } else if (o.content.templateOptions !== undefined) {
        // Check the number of lists in list
        const nList = o.content.templateOptions.length
        const optionsSelected = Array(nList).fill(-1)
        return {...o, 'content': {...o.content, 'options-selected': optionsSelected}}
      } else {
        return {...o}
      }
    })
  },
  // Add component options after read
  // These options are only used within the app and should
  // not be exported
  ADD_COMPONENT_OPTIONS: (state) => {
    state.flat = state.flat.map(o => {
      // For items and root obj
      if (o.content.title !== undefined || Object.keys(o.content).includes('metadata')) {
        return {...o,
          'component-options': {
            'expanded': false,
            'editable': false,
            'showAddOption': false,
            'showAddItem': false
          }
        }
      } else {
        return {...o}
      }
    })
  },
  // The mutation sets the deleted property for the item and all of its children items
  DELETE_ITEM: (state, payload) => {
    const itemIds = []
    function getIds(itemId) {
      const obj = state.flat.filter(o => o.id === itemId)[0]
      itemIds.push(obj.id)
      if (obj.content.contents !== undefined && obj.content.contents.length != 0) {
        obj.content.contents.forEach(id => {
          getIds(id)
        })
      }
    }
    getIds(payload.itemId)

    for (let id of itemIds) {
      let itemIndex = state.flat.findIndex(o => o.id === id)
      let content = state.flat[itemIndex]
      // Nested structure should disappear on delete
      content.content.contents = []
      state.flat[itemIndex] = {...content, 'deleted': true}
    }

    // Lookup parent obj
    // Delete id from parent obj contents as well
    let parentObj = state.flat.filter(a => a.content.contents instanceof Array && a.content.contents.includes(payload.itemId))[0]
    const parentIndex = state.flat.findIndex(o => o.id === parentObj.id)
    parentObj.content.contents = parentObj.content.contents.filter(id => id !== payload.itemId)
    state.flat[parentIndex] = {...parentObj}
  },
  // The mutation changes the deleted property to false of the given item
  RESTORE_ITEM: (state, payload) => {
    const itemIndex = state.flat.findIndex(o => o.id === payload.itemId)
    // Get the content of the restored item
    const content = state.flat[itemIndex]
    // Change deleted property to false
    state.flat[itemIndex] = {...content, 'deleted': false}
  },
  // Add options (templatestring objects) to items (content objects)
  ADD_TEMPLATESTRING: (state, payload) => {
    let itemObj = state.flat.filter(o => o.id === payload.itemId)[0]
    const optionId = state.flat.length
    if (!(itemObj.content.options instanceof Array)) {
      itemObj.content.options = []
    }
    itemObj.content.options.push(optionId)
    const optionObj = {
      'content': {
        'text': payload.optionText,
        'difficulty': -1
      },
      'id': optionId
    }
    state.flat = [...state.flat, optionObj]
  },
  // Add new item
  ADD_ITEM: (state, payload) => {
    // Get parent obj
    let parentObj = state.flat.filter(o => o.id === payload.parentItemId)[0]
    // Check if there is a contents array prop if not create one
    if (!(parentObj.content.contents instanceof Array)) {
      parentObj.content.contents = []
    }
    // Add new id to parent obj contents
    parentObj.content.contents.push(payload.itemId)
    // Create new item obj
    const itemObj = {
      'content': {
        'title': payload.title,
        'description': payload.description,
        'contents': []
      },
      'id': payload.itemId,
      'deleted': false,
      'option-selected': -1
    }
    // Add new item to flat array
    state.flat = [...state.flat, itemObj]
  },
  // Indent left
  INDENT_ITEM_LEFT: (state, payload) => {
    // Get parent obj
    let parentObj = state.flat.filter(a => a.content.contents instanceof Array && a.content.contents.includes(payload.itemId))[0]
    // Delete item id from parent contents
    parentObj.content.contents = parentObj.content.contents.filter(id => id !== payload.itemId)
    // Get parent index
    const parentObjIndex = state.flat.findIndex(o => o.id === parentObj.id)
    //Set new obj
    state.flat[parentObjIndex] = {...parentObj}
    // Get grandparent obj
    let grandParentObj = state.flat.filter(a => a.content.contents instanceof Array && a.content.contents.includes(parentObj.id))[0]
    // Add item id to contents
    if (grandParentObj.content.contents.at(-1) === parentObj.id) {
      grandParentObj.content.contents.push(payload.itemId)
    } else {
      grandParentObj.content.contents.unshift(payload.itemId)
    }
    // Get grandparent obj index
    const grandParentObjIndex = state.flat.findIndex(o => o.id === grandParentObj.id)
    // Set new obj
    state.flat[grandParentObjIndex] = {...grandParentObj}
  },
  // Indent item right
  INDENT_ITEM_RIGHT: (state, payload) => {
    // Get parent obj
    let parentObj = state.flat.filter(a => a.content.contents instanceof Array && a.content.contents.includes(payload.itemId))[0]
    // Get parent index
    const parentObjIndex = state.flat.findIndex(o => o.id === parentObj.id)
    const itemIndex = parentObj.content.contents.findIndex(id => id === payload.itemId)
    if (itemIndex === 0) {
      alert('Item cannot be indented two levels in from the parent item. Please, place it after an item with the same level.')
    } else {
      // Get previous sibling id
      const siblingId = parentObj.content.contents[itemIndex-1]
      // Get sibling index in flat array
      const siblingObjIndex = state.flat.findIndex(o => o.id === payload.siblingId)
      // Get sibling obj
      let siblingObj = state.flat.filter(o => o.id === siblingId)[0]
      // Check if there is a contents array prop if not create one
      if (!(siblingObj.content.contents instanceof Array)) {
        siblingObj.content.contents = []
      }
      // Add item id to sibling obj contents
      siblingObj.content.contents.push(payload.itemId)
      // Update sibling obj in flat array
      state.flat[siblingObjIndex] = {...siblingObj}
      // Remove item id from parent obj
      parentObj.content.contents = parentObj.content.contents.filter(id => id !== payload.itemId)
      // Update parent obj in flat array
      state.flat[parentObjIndex] = {...parentObj}
    }
  },
  // Functions to modify iteem behavior in the app
  // TOOGLE_EXPANDED: (state, payload) => {
  //   let obj = state.flat.filter(o => o.id === payload.itemId)[0]
  //   let editable = obj.content['component-options'].editable
  //   if (!editable) {
  //     obj.content['component-options'].expanded = !obj.content['component-options'].expanded
  //   }
  // },
  CHANGE_COMPONENT_OPTIONS: (state, payload) => {
    let obj = state.flat.filter(o => o.id === payload.itemId)[0]
    obj['component-options'][payload.key] = payload.value
  },

  // // Update bin item order
  // UPDATE_BIN_ITEM_ORDER: (state, payload) => {
  //   state.bin = [...state.bin, ...payload.itemIds]
  // }
}

const actions = {
  // Get the list of templates
  getTemplateList({ commit }) {
    axios.get('https://raw.githubusercontent.com/marton-balazs-kovacs/lab-manual-template/main/templates.json')
      .then(res => {
        commit('LOAD_TEMPLATELIST', res.data)
      })
      .catch(error => {
        console.log(error)
        commit('ERROR_ON_LOAD')
      })
    /* .finally(() => commit('SET_LOADING', false)) */
  },
  // Read chosen template
  getTemplate({ commit }, selectedTemplate) {
    axios.get(selectedTemplate)
      .then(res => {
        // Normalize nested structure
        commit('TO_FLAT', res.data)
        //Add default select options
        commit('ADD_OPTION_SELECTED_PROP')
        // Add deleted default
        commit('ADD_DELETED_PROP')
        // Add default component options
        commit('ADD_COMPONENT_OPTIONS')
        // Set loading to false
        commit('SET_LOADING', false)
      })
      .catch(error => {
        console.log(error)
        commit('ERROR_ON_LOAD')
      })
  },
  addItem({ commit }, payload) {
    commit('ADD_ITEM', payload)
    commit('ADD_COMPONENT_OPTIONS')
  }
}

const modules = {

}

const getters = {
  getContentById: (state, getters) => (id) => {
    // If item is deleted the getter returns null
    const content = getters.getNonDeletedObjs.filter(o => o.id === id).map(o => o.content)[0]
    if (content === undefined) {
      return null
    } else {
      return content
    }
  },
  getRootObj: (state) => {
    // As metadata only exists in the root object the filter should find only one
    // match that is the root obj
    return state.flat.filter(o => Object.keys(o.content).includes('metadata'))[0]
  },
  // Get the selected objects id
  getSelectedId: (state) => (id) => {
    // Get item.content object by id
    const objects = state.flat.filter(o => o.id === id).map(o => o.content)[0]
    // TODO: Add options-selected to flatten?
    return objects['options-selected']
  },
  // Getter returns only non deleted items
  getDeletedItemIds: (state) => {
    return state.flat.filter(o => o.deleted === true).map(o => o.id)
  },
  // Getter returns only deleted items
  getDeletedObjs: (state) => {
    return state.flat.filter(o => 'deleted' in o && o.deleted === true)
  },
  getBinContentById: (state, getters) => (id) => {
    // If item is deleted the getter returns null
    const content = getters.getDeletedObjs.filter(o => o.id === id).map(o => o.content)[0]
    if (content === undefined) {
      return null
    } else {
      return content
    }
  },
  // Getter returns only non deleted items and other objects
  getNonDeletedObjs: (state) => {
    return state.flat.filter(o => !('deleted' in o) || ('deleted' in o && o.deleted === false))
  },
  // Get the new object id for adding an item or templateString
  getNewId: (state) => {
    return state.flat.length
  },
  getSelectedTemplateOption: (state) => (id) => {
    const parentObj = state.flat.filter(o => o.content.templateOptions !== undefined && o.content.templateOptions.includes(id))[0]
    const optionIndex = parentObj.content.templateOptions.findIndex(a => a === id)
    return parentObj.content['options-selected'][optionIndex]
  },
  getComponentOptions: (state) => (id) => {
    // Get item.content object by id
    const obj = state.flat.filter(o => o.id === id)[0]
    // TODO: Add options-selected to flatten?
    return obj['component-options']
  },
  // Get an array of titles for the TOC in order
  getTitles: (state) => {
    // Filter only items with title
    const items = state.flat.filter(i => i.content.title !== undefined)

    // Map titles to an array
    const titles = items.map(i => i.content.title)

    // Return in correct order
    return titles.reverse()
  }
}

export default createStore({
  state,
  mutations,
  actions,
  modules,
  getters
})
