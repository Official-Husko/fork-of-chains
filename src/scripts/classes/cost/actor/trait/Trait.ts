// @ts-nocheck


setup.qcImpl.Trait = class Trait extends setup.Cost {
  constructor(actor_name, trait, trait_group) {
    super()

    this.actor_name = actor_name
    if (!trait && trait != null) throw new Error(`Missing trait for setup.qc.Trait(${actor_name})`)
    if (trait) {
      this.trait_key = setup.keyOrSelf(trait)
    } else {
      this.trait_key = null
    }
    if (trait_group) {
      this.trait_group_key = setup.keyOrSelf(trait_group)
    } else {
      this.trait_group_key = null
    }
  }

  text() {
    if (this.trait_key) {
      return `setup.qc.Trait('${this.actor_name}', setup.trait.${this.trait_key})`
    } else {
      return `setup.qc.Trait('${this.actor_name}', null, setup.traitgroup[${this.trait_group_key}])`
    }
  }


  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let trait_group = null
    if (this.trait_group_key) trait_group = setup.traitgroup[this.trait_group_key]
    let trait = null
    if (this.trait_key) trait = setup.trait[this.trait_key]
    if (!trait || unit.isTraitCompatible(trait)) {
      let added = unit.addTrait(trait, trait_group)
      if (added && unit.isHasTrait(added)) unit.addHistory(`gained ${added.rep()}.`, quest)
    }
  }

  explain(quest) {
    if (this.trait_key) {
      return `${this.actor_name} gain ${setup.trait[this.trait_key].rep()}`
    } else {
      return `${this.actor_name} lose trait from class: ${setup.traitgroup[this.trait_group_key].getSmallestTrait().rep()}`
    }
  }
}
