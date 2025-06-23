
/* Corrupt a unit, granting it either a random skin trait or a skin trait from a class */
setup.qcImpl.Corrupt = class Corrupt extends setup.Cost {
  /**
   * @param {string} actor_name 
   * @param {string} [trait_tag]
   * @param {number} [amount]
   */
  constructor(actor_name, trait_tag, amount) {
    super()

    if (trait_tag && !setup.TraitHelper.getAllTraitsOfTags([trait_tag]).length) {
      throw new Error(`Trait tag ${trait_tag} invalid for corruption.`)
    }

    this.actor_name = actor_name
    this.trait_tag = trait_tag || null
    this.amount = amount || 1
  }

  text() {
    return `setup.qc.Corrupt('${this.actor_name}', ${this.trait_tag}, ${this.amount})`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)
    for (let i = 0; i < this.amount; ++i) {
      const result = unit.corrupt(this.trait_tag)
      if (result) {
        // unit.addHistory(`got corrupted and gained ${result.rep()}.`, quest)
      }
    }
  }

  explain(quest) {
    return `corrupt ${this.actor_name}'s ${this.trait_tag || "random aspect"} ${this.amount} times`
  }
}
