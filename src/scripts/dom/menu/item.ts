// @ts-nocheck

/**
 * @param {setup.ItemUnitUsable} item
 * @param {setup.Unit} unit
 */
setup.DOM.Menu.useitemonunit = function (item, unit) {
  item.use(unit)
  setup.notify(`Used ${item.rep()} on a|rep.`, { a: unit })
  if (State.variables.inventory.isHasItem(item)) {
    setup.DOM.Nav.goto()
  } else {
    setup.DOM.Nav.goto('Inventory')
  }
}
