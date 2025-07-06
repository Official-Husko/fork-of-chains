// @ts-nocheck

// retire this unit
setup.qcImpl.Retire = class Retire extends setup.Cost {
  constructor(actor_name) {
    super()
    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.Retire('${this.actor_name}')`
  }

  apply(quest) {
    const unit = quest.getActorUnit(this.actor_name)
    State.variables.retiredlist.retire(unit)
  }

  explain(quest) {
    return `Forcefully retires ${this.actor_name}`
  }
}
