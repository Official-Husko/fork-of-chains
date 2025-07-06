// @ts-nocheck


setup.qresImpl.AllTraits = class AllTraits extends setup.Restriction {
  constructor(traits, is_exact) {
    super()

    this.trait_keys = traits.map(trait => setup.keyOrSelf(trait))
    this.is_exact = is_exact
  }

  text() {
    let trait_texts = this.trait_keys.map(a => `setup.trait.${a}`)
    return `setup.qres.AllTraits([${trait_texts.join(', ')}], ${this.is_exact})`
  }

  explain() {
    let traittext = []
    for (let i = 0; i < this.trait_keys.length; ++i) {
      let trait = setup.trait[this.trait_keys[i]]
      if (this.is_exact) {
        traittext.push(trait.rep())
      } else {
        let cover = trait.getTraitCover()
        traittext.push(`(${cover.map(a => a.rep()).join(' or ')})`)
      }
    }
    return traittext.join('')
  }

  isOk(unit) {
    let traits = unit.getTraits()
    for (let i = 0; i < this.trait_keys.length; ++i) {
      let trait_key = this.trait_keys[i]
      if (this.is_exact) {
        if (!traits.includes(setup.trait[trait_key])) return false
      } else {
        if (!unit.isHasTrait(setup.trait[trait_key])) return false
      }
    }
    return true
  }

}

