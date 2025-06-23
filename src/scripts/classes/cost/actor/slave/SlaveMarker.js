
/* Does not actually do anything aside from marking actor as a slaver for preference */
setup.qcImpl.SlaveMarker = class SlaveMarker extends setup.Cost {
  constructor(actor_name) {
    super()

    // is_mercenary: if true, then the slaver has to be paid to join.

    this.actor_name = actor_name
    this.IS_SLAVE = true
  }

  static NAME = 'Mark unit as a slave for gender preferences'
  static PASSAGE = 'CostSlaveMarker'

  getActorName() { return this.actor_name }

  text() {
    return `setup.qc.SlaveMarker('${this.actor_name}')`
  }

  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    // nothing
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    return `${this.actor_name} is marked as a slave for gender preference`
  }
}
