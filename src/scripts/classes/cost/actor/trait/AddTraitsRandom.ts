// @ts-nocheck


// adds x random traits out of these. If is guaranteed, then guaranteed to gain them (avoid matching ones)
setup.qcImpl.AddTraitsRandom = class AddTraitsRandom extends setup.Cost {
  constructor(actor_name, traits, no_of_traits, is_replace, is_guaranteed) {
    super()

    this.actor_name = actor_name
    if (!Array.isArray(traits)) throw new Error(`Trait array must be array`)
    if (no_of_traits > traits.length) throw new Error(`Too few traits: ${traits.length} vs ${no_of_traits}`)
    this.trait_keys = traits.map(a => a.key)
    this.no_of_traits = no_of_traits
    this.is_replace = is_replace
    this.is_guaranteed = is_guaranteed
  }

  text() {
    let texts = this.trait_keys.map(a => `setup.trait.${a}`)
    return `setup.qc.AddTraitsRandom('${this.actor_name}', [${texts.join(', ')}], ${this.no_of_traits}, ${this.is_replace}, ${this.is_guaranteed})`
  }

  getTraits() {
    return this.trait_keys.map(a => setup.trait[a])
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let traits = this.getTraits()

    if (this.is_guaranteed) {
      if (this.is_replace) {
        traits = traits.filter(trait => !unit.isHasRemovableTrait(trait))
      } else {
        traits = traits.filter(trait => !unit.isHasRemovableTrait(trait, /* include cover = */ true))
      }
    }

    setup.rng.shuffleArray(traits)
    for (let i = 0; i < Math.min(this.no_of_traits, traits.length); ++i) {
      let traitclass
      if (this.is_replace) {
        traitclass = setup.qc.TraitReplace
      } else {
        traitclass = setup.qc.Trait
      }
      traitclass('unit', traits[i]).apply(setup.costUnitHelper(unit))
    }
  }

  explain(quest) {
    let trait_strs = this.getTraits().map(a => a.rep())
    let verb = `gains ${this.no_of_traits} random traits from`
    if (this.is_replace) verb = `${verb} (exact)`
    if (this.is_guaranteed) verb = `${verb} (guaranteed)`
  
    return `${this.actor_name} ${verb} ${trait_strs.join('')}`
  }
}
