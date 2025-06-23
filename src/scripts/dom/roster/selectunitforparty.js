import { menuItemAction, menuItemText } from "../../ui/menu"

/**
 * @param {setup.Party} party
 * @returns {setup.DOM.Node}
 */
setup.DOM.Roster.selectunitforparty = function (party) {
  return setup.DOM.Roster.show({
    menu: 'unit',
    units: State.variables.company.player.getUnits({}).filter(unit => unit.getParty() != party),
    actions_callback: /** @param {setup.Unit} unit */ (unit) => {
      const menus = []

      menus.push(menuItemAction({
        text: `Select`,
        callback: () => {
          if (unit.getParty()) {
            unit.getParty().removeUnit(unit)
          }
          party.addUnit(unit)
          setup.DOM.Nav.goto()
        },
      }))

      if (unit.getParty()) {
        menus.push(menuItemText({
          text: html`
            ${setup.DOM.Text.dangerlite('Warning:')}
            this will remove this unit from ${unit.getParty().rep()}
          `,
        }))
      }

      return menus
    }
  })
}
