// @ts-nocheck


setup.qcImpl.Prestige = class Prestige extends setup.Cost {
  constructor(prestige) {
    super()

    this.prestige = prestige
  }

  static NAME = 'Prestige'
  static PASSAGE = 'CostPrestige'

  text() {
    return `setup.qc.Prestige(${this.prestige})`
  }

  isOk() {
    if (this.prestige > 0) return true
    return (State.variables.company.player.getPrestige() >= -this.prestige)
  }

  apply(quest) {
    // try to apply as best as you can.
    State.variables.company.player.addPrestige(this.prestige)
  }

  undoApply(quest) {
    State.variables.company.player.addPrestige(-this.prestige)
  }

  explain() {
    return `<<prestige ${this.prestige}>>`
  }
}
