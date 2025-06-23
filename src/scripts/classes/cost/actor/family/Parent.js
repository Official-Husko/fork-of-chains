
// actor becomes target's parent
setup.qcImpl.Parent = class Parent extends setup.Cost {
  constructor(actor_name, target_actor_name) {
    super()

    this.actor_name = actor_name
    this.target_actor_name = target_actor_name
  }

  static NAME = "A unit become another's parent"
  static PASSAGE = 'CostParent'

  text() {
    return `setup.qc.Parent('${this.actor_name}', '${this.target_actor_name}')`
  }

  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let target = quest.getActorUnit(this.target_actor_name)
    State.variables.family.setParent(unit, target)
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    return `${this.actor_name} becomes ${this.target_actor_name}'s parent`
  }
}
