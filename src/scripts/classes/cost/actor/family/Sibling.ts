// @ts-nocheck


// resets background trait to the given trait.
setup.qcImpl.Sibling = class Sibling extends setup.Cost {
  constructor(actor_name, target_actor_name) {
    super()

    this.actor_name = actor_name
    this.target_actor_name = target_actor_name
  }

  static NAME = 'Two units become siblings'
  static PASSAGE = 'CostSibling'

  text() {
    return `setup.qc.Sibling('${this.actor_name}', '${this.target_actor_name}')`
  }

  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let target = quest.getActorUnit(this.target_actor_name)
    State.variables.family.setSibling(unit, target)
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    return `${this.actor_name} and ${this.target_actor_name} becomes siblings`
  }
}
