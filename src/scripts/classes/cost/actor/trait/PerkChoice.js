setup.qcImpl.PerkChoice = class PerkChoice extends setup.Cost {
  /**
   * @param {string} actor_name
   * @param {setup.Perk} perk
   * @param {boolean} [no_learn]
   */
  constructor(actor_name, perk, no_learn) {
    super()

    this.actor_name = actor_name
    this.perk_key = setup.keyOrSelf(perk)
    this.no_learn = no_learn
  }

  text() {
    return `setup.qc.PerkChoice('${this.actor_name}', '${this.perk_key}', ${this.no_learn})`
  }

  getPerk() { return setup.trait[this.perk_key] }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)
    if (unit.addPerkChoice(this.getPerk()) && !this.no_learn) {
      unit.addTrait(this.getPerk())
    }
  }

  explain(quest) {
    const perk = this.getPerk()
    return `${this.actor_name} gains access to the ${perk.rep()} perk, which they can learn by resetting their perks${this.no_learn ? ' (not automatically learned)' : ''}`
  }
}
