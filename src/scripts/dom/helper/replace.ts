// @ts-nocheck

/**
 * Replaces the content of selector with node
 * @param {string} selector 
 * @param {setup.DOM.Node} node 
 */
setup.DOM.Helper.replace = function(selector, node) {
  $(selector).empty()
  if (node) {
    $(selector).append(setup.DOM.toDOM(node))
  }
}
