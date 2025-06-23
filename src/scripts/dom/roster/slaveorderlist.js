import { menuItemAction, menuItemText } from "../../ui/menu"

/**
 * @param {setup.Unit} unit 
 * @param {setup.SlaveOrder} slave_order 
 * @returns {JQLite[]}
 */
function slaveOrderMenuItems(unit, slave_order) {
  const menus = []

  if (slave_order.isCanFulfill(unit)) {
    menus.push(menuItemAction({
      text: `Select`,
      callback: () => {
        slave_order.fulfill(unit)
        setup.notify(`a|Rep a|have been sold to ${slave_order.getSourceCompany().rep()}`, { a: unit })
        setup.DOM.Nav.goto(`SlaveOrderList`)
      },
    }))
  } else {
    if (unit.getParty()) {
      menus.push(menuItemText({
        text: html`
          <span data-tooltip="You cannnot sell units that are currently in a party. Remove them from the party if you wish to sell them.">
          ${setup.DOM.Text.dangerlite(`Unit in party`)}
          </span>
        `,
      }))
    } else {
      menus.push(menuItemText({
        text: html`
          <span data-tooltip="A unit can only fulfill a slave order if they would give you at least 1g. Some quests would require the slave to have several of the critical traits in order to do so.">
          ${setup.DOM.Text.dangerlite(`Price too low`)}
          </span>
        `,
      }))
    }
  }

  const fragments = []
  fragments.push(
    setup.DOM.Card.criteriatraitlist(slave_order.getCriteria(), unit, /* ignore extra = */ true)
  )

  fragments.push(html` `)

  fragments.push(setup.DOM.Util.money(slave_order.getFulfillPrice(unit)))

  menus.push(menuItemText({
    text: setup.DOM.create('span', {}, fragments)
  }))

  return menus
}

/**
 * @param {setup.SlaveOrder} slave_order
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Roster.slaveorderselect = function (slave_order) {
  /* Special case for slave orders: use all units, not just units in your company. */
  const units = Object.values(State.variables.unit).filter(unit => slave_order.isSatisfyRestrictions(unit))

  return setup.DOM.Roster.show({
    menu: 'unitso',
    units: units,
    is_menu_generated_async: true,
    actions_callback: (unit) => slaveOrderMenuItems(unit, slave_order),
  })
}
