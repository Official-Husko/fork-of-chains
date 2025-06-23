/**
 * @param {setup.Unit} unit 
 */
setup.DOM.Roster.rehireRetired = function (unit) {
  const cost = setup.RETIRE_RERECRUIT_COST_MONEY
  State.variables.company.player.substractMoney(cost)
  State.variables.notification.disable()
  State.variables.retiredlist.unretire(unit)
  State.variables.company.player.addUnit(unit, setup.job.slaver)
  State.variables.leave.leave(
    unit,
    `a|is wrapping up ends in order to rejoin your company as a slaver proper`,
    setup.RETIRE_RERECRUIT_AFK_WEEKS
  )
  State.variables.notification.enable()
  setup.notify(
    `a|Rep a|have rejoined your company! a|They will need ${setup.RETIRE_RERECRUIT_AFK_WEEKS} weeks in order to wrap up things on a|their end first, however`,
    { a: unit }
  )
}
