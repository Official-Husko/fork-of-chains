// @ts-nocheck


// gives money equal multipler * unit's value. Capped at the given cap. ALWAYS PUT A CAP
setup.qcImpl.MoneyUnitValue = class MoneyUnitValue extends setup.qcImpl.Money {
  /**
   * 
   * @param {string} actor_name 
   * @param {number} multiplier 
   * @param {number} cap 
   */
  constructor(actor_name, multiplier, cap) {
    super(0)

    if (!cap) throw new Error(`Money unit value for ${actor_name} missing a cap`)

    this.actor_name = actor_name
    if (!multiplier) throw new Error(`Missing multiplier for MoneyUnitValue(${actor_name})`)
    this.multiplier = multiplier
    this.cap = cap
  }

  text() {
    return `setup.qc.MoneyUnitValue("${this.actor_name}", ${this.multiplier}, ${this.cap})`
  }

  getMoney(quest) {
    const unit = quest.getActorUnit(this.actor_name)
    const value = unit.getSlaveValue()
    const money = Math.min(Math.round(value * this.multiplier * setup.lowLevelMoneyMulti()), this.cap)
    return money
  }

  explain(quest) {
    if (quest && 'getActorUnit' in quest) {
      return super.explain(quest)
    } else {
      return `Money equal to ${this.multiplier}x ${this.actor_name}'s value, capped at ${this.cap}`
    }
  }
}
