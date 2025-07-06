// @ts-nocheck

setup.qcImpl.TraitAndMakeInnate = class TraitAndMakeInnate extends setup.Cost {
  /**
   * 
   * @param {string} actor_name 
   * @param {setup.Trait | null} trait 
   * @param {setup.TraitGroup} [trait_group]
   */
  constructor(actor_name, trait, trait_group) {
    super()

    this.actor_name = actor_name
    if (!trait && trait != null) throw new Error(`Missing trait for setup.qc.TraitAndMakeInnate(${actor_name})`)
    if (trait) {
      this.trait_key = trait.key
    } else {
      this.trait_key = null
    }
    if (trait_group) {
      this.trait_group_key = trait_group.key
    } else {
      this.trait_group_key = null
    }
  }

  text() {
    if (this.trait_key) {
      return `setup.qc.TraitAndMakeInnate('${this.actor_name}', setup.trait.${this.trait_key})`
    } else {
      return `setup.qc.TraitAndMakeInnate('${this.actor_name}', null, setup.traitgroup[${this.trait_group_key}])`
    }
  }


  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    let unit = quest.getActorUnit(this.actor_name)
    let trait_group = null
    if (this.trait_group_key) trait_group = setup.traitgroup[this.trait_group_key]
    let trait = null
    if (this.trait_key) trait = setup.trait[this.trait_key]
    if (!trait || unit.isTraitCompatible(trait)) {
      const added = unit.addTrait(trait, trait_group)
      if (added) unit.addHistory(`<<dangertext "permanently">> gained ${added.rep()}.`, quest)
      unit.makeInnateTrait(trait, trait_group)
    }
  }

  explain(quest) {
    if (this.trait_key) {
      return `${this.actor_name} permanently gain ${setup.trait[this.trait_key].rep()}`
    } else {
      return `${this.actor_name} permanently lose trait from class: ${setup.traitgroup[this.trait_group_key].getSmallestTrait().rep()}`
    }
  }
}
