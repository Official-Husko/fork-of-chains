// @ts-nocheck

/* Swap magic with another random one */
setup.qcImpl.WildMagic = class WildMagic extends setup.Cost {
  constructor(actor_name) {
    super()

    this.actor_name = actor_name
  }

  text() {
    return `setup.qc.WildMagic('${this.actor_name}')`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)
    const magic = unit.getRemovableTraits().filter(trait => trait.getTags().includes('magic'))
    if (magic.length) {
      const remove = setup.rng.choice(magic)
      const other = setup.TraitHelper.getAllTraitsOfTags(['magicbasic']).filter(trait => !unit.isHasTrait(trait))
      /**
       * @type {setup.Trait}
       */
      const add = setup.rng.choice(other)
      setup.qc.TraitRemove(this.actor_name, remove).apply(quest)
      let candidate
      if (remove.getTags().includes('magicmaster')) {
        candidate = add.getTraitGroup().getLargestTrait()
      } else {
        candidate = add
      }
      setup.qc.TraitReplace(this.actor_name, candidate).apply(quest)
    }
  }

  explain(quest) {
    return `${this.actor_name} swaps one of their magic with a random one`
  }
}
