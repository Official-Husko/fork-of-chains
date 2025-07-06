// @ts-nocheck

import { menuItem, menuItemAction, menuItemText, menuItemTitle } from "../../ui/menu"

export function down(text) {
  return `${text} <i class="sfa sfa-down-big"></i>`
}

export function up(text) {
  return `${text} <i class="sfa sfa-up-big"></i>`
}

/**
 * @param {string} menu 
 * @param {string} key 
 * @param {*} value 
 * @param {boolean} [hardreload]
 * @param {Function} [extra_callback]
 * @returns 
 */
export function getCallback(menu, key, value, hardreload, extra_callback) {
  return () => {
    State.variables.menufilter.set(menu, key, value)

    if (hardreload) {
      setup.runSugarCubeCommand('<<focgoto>>')
    } else {
      setup.DOM.refresh('.filtertoolbar')
      setup.DOM.Util.filterableRefresh('.filtercontainer')
      setup.runSugarCubeCommand('<<refreshable-refresh "#filtertoolbar">>')
      setup.runSugarCubeCommand('<<filterable-refresh "#filtercontainer">>')
    }

    if (extra_callback) extra_callback()
  }
}

/**
 * 
 * @param {string} menu 
 * @param {string} option 
 * @param {*} current_value 
 */
function optionCallback(menu, option, current_value) {
  return () => {
    if (current_value) {
      State.variables.menufilter.setOption(menu, option, /* value = */ null)
    } else {
      State.variables.menufilter.setOption(menu, option, /* value = */ true)
    }
    setup.runSugarCubeCommand('<<focgoto>>')
  }
}

/**
 * Assigned to $menufilter.
 * Stores filter information about various menus.
 * @extends setup.TwineClass
 */
