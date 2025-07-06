// @ts-nocheck

// give exp to all participating slavers.
setup.qcImpl.MoneyNormal = class MoneyNormal extends setup.qcImpl.Money {
  constructor(multiplier) {
    super()

    if (multiplier) {
      this.multi = multiplier
    } else {
      this.multi = null
    }
  }

  static NAME = 'Money (Normal)'
  static PASSAGE = 'CostMoneyNormal'

  text() {
    let param = ''
    if (this.multi) param = this.multi
    return `setup.qc.MoneyNormal(${param})`
  }

  explain(quest) {
    if (quest) {
      return super.explain(quest)
    } else {
      if (!this.multi) return 'Money (auto, success)'
      return `Money (auto, success) x ${this.multi}`
    }
  }

  /**
   * @param {setup.QuestInstance | setup.OpportunityInstance} quest 
   */
  static computeBaseMoney(quest) {
    let base = quest.getTemplate().getDifficulty().getMoney()
    base *= quest.getTemplate().getWeeks()
    if (quest instanceof setup.QuestInstance && quest.getTeam()) {
      const slavers = quest.getTeam().getUnits().filter(unit => unit.isSlaver()).length
      base *= (slavers / 3.0)
    }
    return Math.round(base)
  }

  getMoney(quest) {
    let base = setup.qcImpl.MoneyNormal.computeBaseMoney(quest)
    const multi = this.multi
    if (multi) {
      base *= multi
    }
    return Math.round(base)
  }
}
