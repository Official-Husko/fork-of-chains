// @ts-nocheck


setup.qcImpl.TraumatizeRandom = class TraumatizeRandom extends setup.Cost {
  constructor(actor_name, duration) {
    super()

    this.actor_name = actor_name
    this.duration = duration
  }

  static NAME = 'Unit gains a random temporary trauma'
  static PASSAGE = 'CostTraumatizeRandom'
  static UNIT = true

  text() {
    return `setup.qc.TraumatizeRandom('${this.actor_name}', ${this.duration})`
  }


  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    State.variables.trauma.traumatize(unit, this.duration)
  }

  undoApply(quest) {
    throw new Error(`not undo-able`)
  }

  explain(quest) {
    return `${this.actor_name} gains a random temporary trauma for ${this.duration} weeks`
  }
}
