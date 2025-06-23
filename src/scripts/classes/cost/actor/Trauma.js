
// gains a specific trauma for specified duration
setup.qcImpl.Trauma = class Trauma extends setup.Cost {
  constructor(actor_name, trait, duration) {
    super()

    this.actor_name = actor_name
    this.trait_key = trait.key
    this.duration = duration
  }

  /**
   * @param {object} [quest]
   * @returns {boolean}
   */
  isOk(quest) {
    throw new Error(`Reward only`)
  }

  static NAME = 'Gain a specific temporary trauma/boon for several weeks'
  static PASSAGE = 'CostTrauma'
  static UNIT = true

  text() {
    return `setup.qc.Trauma('${this.actor_name}', setup.trait.${this.trait_key}, ${this.duration})`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let trait = setup.trait[this.trait_key]
    State.variables.trauma.adjustTrauma(unit, trait, this.duration)
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    return `${this.actor_name}'s gains ${setup.trait[this.trait_key].rep()} for ${this.duration} weeks`
  }
}
