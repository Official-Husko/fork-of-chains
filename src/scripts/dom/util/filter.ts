// @ts-nocheck

/**
 * Returns filter toolbar on a menu.
 * Do not use directly! Instead, use:
 * <<filterall 'unit' unitlist unitdisplay>>
 */

/**
 * @param {string} menu 
 * @param {Object[]} objects
 * @returns {setup.DOM.Node}
 */
function filterToolbarInternal(menu, objects) {
  if (!(menu in setup.MenuFilter._MENUS)) {
    throw new Error(`menu ${menu} not found`)
  }

  const toolbar_items = State.variables.menufilter.getMenuFilterToolbarRender(menu, objects)

  return setup.DOM.create('div', { class: 'menu toolbar' }, setup.DOM.Util.menuItemToolbar(toolbar_items))
}

/**
 * @typedef FilterAllArgs
 * @property {string} menu
 * @property {Object[]} filter_objects
 * @property {Function} display_callback
 * @property {Object[]} [display_objects]
 * @property {string} [style_override]
 * 
 * @param {FilterAllArgs} args
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.filterAll = function ({ menu, filter_objects, display_objects, display_callback, style_override }) {
  const fragments = []

  const filter_callback = State.variables.menufilter.getFilterFunc(menu, filter_objects)

  if (State.variables.fort.player.isHasBuilding('greathall')) {
    let toolbarclass = ''
    if (State.variables.menufilter.getOption(menu, 'sticky')) {
      toolbarclass = 'tagtoolbarsticky'
    } else {
      toolbarclass = ''
    }

    fragments.push(setup.DOM.create('div', { class: toolbarclass }, setup.DOM.createRefreshable(
      'div', { class: 'filtertoolbar' }, () => {
        return filterToolbarInternal(menu, filter_objects)
      }
    )))
  }

  const display_fragments = []
  const display_objects_parsed = display_objects || filter_objects
  for (let i = 0; i < filter_objects.length; ++i) {
    const filter_object = filter_objects[i]
    const display_object = display_objects_parsed[i]
    try {
      display_fragments.push(html`
        <div data-filter-key="${filter_object.key}">
          ${display_callback(display_object)}
        </div>
      `)
    } catch (ex) {
      display_fragments.push(setup.DOM.Util.exception(ex))
    }
  }

  let style = "display: flex; flex-direction: column; "
  if (style_override) style = style_override
  fragments.push(
    setup.DOM.Util.filterable('div', filter_callback, { class: 'filtercontainer' }, setup.DOM.create(
      'div',
      { style: style },
      display_fragments,
    ))
  )

  fragments.push(html`
    <div class='lightgraytext filterwidgethidden${menu}'>
    </div>
  `)

  return setup.DOM.create('div', {}, fragments)
}
