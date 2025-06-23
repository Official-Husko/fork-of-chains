
// give exp to all participating slavers.
setup.qcImpl.MoneyCrit = class MoneyCrit extends setup.qcImpl.Money {
  constructor(multiplier) {
    super()

    if (multiplier) {
      this.multi = multiplier
    } else {
      this.multi = null
    }
    // this.multi *= 2   // crit effect
  }

  static NAME = 'Money (Critical)'
  static PASSAGE = 'CostMoneyCrit'

  text() {
    let param = ''
    if (this.multi) param = this.multi
    return `setup.qc.MoneyCrit(${param})`
  }

  explain(quest) {
    if (quest) {
      return super.explain(quest)
    } else {
      if (!this.multi) return 'Money (auto, crit)'
      return `Money (auto, crit) x ${this.multi}`
    }
  }

  getMoney(quest) {
    let base = setup.qcImpl.MoneyNormal.computeBaseMoney(quest)
    let multi = this.multi
    if (multi) {
      base *= multi
    }
    // crit
    base *= setup.MONEY_CRIT_MULTIPLIER
    return Math.round(base)
  }
}
