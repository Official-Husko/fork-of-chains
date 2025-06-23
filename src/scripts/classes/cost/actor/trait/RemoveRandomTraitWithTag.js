
// remove all traits with a particular tag
setup.qcImpl.RemoveRandomTraitWithTag = class RemoveRandomTraitWithTag extends setup.Cost {
  constructor(actor_name, trait_tag) {
    super()

    this.actor_name = actor_name
    this.trait_tag = trait_tag
  }

  text() {
    return `setup.qc.RemoveRandomTraitWithTag('${this.actor_name}', '${this.trait_tag}')`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let traits = unit.getAllTraitsWithTag(this.trait_tag).filter(trait => unit.isHasRemovableTrait(trait))
    if (!traits.length) return
    let trait = setup.rng.choice(traits)
    return setup.qc.TraitRemove(this.actor_name, trait).apply(quest)
  }

  explain(quest) {
    return `${this.actor_name} loses a random ${this.trait_tag} trait`
  }
}