setup.MenuFilter = class MenuFilter extends setup.TwineClass {
  constructor() {
    super()

    /**
     * {menu: {name: value}}
     * @type {Object.<string, Object.<string, any>>}
     */
    this.filters = {}

    /**
     * Filter options for this, e.g., stickied, hidden, etc.
     * @type {Object.<string, Object.<string, any>>}
     */
    this.filter_option = {}
  }

  static OPTIONS = {
    sticky: {
      title: 'Sticky',
      reverse: true,
    },
    hidden: {
      title: 'Hidden',
    },
  }

  /**
   * @param {string} menu 
   * @param {string} option_key 
   * @param {any} option_value 
   */
  setOption(menu, option_key, option_value) {
    if (!(option_key in setup.MenuFilter.OPTIONS)) throw new Error(`Unrecognized option: ${option_key}`)

    const option_obj = setup.MenuFilter.OPTIONS[option_key]
    if (option_obj.reverse) option_value = !option_value

    if (!(menu in this.filter_option)) {
      this.filter_option[menu] = {}
    }
    this.filter_option[menu][option_key] = option_value
  }

  /**
   * @param {string} menu 
   * @param {string} option_key 
   * @returns {any}
   */
  getOption(menu, option_key) {
    if (!(option_key in setup.MenuFilter.OPTIONS)) throw new Error(`Unrecognized option: ${option_key}`)

    let value = null
    if ((menu in this.filter_option)) {
      value = this.filter_option[menu][option_key]
    }

    const option_obj = setup.MenuFilter.OPTIONS[option_key]
    if (option_obj.reverse) {
      return !value
    } else {
      return value
    }
  }

  /**
   * Ensures that the given menu, key is in the filters object
   * @param {string} menu 
   * @param {string} key 
   */
  _checkSet(menu, key) {
    const all_menus = setup.MenuFilter._MENUS
    if (!(menu in all_menus)) throw new Error(`${menu} menu not found in filters`)
    if (key && !(key in all_menus[menu])) throw new Error(`key ${key} not found in filter menu ${menu}`)

    if (!(menu in this.filters)) {
      this.filters[menu] = {}
    }
    if (!(key in this.filters[menu])) {
      this.filters[menu][key] = null
    }
  }

  /**
   * Sets a filter value
   * @param {string} menu 
   * @param {string} key 
   * @param {any} value 
   * @param {boolean=} no_reset
   */
  set(menu, key, value, no_reset) {
    this._checkSet(menu, key)
    this.filters[menu][key] = value

    // If there are other filters that needs to be reset, reset them.
    if (!no_reset && value) {
      const menu_parsed = setup.MenuFilter.getMenus()
      const menu_obj = menu_parsed[menu][key]
      for (const to_reset of menu_obj.resets || []) {
        this.set(menu, to_reset, /* value = */ null, /* no reset = */ true)
      }
    }
  }

  /**
   * Gets a filter value
   * @param {string} menu 
   * @param {string} key 
   * @returns {any}
   */
  get(menu, key) {
    this._checkSet(menu, key)
    return this.filters[menu][key]
  }

  /**
   * Render a single filter menu (standard)
   * @param {object} menu_parsed 
   * @param {string} menu 
   * @param {string} key 
   * @param {Function} [extra_callback]
   * @returns {JQLite}
   */
  getMenuFilterToolbarSingleMenu(menu_parsed, menu, key, extra_callback) {
    const menu_obj = menu_parsed[menu][key]
    const current_value = this.get(menu, key)
    let text = menu_obj.title
    let options = menu_obj.options

    if (current_value) {
      text = options[current_value].title
      text = `<span class="lightgraytext">${text}</span>`
    }
    text = `${text} <i class="sfa sfa-down-dir"></i>`

    const children = [
      menuItem({
        text: menu_obj.default,
        checked: !current_value,
        callback: getCallback(menu, key, /* value = */ null, menu_obj.hardreload, extra_callback),
      })
    ]

    for (const value in options) {
      const children_obj = options[value]
      children.push(
        menuItem({
          text: children_obj.title,
          checked: (value == current_value),
          callback: getCallback(menu, key, value, menu_obj.hardreload, extra_callback),
        })
      )
    }

    return menuItem({
      text: text,
      children: children,
      clickonly: true,
    })
  }

  /**
   * Render a single filter menu (trait menu)
   * @param {object} menu_parsed 
   * @param {string} menu 
   * @param {string} key 
   * @param {setup.Unit[]} units
   */
  getMenuFilterToolbarTraits(menu_parsed, menu, key, units) {
    const menu_obj = menu_parsed[menu][key]

    const current_traits = (this.get(menu, key) || []).map(trait_key => setup.trait[trait_key])

    let text
    if (current_traits.length) {
      text = current_traits.map(trait => trait.rep())
    } else {
      text = menu_obj.title
    }

    text = `${text} <i class="sfa sfa-down-dir"></i>`

    // compute choice traits
    const trait_map = {}
    for (const unit of units) {
      for (const trait of unit.getTraits()) {
        trait_map[trait.key] = true
      }
    }

    const trait_choices = Object.keys(trait_map).map(trait_key => setup.trait[trait_key])
    trait_choices.sort(setup.Trait_Cmp)

    return menuItem({
      text: text,
      callback: () => {
        setup.DevToolHelper.pickTraits(trait_choices, current_traits).then(traits => {
          getCallback(menu, key, traits.map(trait => trait.key), /* hard reload = */ false)()
        })
      },
    })
  }

  /**
   * Construct the icon-based menus
   * @param {string} menu
   * @param {Array} objects
   * @param {object} menus
   */
  renderIconMenu(menu, menus, objects) {
    const toolbar_items = []

    let iter = 0
    for (const menu_key in menus[menu]) {
      const menu_obj = menus[menu][menu_key]
      if (menu_obj.hidden) continue
      if (!menu_obj.icon_menu) continue

      // First, construct the filtered objects
      const filter_func = this.getFilterFunc(menu, objects, [menu_key])

      const ids = filter_func()
      const filtered = objects.filter(obj => ids.includes(obj.key))

      // Now construct the items one by one
      for (const option_key of Object.keys(menu_obj.options)) {
        const option_obj = menu_obj.options[option_key]
        const text = option_obj.title
        if (this.get(menu, menu_key) == option_key) {
          // this is already selected
          toolbar_items.push(menuItem({
            text: text,
            cssclass: 'submenu-tag-selected',
            callback: getCallback(menu, menu_key, /* value = */ null),
          }))
        } else {
          // Compute the number of objects that would've been filtered by this tag
          const additional_filter_func = option_obj.filter
          let obj_number = filtered.length
          if (additional_filter_func) {
            obj_number = filtered.filter(additional_filter_func).length
          }
          if (obj_number) {
            toolbar_items.push(menuItem({
              text: `${text} ${obj_number}`,
              cssclass: `submenu-tag-${iter}`,
              callback: getCallback(menu, menu_key, option_key),
            }))
          }
        }
      }
      iter += 1
    }

    return toolbar_items
  }


  /**
   * Renders the filter toolbar into a jquery object.
   * @param {string} menu
   * @param {object} menu_parsed
   * @param {object[]} objects
   */
  renderNonIconMenu(menu, menu_parsed, objects) {
    if (!(menu in setup.MenuFilter._MENUS)) throw new Error(`Unrecognized menu filter: ${menu}`)

    const toolbar_items = []

    for (const key in menu_parsed[menu]) {
      if (menu_parsed[menu][key].hidden) continue
      if (menu_parsed[menu][key].icon_menu) continue
      let menu_item
      if (menu_parsed[menu][key].trait_menu) {
        menu_item = this.getMenuFilterToolbarTraits(menu_parsed, menu, key, objects)
      } else {
        menu_item = this.getMenuFilterToolbarSingleMenu(menu_parsed, menu, key)
      }
      toolbar_items.push(menu_item)
    }

    return toolbar_items
  }


  /**
   * @param {string} menu 
   * @param {Array} objects 
   */
  getMenuFilterToolbarRender(menu, objects) {
    const menu_parsed = setup.MenuFilter.getMenus()
    let toolbar_items = []

    if (!this.getOption(menu, 'hidden')) {
      const icon_menu = this.renderIconMenu(menu, menu_parsed, objects)
      const non_icon_menu = this.renderNonIconMenu(menu, menu_parsed, objects)
      toolbar_items = toolbar_items.concat(non_icon_menu).concat(icon_menu)
    }

    const extras = []

    for (const option in setup.MenuFilter.OPTIONS) {
      const option_obj = setup.MenuFilter.OPTIONS[option]
      extras.push(menuItem({
        text: option_obj.title,
        checked: !!this.getOption(menu, option),
        callback: optionCallback(menu, option, this.getOption(menu, option)),
      }))
    }

    extras.push(
      menuItem({
        text: 'Scroll to Top',
        callback: () => {
          document.body.scrollTop = 0
          document.documentElement.scrollTop = 0
        }
      })
    )

    extras.push(
      menuItem({
        text: 'Reset Filters',
        callback: () => {
          for (const key in menu_parsed[menu]) {
            SugarCube.State.variables.menufilter.set(menu, key, /* value = */ null)
          }
          setup.runSugarCubeCommand('<<focgoto>>')
        }
      })
    )

    toolbar_items.push(menuItem({
      text: '<i class="sfa sfa-cog"></i>',
      clickonly: true,
      children: extras,
    }))

    toolbar_items.push(
      menuItemText({
        text: `<span class='filterwidgetshown${menu}'></span> / ${objects.length}`,
      })
    )

    return toolbar_items
  }

  /**
   * @param {string} menu 
   * @param {Array} objects_raw_raw 
   * @param {Array<string>} [ignored_keys]
   * @returns {Function}
   */
  getFilterFunc(menu, objects_raw_raw, ignored_keys) {
    if (!(menu in setup.MenuFilter._MENUS)) throw new Error(`Unknown menu ${menu} in filter`)

    // shallow copy
    let objects_raw = objects_raw_raw.filter(() => true)

    return () => {
      // create another shallow copy
      let objects = objects_raw.filter(() => true)

      const menu_copy = setup.MenuFilter.getMenus(menu)
      for (const key in menu_copy[menu]) {
        if (ignored_keys && ignored_keys.includes(key)) continue
        const value = this.get(menu, key)
        if (menu_copy[menu][key].trait_menu) {
          // special case for trait menu. Assume objects are units.
          const traits = (value || []).map(trait_key => setup.trait[trait_key])
          objects = objects.filter(/** @param {setup.Unit} unit */ unit => unit.isHasTraitsExact(traits))
        } else if (value && value in menu_copy[menu][key].options) {
          const value_object = menu_copy[menu][key].options[value]
          if ('filter' in value_object) {
            objects = objects.filter(value_object.filter)
          }
          if ('sort' in value_object) {
            objects.sort(value_object.sort)
          }
        } else {
          if ('default_filter' in menu_copy[menu][key]) {
            objects = objects.filter(menu_copy[menu][key].default_filter)
          }
          if ('default_sort' in menu_copy[menu][key]) {
            objects = objects.sort(menu_copy[menu][key].default_sort)
          }
        }
      }

      // these elements have not been created yet by the time this func is called.
      setTimeout(() => {
        const shown = objects.length
        $(`.filterwidgetshown${menu}`).text(shown.toString())
        if (shown < objects_raw.length) {
          $(`.filterwidgethidden${menu}`).text(`${objects_raw.length - shown} hidden by filters`)
        } else {
          $(`.filterwidgethidden${menu}`).text('')
        }
      }, 1)

      return objects.map(object => object.key)
    }
  }

  /**
   * Return menu filter as this checked.
   * If the value is something other than default, will remove the checked.
   * 
   * @param {string} menu 
   * @param {string} key 
   * @param {Function} on_change_callback
   * @param {string} [tooltip]
   * @returns {JQLite}
   */
  getMenuItemChecked(menu, key, on_change_callback, tooltip) {
    const menu_parsed = setup.MenuFilter.getMenus(menu)
    const menu_obj = menu_parsed[menu][key]
    const current_value = this.get(menu, key)
    let text = menu_obj.title

    return menuItemAction({
      text: text,
      checked: !current_value,
      tooltip: tooltip,
      callback: () => {
        if (current_value) {
          this.set(menu, key, null)
        } else {
          this.set(menu, key, Object.keys(menu_obj.options)[0])
        }
        on_change_callback()
      }
    })
  }

  /**
   * Translate the functions in the menu
   * @param {string=} only_menu   if supplied, only return this menu
   */
  static getMenus(only_menu) {
    const menu_copy = {}
    let menulist = []
    if (only_menu) {
      menulist = [only_menu]
    } else {
      menulist = Object.keys(setup.MenuFilter._MENUS)
    }

    for (const menu of menulist) {
      const menu_obj = setup.MenuFilter._MENUS[menu]
      menu_copy[menu] = Object.assign({}, menu_obj)
      for (const key in menu_obj) {
        if (menu_copy[menu][key].options instanceof Function) {
          // don't replace permanently, replace it with a shallow copy
          menu_copy[menu][key] = Object.assign({}, menu_copy[menu][key])
          menu_copy[menu][key].options = menu_copy[menu][key].options()
        }
      }
    }
    return menu_copy
  }

  static _MENUS = {}
}
