// Switches body with the spare one. Only for shapeshifters.

setup.qcImpl.Bodyshift = class Bodyshift extends setup.Cost {
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.Bodyshift('${this.actor_name}')`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)
    if (State.variables.bodyshift.isBodyshifter(unit)) {
      State.variables.bodyshift.bodyshift(unit)
      if (unit.isYourCompany()) {
        setup.notify(`a|Rep a|bodyshift`, { a: unit })
      }
    }
  }

  explain(quest) {
    return `${this.actor_name} bodyshifts`
  }
}
