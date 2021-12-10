import { createStore } from 'vuex'

const state = {
  toFlat: template => toFlat(template),
  toNested: template => toNested(template)
}

const mutations = {

}

const actions = {

}

const modules = {

}

export default createStore({
  state,
  mutations,
  actions,
  modules
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
