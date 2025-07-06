// @ts-nocheck

 /**
  * Converts a menu item into a toolbar node
  * 
  * @param {Array} menu_items
  * 
  * @returns {setup.DOM.Node}
  */
setup.DOM.Util.menuItemToolbar = function(menu_items) {
  return setup.DOM.create(
    'div',
    {class: 'menu toolbar'},
    menu_items.map(menu_item => menu_item.get(0)),
  )
}
