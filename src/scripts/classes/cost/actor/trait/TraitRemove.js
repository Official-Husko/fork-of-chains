
// exact removes a trait
setup.qcImpl.TraitRemove = class TraitRemove extends setup.Cost {
  constructor(actor_name, trait) {
    super()

    this.actor_name = actor_name
    if (!trait) throw new Error(`Missing trait for setup.qc.TraitRemove(${actor_name})`)
    this.trait_key = setup.keyOrSelf(trait)
  }

  static NAME = 'Remove exact trait'
  static PASSAGE = 'CostTraitRemove'
  static UNIT = true

  text() {
    return `setup.qc.TraitRemove('${this.actor_name}', setup.trait.${this.trait_key})`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let trait = setup.trait[this.trait_key]
    if (!unit.isHasRemovableTrait(trait)) return
    unit.removeTraitExact(trait)
    if (unit.isYourCompany()) {
      setup.notify(`a|Rep a|lose ${trait.rep()}`, { a: unit })
    }
  }

  explain(quest) {
    return `${this.actor_name} loses ${setup.trait[this.trait_key].rep()}`
  }
}
