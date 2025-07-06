// @ts-nocheck

/* Permanently corrupt a unit, granting it a random demonic skin trait that cannot be purified. Extremely small chance to misfire. */
setup.qcImpl.PermanentlyCorrupt = class PermanentlyCorrupt extends setup.Cost {
  /**
   * @param {string} actor_name 
   */
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.PermanentlyCorrupt('${this.actor_name}')`
  }

  apply(quest) {
    /** @type {setup.Unit} */
    const unit = quest.getActorUnit(this.actor_name)
    const result = unit.corruptPermanently()
    if (result) {
      unit.addHistory(`got permanently corrupted and gained ${result.rep()}.`, quest)
    }
  }

  explain(quest) {
    return `permanently corrupt ${this.actor_name}`
  }
}
