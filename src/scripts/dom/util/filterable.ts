// @ts-nocheck

/**
 * Macro that allows filtering child html elements based on a filter function
 * 
 * It will toggle visibility on elements inside it that have
 * a "data-filter-key" html attribute set, by calling the "check function" which
 * will return the set of visible keys, and in which order they should be displayed
 * 
 * 
 * Example usage:
 *  
 *   <<set check_function = () => all_keys.filter(key => key.includes(_some_filter_string))>>
 * 
 *   <<filterable check_function 'my_filterable_id'>>
 *     ...
 *     <div data-filter-key="key_that_identifies_this_item">
 *      ...
 *     </div>
 *     ...
 *   <</filterable>>
 * 
 
 *   // To refresh the view then:
 *   <<filterable-refresh '#my_filterable_id'>>
 * 
 *     (or instead of #id, any path supported by setup.querySelectorRelative)
 * 
 */ 

 
 /**
  * (internal)
  * @param {HTMLElement} container
  * @param {() => string[]} callback
  */
function updateFilterable(container, callback) {
  const filtered_keys = callback().map(a => a.toString())

  const elements = container.querySelectorAll("[data-filter-key]")
  let shown = 0
  for (const element of elements) {
    const key = element.getAttribute("data-filter-key")

    const index = filtered_keys.indexOf(key.toString())

    const $element = $(element)
    if (index !== -1) {
      $element.show()
      $element.css("order", String(index))
      shown += 1
    } else {
      $element.hide()
    }
  }
}


/**
 * @param {string} container   'div'
 * @param {Function} callback   return list of keys, after filter
 * @param {Object<string, string>} attrs   {class: xxx}
 * @param {setup.DOM.Node} children     'content'
 */
setup.DOM.Util.filterable = function(container, callback, attrs, children) {
  const $elem = $(setup.DOM.create(container, attrs || {}, children))
  $elem.addClass("filterable")

  $elem.data("filterable-callback", callback)

  // @ts-ignore
  updateFilterable($elem.get(0), callback)

  return $elem.get(0)
}


/**
 * @param {string} path    (e.g., #containerid )
 */
setup.DOM.Util.filterableRefresh = function(path) {
  const $target = $(path)
  $target.each((_, element) => {
    const $element = $(element)
    const callback = $element.data("filterable-callback")
    if (callback) {
      // @ts-ignore
      updateFilterable(element, callback)
    }
  })

}
