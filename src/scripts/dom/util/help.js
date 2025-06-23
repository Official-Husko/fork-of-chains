 /**
  * Shows a link for help text
  * 
  * @param {setup.DOM.Attachable | Function} children
  * 
  * @returns {setup.DOM.Node}
  */
setup.DOM.Util.help = function(children) {
  return setup.DOM.Util.message('(?)', () => {
    let children_parsed
    if (children instanceof Function) {
      children_parsed = children()
    } else {
      children_parsed = children
    }
    return setup.DOM.create('div', {class: 'helpcard'}, children_parsed)
  })
}
