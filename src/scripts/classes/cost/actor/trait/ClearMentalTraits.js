setup.qcImpl.ClearMentalTraits = class ClearMentalTraits extends setup.Cost {
  /**
   * @param {string} actor_name 
   */
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.ClearMentalTraits('${this.actor_name}')`
  }

  apply(quest) {
    setup.qc.RemoveTraitsWithTag(this.actor_name, 'per')
    setup.qc.RemoveTraitsWithTag(this.actor_name, 'skill')
    setup.qc.RemoveTraitsWithTag(this.actor_name, 'bg')
    setup.qc.RemoveTraitsWithTag(this.actor_name, 'training')
    setup.qc.RemoveTraitsWithTag(this.actor_name, 'perk')
  }

  explain(quest) {
    return `${this.actor_name} loses all personality, skill, background, training, and perk traits`
  }
}
