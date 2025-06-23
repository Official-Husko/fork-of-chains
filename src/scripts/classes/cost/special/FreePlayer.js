/**
 * Frees the player character
 */
setup.qcImpl.FreePlayer = class FreePlayer extends setup.Cost {
  constructor() {
    super()
  }

  text() {
    return `setup.qc.FreePlayer()`
  }

  /**
   * @param {any} quest 
   */
  apply(quest) {
    // frees yourself from leave
    setup.qc.Return('unit').apply(
      setup.costUnitHelper(State.variables.unit.player)
    )
  }

  /**
   * @param {*} quest 
   */
  explain(quest) {
    return `You returned to the company`
  }
}
