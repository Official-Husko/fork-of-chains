// @ts-nocheck


/**
 * Traumatize a random unit at home for 40 weeks
 */
setup.qcImpl.TraumatizeRandomSlaverHome = class TraumatizeRandomSlaverHome extends setup.Cost {
  constructor() {
    super()
  }

  text() {
    return `setup.qc.TraumatizeRandomSlaverHome()`
  }

  /**
   * @param {any} quest 
   */
  apply(quest) {
    let units = State.variables.company.player.getUnits({home: true, job: setup.job.slaver})
    if (!units.length) return
    let chosen = setup.rng.choice(units)
    setup.qc.TraumatizeRandom('unit', 40).apply(setup.costUnitHelper(chosen))
  }

  /**
   * @param {*} quest 
   */
  explain(quest) {
    return `Traumatize a random unit in your company`
  }
}
