// @ts-nocheck


setup.qcImpl.TraitDecrease = class TraitDecrease extends setup.Cost {
  constructor(actor_name, trait) {
    super()

    // decrease trait into the given trait.

    this.actor_name = actor_name

    if (!trait && trait != null) throw new Error(`Missing trait for setup.qc.TraitDecrease(${actor_name})`)
    if (!trait.getTraitGroup()) throw new Error(`Trait ${trait.key} does not have a trait group and cannot be decreased`)
    this.trait_key = trait.key
  }

  static NAME = 'Decrease Trait Level'
  static PASSAGE = 'CostTraitDecrease'
  static UNIT = true

  text() {
    return `setup.qc.TraitDecrease('${this.actor_name}', setup.trait.${this.trait_key})`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    let unit = quest.getActorUnit(this.actor_name)
    let trait = setup.trait[this.trait_key]
    let trait_group = trait.getTraitGroup()
    if (unit.isHasRemovableTrait(trait, /* include cover = */ true) && !unit.isHasRemovableTrait(trait)) {
      let added = unit.decreaseTrait(trait_group)
      if (added) unit.addHistory(`gained ${added.rep()}.`, quest)
    }
  }

  explain(quest) {
    return `${this.actor_name}'s trait decreases to max ${setup.trait[this.trait_key].rep()}`
  }
}
