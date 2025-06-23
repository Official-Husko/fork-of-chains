setup.qcImpl.TraitReplaceExisting = class TraitReplaceExisting extends setup.Cost {
  /**
   * @param {string} actor_name 
   * @param {setup.Trait | string} raw_trait 
   */
  constructor(actor_name, raw_trait) {
    super()

    // replace trait into the given trait if the unit has some variation of it earlier.

    this.actor_name = actor_name
  
    const trait = setup.selfOrObject(raw_trait, setup.trait)
    if (!trait.getTraitGroup()) throw new Error(`Trait ${trait.key} does not have a trait group and cannot be decreased`)
    this.trait_key = trait.key
  }

  text() {
    return `setup.qc.TraitReplaceExisting('${this.actor_name}', setup.trait.${this.trait_key})`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let trait = setup.trait[this.trait_key]
    let trait_group = trait.getTraitGroup()
    let lowest_trait = trait_group.getSmallestTrait()
    if (unit.isHasRemovableTrait(lowest_trait, /* include cover = */ true)) {
      setup.qc.TraitReplace(this.actor_name, trait).apply(quest)
    }
  }

  explain(quest) {
    return `${this.actor_name}'s trait (if any) is replaced with ${setup.trait[this.trait_key].rep()}`
  }
}
