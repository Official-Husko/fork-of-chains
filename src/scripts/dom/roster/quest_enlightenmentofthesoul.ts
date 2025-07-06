// @ts-nocheck

import { menuItemAction } from "../../ui/menu"

/**
 * @param {setup.Unit} pupil
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Roster.quest_enlightenmentofthesoul = function (pupil) {
  const units = State.variables.company.player.getUnits({ job: setup.job.slaver }).filter(
    unit => unit != State.variables.unit.player && unit.isHasDick() && unit != pupil
  )

  return setup.DOM.Roster.show({
    menu: 'unit',
    units: units,
    actions_callback: /** @param {setup.Unit} unit */ (unit) => [
      menuItemAction({
        text: `Select`,
        callback: () => {
          const preference = State.variables.settings.getGenderPreference(setup.job.slaver)
          const child = setup.UnitBirth.generateChild(unit, pupil, preference)

          setup.qc.Event('enlightenment_of_the_soul___interlude2', 0, { child: 'child', pupil: 'pupil' }).apply(
            setup.costUnitHelperDict({
              child: child,
              pupil: pupil,
            })
          )
          setup.DOM.Nav.goto(`OpportunityList`)
        },
      })
    ]
  })
}
