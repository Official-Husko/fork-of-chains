/**
 * Spawns the filter toolbar for a given menu.
 * Only one toolbar is allowed at any given page. Otherwise strange things may happen.
 * Do not use directly! Instead, use:
 * setup.DOM.Util.filterAll
 */

Macro.add('filtertoolbarinternal', {
  handler() {
    // sanity checks:
    if (!this.args.length)
      return this.error('no menu specified for toolbar')

    const menu = this.args[0]
    if (!(menu in setup.MenuFilter._MENUS)) {
      return this.error(`menu ${menu} not found`)
    }

    const $wrapper = $(`<div class="menu toolbar"></div>`)

    const toolbar_items = State.variables.menufilter.getMenuFilterToolbarRender(menu, this.args[1])
    for (const toolbaritem of toolbar_items) {
      toolbaritem.appendTo($wrapper)
    }

    $wrapper.appendTo(this.output)
  }
})


/**
 * Parses a sequence of menuItems into the document.
 */
Macro.add('displaymenuitem', {
  handler() {
    // sanity checks:
    if (!this.args.length)
      return this.error('no menu item specified for displaymenuitem')

    const $wrapper = $(`<div class="menu toolbar"></div>`)

    for (const menuitem of this.args[0]) {
      menuitem.appendTo($wrapper)
    }

    $wrapper.appendTo(this.output)
  }
})



