
setup.qcImpl.BoonizeRandom = class BoonizeRandom extends setup.Cost {
  constructor(actor_name, duration) {
    super()

    this.actor_name = actor_name
    this.duration = duration
  }

  static NAME = 'Unit gains a random temporary boon'
  static PASSAGE = 'CostBoonizeRandom'
  static UNIT = true

  text() {
    return `setup.qc.BoonizeRandom('${this.actor_name}', ${this.duration})`
  }


  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    State.variables.trauma.boonize(unit, this.duration)
  }

  undoApply(quest) {
    throw new Error(`not undo-able`)
  }

  explain(quest) {
    return `${this.actor_name} gains a random and temporary boon for ${this.duration} weeks`
  }
}
