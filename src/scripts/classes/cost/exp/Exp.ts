// @ts-nocheck


// give exp to all participating slavers.
setup.qcImpl.Exp = class Exp extends setup.Cost {
  constructor(exp_amount) {
    super()

    // Called from subclass, skip checks
    if (this.constructor !== setup.qcImpl.Exp && exp_amount === undefined)
      return

    if (!Number.isInteger(exp_amount)) throw new Error(`Unknown exp: ${exp_amount}`)
    if (exp_amount < 0) throw new Error(`exp must be positive`)

    this.exp_amount = exp_amount
  }

  isOk() {
    throw new Error(`slaversexp should not be a cost`)
  }

  getExp(quest) {
    return this.exp_amount
  }

  apply(quest) {
    // try to apply as best as you can.
    let exp_amount = this.getExp(quest)
    let team = quest.getTeam()
    let units = team.getUnits()
    // give exp to all units, even those not participating.
    for (let i = 0; i < units.length; ++i) {
      let unit = units[i]
      if (unit.isSlaver()) {
        unit.gainExp(exp_amount)
      }
    }
    setup.notify(`Your slavers gain ${exp_amount} exp.`)
  }

  undoApply() {
    throw new Error(`exp should not be a cost`)
  }

  explain(quest) {
    return `some exp`
  }
}
