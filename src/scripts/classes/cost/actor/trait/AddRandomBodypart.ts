// @ts-nocheck


setup.qcImpl.AddRandomBodypart = class AddRandomBodypart extends setup.Cost {
  constructor(actor_name, allow_demonic) {
    super()

    this.actor_name = actor_name
    this.allow_demonic = allow_demonic
  }

  text() {
    return `setup.qc.AddRandomBodypart('${this.actor_name}', ${this.allow_demonic})`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let traits = setup.TraitHelper.getAllTraitsOfTags(['skin'])
    if (!unit.isHasDick()) traits = traits.filter(a => !a.isNeedDick())
    if (!unit.isHasVagina()) traits = traits.filter(a => !a.isNeedVagina())
    if (!this.allow_demonic) traits = traits.filter(a => !a.isCorruption())
    traits = traits.filter(a => !unit.isHasRemovableTrait(a))
  
    if (traits.length) {
      let trait = setup.rng.choice(traits)
  
      return setup.qc.TraitReplace(this.actor_name, trait).apply(quest)
    }
  }

  explain(quest) {
    if (this.allow_demonic) {
      return `${this.actor_name} gains a random bodypart (can be demonic)`
    } else {
      return `${this.actor_name} gains a random non-demonic bodypart`
    }
  }
}
