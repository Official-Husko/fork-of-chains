// @ts-nocheck


setup.qcImpl.TraitReplace = class TraitReplace extends setup.Cost {
  constructor(actor_name, trait, trait_group) {
    super()

    this.actor_name = actor_name

    if (!trait && trait != null) throw new Error(`Missing trait for setup.qc.TraitReplace(${actor_name})`)

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
    if (!trait && !trait_group) throw new Error(`TraitReplace must have either trait or traitgroup`)
  }

  text() {
    if (this.trait_key) {
      return `setup.qc.TraitReplace('${this.actor_name}', setup.trait.${this.trait_key})`
    } else {
      return `setup.qc.TraitReplace('${this.actor_name}', null, setup.traitgroup[${this.trait_group_key}])`
    }
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    if (!unit) throw new Error(`Missing actor ${this.actor_name} from quest`)
    let trait_group = null
    if (this.trait_group_key) trait_group = setup.traitgroup[this.trait_group_key]
    let trait = null
    if (this.trait_key) trait = setup.trait[this.trait_key]
    if (!trait || unit.isTraitCompatible(trait)) {
      let added = unit.addTrait(trait, trait_group, /* is_repalce = */ true)
      if (added && unit.isHasTrait(added)) unit.addHistory(`gained ${added.rep()}.`, quest)
    }
  }

  explain(quest) {
    return `${this.actor_name} FORCEFULLY gain ${setup.trait[this.trait_key].rep()}`
  }
}
