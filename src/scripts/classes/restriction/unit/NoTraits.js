
setup.qresImpl.NoTraits = class NoTraits extends setup.Restriction {
  constructor(traits, is_exact) {
    super()

    this.trait_keys = []
    for (let i = 0; i < traits.length; ++i) {
      let trait = traits[i]
      this.trait_keys.push(trait.key)
    }
  
    this.is_exact = is_exact
  }

  text() {
    let trait_texts = this.trait_keys.map(a => `setup.trait.${a}`)
    return `setup.qres.NoTraits([${trait_texts.join(', ')}], ${this.is_exact})`
  }

  explain() {
    let traittext = []
    for (let i = 0; i < this.trait_keys.length; ++i) {
      let trait = setup.trait[this.trait_keys[i]]
      if (this.is_exact) {
        traittext.push(trait.repNegative())
      } else {
        let cover = trait.getTraitCover()
        for (let j = 0; j < cover.length; ++j) {
          traittext.push(cover[j].repNegative())
        }
      }
    }
    return traittext.join('')
  }

  isOk(unit) {
    let traits = unit.getTraits()
    for (let i = 0; i < this.trait_keys.length; ++i) {
      let trait_key = this.trait_keys[i]
      if (this.is_exact) {
        if (traits.includes(setup.trait[trait_key])) return false
      } else {
        if (unit.isHasTrait(setup.trait[trait_key])) return false
      }
    }
    return true
  }
}
