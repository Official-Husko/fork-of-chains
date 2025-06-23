import { menuItemAction } from "../../ui/menu"

/**
 * @param {setup.Bedchamber} bedchamber
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Roster.bedchambersetslaver = function (bedchamber) {
  const units = State.variables.company.player.getUnits({ job: setup.job.slaver }).filter(
    unit => unit != bedchamber.getSlaver()
  )
  return setup.DOM.Roster.show({
    menu: 'unit',
    units: units,
    actions_callback: (unit) => [
      menuItemAction({
        text: `Select`,
        callback: () => {
          bedchamber.setSlaver(unit)
          setup.DOM.Nav.gotoreturn()
        },
      })
    ]
  })
}
