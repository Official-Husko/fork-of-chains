// @ts-nocheck

import { menuItemAction } from "../../ui/menu"

/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Roster.codeeditorreplaceunit = function () {
  return setup.DOM.Roster.show({
    menu: 'unit',
    units: State.variables.company.player.getUnits({}),
    actions_callback: (unit) => [
      menuItemAction({
        text: `Select`,
        callback: () => {
          // @ts-ignore
          if (State.variables.dtEditActor == 'Target') {
            // @ts-ignore
            State.variables.compiledquest.unit_key = unit.key
          } else {
            // @ts-ignore
            State.variables.compiledquest.actor_unit_key_map[State.variables.dtEditActor] = unit.key
          }
          // @ts-ignore
          delete State.variables.dtEditActor

          setup.runSugarCubeCommand(`<<devgotoreturn>>`)
        },
      })
    ]
  })
}
