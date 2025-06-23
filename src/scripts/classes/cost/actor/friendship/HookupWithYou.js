/**
 * Hooks up a unit with you, breaking their existing lovers if any
 */
setup.qcImpl.HookupWithYou = class HookupWithYou extends setup.Cost {
  /**
   * @param {string} actor_name 
   */
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.HookupWithYou('${this.actor_name}')`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    setup.qc.Hookup('unit', 'you').apply(setup.costUnitHelperDict({
      unit: unit,
      you: State.variables.unit.player,
    }))
  }

  explain(quest) {
    return `${this.actor_name} becomes your lover, breaking up with any existing units if any`
  }
}
