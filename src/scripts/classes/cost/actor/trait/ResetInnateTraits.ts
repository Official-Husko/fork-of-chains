// @ts-nocheck

setup.qcImpl.ResetInnateTraits = class ResetInnateTraits extends setup.Cost {
  /**
   * @param {string} actor_name 
   */
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.ResetInnateTraits('${this.actor_name}')`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    let unit = quest.getActorUnit(this.actor_name)
    unit.resetInnateTraits()
  }

  explain(quest) {
    return `${this.actor_name} gains all the current skin traits as their innate traits`
  }
}
