
// levels up this unit.
setup.qcImpl.levelUp = class levelUp extends setup.Cost {
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  static NAME = 'Level up a unit'
  static PASSAGE = 'CostlevelUp'

  text() {
    return `setup.qc.levelUp('${this.actor_name}')`
  }

  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    unit.levelUp()
  }

  undoApply(quest) {
    throw new Error(`Cannot be undone`)
  }

  explain(quest) {
    return `${this.actor_name} levels up`
  }
}
