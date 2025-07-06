// @ts-nocheck


// give exp to all participating slavers.
setup.qcImpl.MoneySmall = class MoneySmall extends setup.qcImpl.Money {
  constructor(multiplier) {
    super()

    if (multiplier) {
      this.multi = multiplier
    } else {
      this.multi = null
    }
  }

  static NAME = 'Money (Half of normal)'
  static PASSAGE = 'CostMoneySmall'

  text() {
    let param = ''
    if (this.multi) param = this.multi
    return `setup.qc.MoneySmall(${param})`
  }

  explain(quest) {
    if (quest) {
      return super.explain(quest)
    } else {
      if (!this.multi) return 'Money (auto, half)'
      return `Money (auto, half) x ${this.multi}`
    }
  }

  getMoney(quest) {
    let base = setup.qcImpl.MoneyNormal.computeBaseMoney(quest)
    let multi = this.multi
    if (multi) {
      base *= multi
    }
    // small is halved
    base *= 0.5
    return Math.round(base)
  }
}
