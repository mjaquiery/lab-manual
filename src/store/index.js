import { createStore } from 'vuex'
import axios from 'axios'

const state = {
  flat: [],
  nested: [],
  bin: [],
  // template: [],
  errorLoadingTemplate: false,
  loadingTemplate: true
}

const mutations = {
  // Set chosen template
  // LOAD_TEMPLATE: (state, template) => {
  //   state.template = template
  // },
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
  }
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
      commit('TO_FLAT', res.data)
    })
    .catch(error => {
      console.log(error)
      commit('ERROR_ON_LOAD')
    }).
    finally(() => commit('SET_LOADING', false))
  }
}

const modules = {

}

const getters = {
  getContentById: (state) => (id) => {
    return state.flat.filter(o => o.id === id).map(o => o.content)[0]
  },
  getRootObj: (state) => {
    return state.flat.at(-1)
  },
  // Get the selected objects id
  getSelectedId: (state) => (id) => {
    // Get item.content object by id
    const objects = state.flat.filter(o => o.id === id).map(o => o.content)[0]
    // TODO: Add options-selected to flatten?
    return objects['options-selected']
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
