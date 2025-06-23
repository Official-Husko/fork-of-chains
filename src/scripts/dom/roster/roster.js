import { menuItem, menuItemTitle } from "../../ui/menu"

/**
 * @param {setup.Unit} unit 
 * @param {JQLite[]} menus 
 * @returns {setup.DOM.Node}
 */
export function parseRosterMenuToolbar(unit, menus) {
  return setup.DOM.Util.menuItemToolbar([
    menuItemTitle({
      text: `${setup.DOM.toString(setup.DOM.Util.level(unit.getLevel()))} ${unit.repLong()}`,
    })
  ].concat(menus))
}

/**
 * List units and possibly actions to do with them.
 * @callback actionsCallback
 * @param {setup.Unit} unit
 * @returns {JQLite[]}
 * 
 * @typedef {Object} RosterShowArgs
 * @property {setup.Unit[]} units
 * @property {actionsCallback} actions_callback
 * @property {string} menu
 * @property {boolean} [is_menu_generated_async]
 * @property {boolean} [no_compact_display]
 * 
 * @param {RosterShowArgs} args 
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Roster.show = function ({
  units, actions_callback, menu, is_menu_generated_async, no_compact_display
}) {
  return setup.DOM.Util.filterAll({
    menu: menu,
    filter_objects: units,
    display_callback: (unit) => {

      function generateMenu() {
        return parseRosterMenuToolbar(unit, actions_callback(unit))
      }

      let actions_menu
      if (is_menu_generated_async) {
        actions_menu = setup.DOM.Util.async(() => generateMenu())
      } else {
        actions_menu = generateMenu()
      }

      if (!no_compact_display && State.variables.menufilter.get(menu, 'display') == 'compact') {
        return actions_menu
      } else {
        return html`
          ${actions_menu}
          <div>
            ${setup.DOM.Card.unit(unit, /* hide actions = */ true)}
          </div>
        `
      }
    },
  })
}
