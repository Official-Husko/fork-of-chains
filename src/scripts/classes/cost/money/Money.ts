// @ts-nocheck


// Quest cost, reward, etc. Some can also be used for non-quests:
// i.e., the ones whose apply(), isOk(), and explain() does not take a parameter.

// can also be used as reward. Eg.., Money(-20) as cost, Money(20) as reward.
setup.qcImpl.Money = class Money extends setup.Cost {
  constructor(money) {
    super()

    // Called from subclass, skip checks
    if (this.constructor !== setup.qcImpl.Money && money === undefined)
      return

    if (!Number.isInteger(money)) throw new Error(`Unknown money: ${money}`)
    this.money = money
  }

  text() {
    return `setup.qc.Money(${this.money})`
  }

  getMoney(quest) {
    return this.money
  }

  isOk(quest) {
    let money = this.getMoney(quest)
    if (money >= 0) return true
    return (State.variables.company.player.getMoney() >= -money)
  }

  apply(quest) {
    // try to apply as best as you can.
    State.variables.company.player.addMoney(this.getMoney(quest))
  }

  undoApply(quest) {
    State.variables.company.player.addMoney(-this.getMoney(quest))
  }

  explain(quest) {
    return setup.DOM.toString(setup.DOM.Util.money(this.getMoney(quest)))
  }
}
