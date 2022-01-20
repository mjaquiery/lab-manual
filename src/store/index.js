import { createStore } from 'vuex'
import axios from 'axios'

const state = {
  flat: [],
  markdown: [],
  nested: [],
  // template: [],
  errorLoadingTemplate: false,
  loadingTemplate: true
}

const mutations = {
  // Set chosen template
  // LOAD_TEMPLATE: (state, template) => {
  //   state.template = template
  // },
  TO_MARKDOWN: (state, flat) => {
    state.markdown = toMarkdown(flat).join('<br>')
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
    const content = state.flat[itemIndex]
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
  }
  // // Update bin item order
  // UPDATE_BIN_ITEM_ORDER: (state, payload) => {
  //   state.bin = [...state.bin, ...payload.itemIds]
  // }
}

const actions = {
  // Read chosen template
  getTemplate({commit}) {
    axios.get('example.json')
    // .then(res => {
    //   commit('LOAD_TEMPLATE', res.data)
    //   return res
    // })
    .then(res => {
      // Normalize nested structure
      commit('TO_FLAT', res.data)
      //Add default select options
      commit('ADD_OPTION_SELECTED_PROP')
      // Add deleted default
      commit('ADD_DELETED_PROP')
    })
    .catch(error => {
      console.log(error)
      commit('ERROR_ON_LOAD')
    })
    .finally(() => commit('SET_LOADING', false))
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
  }
}

export default createStore({
  state,
  mutations,
  actions,
  modules,
  getters
})

/**
 * Flatten an individual object and replace its child objects with references to whole objects.
 * @param obj {Object} Object to parse
 * @param flatList {Object[]} Index for use as object identifier
 * @return {Object[]} List of parent object and its children flattened into a list
 */
function toFlat(obj, flatList = []) {

  if(obj instanceof Object && obj !== null) {
    const nestFields = ["contents", "options", "templateOptions"]
    nestFields.forEach(f => {
      if(obj[f] instanceof Array) {
        // templateOptions is a list of lists
        if(f === "templateOptions")
          obj[f].forEach((t, it) => t.forEach((c, ic) => {
            flatList = toFlat(c, flatList)
            obj[f][it][ic] = flatList.length - 1
          }))
        else
          obj[f].forEach((c, i) => {
            // Add the child to the flattened list
            flatList = toFlat(c, flatList)
            // Replace child in the parent with its index in flattened list
            obj[f][i] = flatList.length - 1
          })
      }
    });
  }

  flatList.push({ id: flatList.length, content: obj })
  return flatList
}

/**
 * Convert a flattened tree object back into its nested form.
 * @param flat {Object[]} Array of objects with children replaced with their ids.
 * @return {Object}
 */
function toNested(flat) {
  const nestFields = ["contents", "options", "templateOptions"]

  flat.forEach(c => {
    c = c.content
    if(c instanceof Object) {
      nestFields.forEach(f => {
        if(c[f] instanceof Array) {
          // Replace child ids with children
          if(f === "templateOptions") {
            c[f] = c[f].map(t => t.map(e => {
              const value = flat.filter(x => x.id === e)
              flat = flat.filter(x => x.id !== e)
              return value[0].content
            }))
          } else {
            c[f] = c[f].map(e => {
              const value = flat.filter(x => x.id === e)
              flat = flat.filter(x => x.id !== e)
              return value[0].content
            })
          }
        }
      })
    }
  })

  return flat[0].content
}

// Create markdown output 
function toMarkdown(flat) {
  // Get root obj
  const rootObj = flat.filter(o => Object.keys(o.content).includes('metadata'))[0]

  // Array for storing the content of the markdown text
  let body = []
  
  // As templateOptions can be nested we get the final text
  // for the selected option iteratively to an array (out)
  function getTemplateOptionText(id, out = []) {
    // Get selected option object
    let obj = flat.filter(o => o.id === id)[0]

    // Check if the templateOption is nested
    if (obj.content.templateOptions instanceof Array) {
      // Get and split text
      // let splitted = obj.content.text.split(/\\([0-9])+/g)
      // Iterate over templateOptions
      let matches = obj.content.text.matchAll(/\\([0-9]+)/g)
      let contents = []
      for (let match of matches) {
        let i = parseInt(match[1]) - 1
        let templateOptions = obj.content.templateOptions[i]
        let selectedOptionId = templateOptions[obj.content['options-selected'][i]]
        // optionsObject.push({match, i, templateOptions})
        getTemplateOptionText(selectedOptionId, contents)
        // TODO not good because it overwrites the original value
        obj.content.text = obj.content.text.replace(match[0], contents[i])
      }
    }

    // Handle strings
    if (typeof obj.content === 'string') {
      out.push(obj.content)
    } else {
      out.push(obj.content.text)
    }
    
    return out
  }

  // Wrapper to contsruct markdown text based on items
  function render(itemContents, level) {
    level = level + 1
    itemContents.forEach(c => {
      // Get item (deleted item ids will not be included anyway)
      let itemObj = flat.filter(o => c === o.id)[0]
      // Add title
      body.push(`${'#'.repeat(level)}${itemObj.content.title}`)
      // Add description
      body.push(`_${itemObj.content.description}_`)
      // Add selected option
      if (itemObj.content['options-selected'] !== undefined && itemObj.content['options-selected'] !== -1) {
        // Get selected option id
        let optionId = itemObj.content.options[itemObj.content['options-selected']]
        // Get text
        let optionObj = flat.filter(o => o.id === optionId)[0]
        // Add templateOptions if there is any
        if (optionObj.content.templateOptions instanceof Array) {
          let optionText = getTemplateOptionText(optionObj.id)
          body.push(`${optionText[0]}`)
        // Handle if option is just a string
        } else if (typeof optionObj.content === 'string') {
          let optionText = optionObj.content
          body.push(`${optionText}`)
        // If option is a templateString
        } else {
          let optionText = optionObj.content.text
          body.push(`${optionText}`)
        }
      }
      // Add other nested items if there is any
      if (itemObj.content.contents instanceof Array && Object.values(itemObj.content.contents).length !== 0) {
        render(Object.values(itemObj.content.contents), level)
      }
    })
}

// Start render from the root
render(rootObj.content.contents, 0)
return body
}
