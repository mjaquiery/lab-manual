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
    function templateOptionToString(id) {
      // Get selected option object
      let obj = flat.filter(o => o.id === id)[0]
      
      // Handle strings
      if (typeof obj.content === 'string') {
        return obj.content
      }
  
      let str = obj.content.text
  
      // Check if the templateOption is nested
      if (obj.content.templateOptions instanceof Array) {
        // Get and split text
        // let splitted = obj.content.text.split(/\\([0-9])+/g)
        // Iterate over templateOptions
        
        let matches = str.matchAll(/\\([0-9]+)/g)
        for (let match of matches) {
          let i = parseInt(match[1]) - 1
          let templateOptions = obj.content.templateOptions[i]
          let selectedOptionId = templateOptions[obj.content['options-selected'][i]]
          let tmp = templateOptionToString(selectedOptionId)
          str = str.replace(match[0], tmp)
        }
      }
  
      return str
    }
  
    // Wrapper to contsruct markdown text based on items
    function render(itemContents, level) {
      level = level + 1
      itemContents.forEach(c => {
        // Get item (deleted item ids will not be included anyway)
        let itemObj = flat.filter(o => c === o.id)[0]
        // Add title
        body.push(`${'#'.repeat(level)} ${itemObj.content.title}`)
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
            let optionText = templateOptionToString(optionObj.id)
            body.push(`${optionText}`)
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

  function download(href, filename) {
    const link = document.createElement('a')
    link.href = href
    link.download = filename
    link.click()
    }

  export {
    toFlat,
    toNested,
    toMarkdown,
    download
  }