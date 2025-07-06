// @ts-nocheck

// levels up this unit.
setup.qcImpl.PerkChaoticPersonality = class PerkChaoticPersonality extends setup.Cost {
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.PerkChaoticPersonality('${this.actor_name}')`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)
    if (unit.isHome()) {
      setup.notify(`a|Rep a|switch personalities`, { a: unit })
      /**
       * @type {setup.Trait[]}
       */
      const personalities = unit.getAllTraitsWithTag('per')
      for (const per of personalities) {
        const trait_group = per.getTraitGroup()
        if (trait_group) {
          const other_traits = trait_group.getTraits().filter(trait => trait)
          if (other_traits.length == 2) {
            for (const other_trait of other_traits) {
              if (other_trait && other_trait != per) {
                // switch to this
                unit.addTrait(other_trait, null, /* replace = */ true)
                break
              }
            }
          }
        }
      }
    }
  }

  explain(quest) {
    return `${this.actor_name} reverse their personalities`
  }
}
