// @ts-nocheck


setup.qcImpl.TraumaHeal = class TraumaHeal extends setup.Cost {
  constructor(actor_name, duration) {
    super()

    this.actor_name = actor_name
    this.duration = duration
  }

  static NAME = "Heals given amount of week worth of trauma"
  static PASSAGE = 'CostTraumaHeal'
  static UNIT = true

  text() {
    return `setup.qc.TraumaHeal('${this.actor_name}', ${this.duration})`
  }


  isOk(quest) {
    throw new Error(`Reward only`)
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    State.variables.trauma.healTrauma(unit, this.duration)
  }

  undoApply(quest) {
    throw new Error(`not undo-able`)
  }

  explain(quest) {
    return `${this.actor_name} heals ${this.duration} weeks of trauma`
  }
}
