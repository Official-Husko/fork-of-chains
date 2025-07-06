// @ts-nocheck

setup.qcImpl.RemovePerkChoice = class RemovePerkChoice extends setup.Cost {
  /**
   * @param {string} actor_name
   * @param {setup.Perk} perk
   */
  constructor(actor_name, perk) {
    super()

    this.actor_name = actor_name
    this.perk_key = setup.keyOrSelf(perk)
  }

  text() {
    return `setup.qc.RemovePerkChoice('${this.actor_name}', '${this.perk_key}')`
  }

  getPerk() { return setup.trait[this.perk_key] }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)
    unit.removePerkChoice(this.getPerk())
  }

  explain(quest) {
    const perk = this.getPerk()
    return `${this.actor_name} loses access to the ${perk.rep()} perk`
  }
}
