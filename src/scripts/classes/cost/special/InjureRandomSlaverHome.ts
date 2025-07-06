// @ts-nocheck


/**
 * Injure a random unit at home for 10 weeks
 */
setup.qcImpl.InjureRandomSlaverHome = class InjureRandomSlaverHome extends setup.Cost {
  constructor() {
    super()
  }

  text() {
    return `setup.qc.InjureRandomSlaverHome()`
  }

  /**
   * @param {any} quest 
   */
  apply(quest) {
    let units = State.variables.company.player.getUnits({home: true, job: setup.job.slaver})
    if (!units.length) return
    let chosen = setup.rng.choice(units)
    setup.qc.Injury('unit', 10).apply(setup.costUnitHelper(chosen))
  }

  /**
   * @param {*} quest 
   */
  explain(quest) {
    return `Injure a random unit in your company`
  }
}
