/**
 * Breaks up a unit with you
 */
setup.qcImpl.BreakupWithYou = class BreakupWithYou extends setup.Cost {
  /**
   * @param {string} actor_name 
   */
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.BreakupWithYou('${this.actor_name}')`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    setup.qc.Breakup('unit', 'you').apply(setup.costUnitHelperDict({
      unit: unit,
      you: State.variables.unit.player,
    }))
  }

  explain(quest) {
    return `You break up with ${this.actor_name}, if you were lovers`
  }
}
