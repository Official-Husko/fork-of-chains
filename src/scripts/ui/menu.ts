// @ts-nocheck

/**
 * Helper function to generate the DOM structure for a menu
 * using the CSS classes at "menu.css"
 * 
 * @typedef {object} MenuItemArgsMinusText
 * @property {() => unknown} [MenuItemArgs.callback] Callback executed when item is clicked
 * @property {string} [MenuItemArgs.cssclass] Additional CSS class(es) to add to this menu item
 * @property {boolean} [MenuItemArgs.checked] If not undefined, will render a checkbox, checked or unchecked depending on the truthiness of the value 
 * @property {boolean} [MenuItemArgs.clickonly] If true, will open on click instead of on hover
 * @property {JQuery<HTMLElement, HTMLElement>[] | (() => JQuery<HTMLElement, HTMLElement>[])} [MenuItemArgs.children]
 * 
 * @typedef {object} MenuItemArgs
 * @property {string | setup.DOM.Node} MenuItemArgs.text Text label for the item
 * @property {() => unknown} [MenuItemArgs.callback] Callback executed when item is clicked
 * @property {string} [MenuItemArgs.cssclass] Additional CSS class(es) to add to this menu item
 * @property {boolean} [MenuItemArgs.checked] If not undefined, will render a checkbox, checked or unchecked depending on the truthiness of the value 
 * @property {boolean} [MenuItemArgs.clickonly] If true, will open on click instead of on hover
 * @property {JQuery<HTMLElement, HTMLElement>[] | (() => JQuery<HTMLElement, HTMLElement>[])} [MenuItemArgs.children]
 * @property {string} [tooltip]
 * @property {boolean} [is_no_close]
 * 
 * @param {MenuItemArgs} args
 * @returns {JQLite}
 */
export function menuItem({ text, cssclass, checked, clickonly, callback, children, tooltip, is_no_close }) {
  let checked_html = ''
  if (checked != undefined) {
    if (checked)
      checked_html = '<i class="sfa sfa-check"></i> '
    else
      checked_html = '<i class="sfa sfa-check-empty"></i> '
  }

  let is_open = false

  const tooltip_text = tooltip ? `data-tooltip="${setup.escapeHtml(tooltip)}"` : ''

  let wrapper = $(document.createElement('span'))
  if (typeof text === 'string') {
    wrapper.wiki(setup.DevToolHelper.stripNewLine(text))
  } else {
    wrapper.get(0).append(text)
  }

  const menuitem = $(`<div><span ${tooltip_text} class='menu-span'>${checked_html}${wrapper.html()}</span></div>`)
  menuitem.on('mouseenter', function (ev) {
    if (is_open)
      return

    // @ts-ignore
    if (this._generatemenuitems) { // dynamically generate children
      const $container = $(this.lastElementChild)
      $container.empty()
      // @ts-ignore
      const menuitems = this._generatemenuitems()
      for (const child of menuitems)
        child.appendTo($container)
    }

    const nav = this.children[1]
    if (nav instanceof HTMLElement) {
      // if submenu would overflow the window right border, open it to the left
      const div_bounds = menuitem.get(0).getBoundingClientRect()
      const nav_bounds = nav.getBoundingClientRect()
      if (div_bounds.right + nav_bounds.width > 0.95 * window.innerWidth)
        menuitem.addClass("menu-left")
      else
        menuitem.removeClass("menu-left")

      // if menu was closed (an item was clicked, reopen it)
      if (!clickonly && nav.style.display)
        nav.style.display = ''
    }
  })

  if (clickonly)
    menuitem.addClass("menu-clickonly")

  if (cssclass)
    menuitem.addClass(cssclass)

  if (children) {
    const container = $(`<nav></nav>`)
    if (children instanceof Function) {
      // @ts-ignore
      menuitem.get(0)._generatemenuitems = children
      container.appendTo(menuitem)
    } else if (children.length) {
      for (const child of children)
        child.appendTo(container)
      container.appendTo(menuitem)
    }
  }

  const $span = menuitem.children().first()

  $span.on("mousedown", (ev) => { // prevent from gaining focus
    ev.preventDefault()
  })

  $span.on("click", (ev) => {
    ev.preventDefault()

    if (clickonly) {
      if (is_open) // the $(window).one("click", ...) will handle the click
        return

      const parent = ev.target.closest(".menu-clickonly")
      const nav = parent && parent.children[1]
      if (nav instanceof HTMLElement) {
        nav.style.display = 'block'
        is_open = true
        setTimeout(function () {
          $(window).one("click", function (ev) {
            nav.style.display = ''
            is_open = false
          })
        }, 1)
      }
    }

    if (callback) {
      if (!is_no_close) {
        // force-close the menu
        let elem = ev.target
        while (elem.parentElement) {
          if (elem.parentElement.classList.contains('menu')) {
            // @ts-ignore
            elem.lastElementChild.style.display = 'none'
            break
          }
          elem = elem.parentElement
        }
      }

      callback()
    }
  })
  return menuitem
}


/**
 * @param {MenuItemArgs} args
 * @returns {JQLite}
 */
export function menuItemTitle(args) {
  args['cssclass'] = 'submenu-filter-title'
  return menuItem(args)
}


/**
 * @param {MenuItemArgs} args
 * @returns {JQLite}
 */
export function menuItemText(args) {
  args['cssclass'] = 'submenu-filter-text'
  return menuItem(args)
}


/**
 * @param {MenuItemArgs} args
 * @returns {JQLite}
 */
export function menuItemDanger(args) {
  args['cssclass'] = 'submenu-danger'
  return menuItem(args)
}


/**
 * @param {MenuItemArgs} args
 * @returns {JQLite}
 */
export function menuItemAction(args) {
  args['cssclass'] = 'submenu-action'
  return menuItem(args)
}


/**
 * @param {MenuItemArgsMinusText} args
 * @returns {JQLite}
 */
export function menuItemExtras(args) {
  args.clickonly = true
  args['text'] = '<i class="sfa sfa-ellipsis-vert"></i>'
  // @ts-ignore
  return menuItem(args)
}

