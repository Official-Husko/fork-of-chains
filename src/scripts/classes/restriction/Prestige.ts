// @ts-nocheck


setup.qresImpl.Prestige = class Prestige extends setup.Restriction {
  constructor(prestige) {
    super()

    this.prestige = prestige
  }

  static NAME = 'Prestige minimum'
  static PASSAGE = 'RestrictionPrestige'

  text() {
    return `setup.qres.Prestige(${this.prestige})`
  }

  explain() {
    return `Minimum prestige: ${this.prestige}`
  }

  isOk() {
    return State.variables.company.player.getPrestige() >= this.prestige
  }
}
