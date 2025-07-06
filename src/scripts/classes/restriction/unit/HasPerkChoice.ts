// @ts-nocheck

setup.qresImpl.HasPerkChoice = class HasPerkChoice extends setup.Restriction {
  /**
   * @param {setup.Perk} perk
   */
  constructor(perk) {
    super()
    this.perk_key = setup.keyOrSelf(perk)
  }

  text() {
    return `setup.qres.HasPerkChoice('${this.perk_key}')`
  }

  getPerk() { return setup.trait[this.perk_key] }

  explain() {
    const perk = this.getPerk()
    return `Unit has ${perk.rep()} as one of their perk choices`
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isOk(unit) {
    return unit.isHasPerkChoice(this.getPerk())
  }
}
