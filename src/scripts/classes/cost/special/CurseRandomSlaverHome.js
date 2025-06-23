/**
 * Curse a random unit at home
 */
setup.qcImpl.CurseRandomSlaverHome = class CurseRandomSlaverHome extends setup.Cost {
  constructor() {
    super()
  }

  text() {
    return `setup.qc.CurseRandomSlaverHome()`
  }

  /**
   * @param {any} quest 
   */
  apply(quest) {
    const units = State.variables.company.player.getUnits({ home: true, job: setup.job.slaver })
    if (!units.length) return
    const chosen = setup.rng.choice(units)
    setup.qc.Blessing('unit', 1, null, true).apply(setup.costUnitHelper(chosen))
  }

  /**
   * @param {*} quest 
   */
  explain(quest) {
    return `Curse a random unit in your company`
  }
}
