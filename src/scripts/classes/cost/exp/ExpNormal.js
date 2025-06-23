
setup.qcImpl.ExpNormal = class ExpNormal extends setup.qcImpl.Exp {
  constructor(multi) {
    super()

    if (multi) {
      this.multi = multi
    } else {
      this.multi = null
    }
    this.IS_EXP_AUTO = true
  }

  text() {
    let param = ''
    if (this.multi) param = this.multi
    return `setup.qc.ExpNormal(${param})`
  }

  getExp(quest) {
    let base = quest.getTemplate().getDifficulty().getExp()
    base *= quest.getTemplate().getWeeks()
    if (this.multi) {
      base *= this.multi
    }
    return Math.round(base)
  }

  explain(quest) {
    if (quest) {
      return `<<exp ${this.getExp(quest)}>>`
    } else {
      if (!this.multi) return 'Exp(Normal)'
      return `Exp(Normal) x ${this.multi}`
    }
  }
}
