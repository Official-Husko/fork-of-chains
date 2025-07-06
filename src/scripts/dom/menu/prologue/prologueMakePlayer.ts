// @ts-nocheck

/**
 * Turn a unit into the player character.
 * 
 * @param {setup.Unit} unit
 */
setup.DOM.Menu.prologueMakePlayer = function (unit) {
  const past_image = State.variables.unitimage.getImagePath(unit)
  State.variables.unitimage.deleteUnit(unit)
  delete State.variables.unit[unit.key]
  unit.key = 'player'
  State.variables.unit.player = unit
  State.variables.unitimage.setImage(unit, past_image)
  setup.qc.AddTitle('unit', setup.title.leader).apply(setup.costUnitHelper(unit))
  State.variables.company.player.addUnit(unit, setup.job.slaver)
  State.variables.notification.popAll()
}
