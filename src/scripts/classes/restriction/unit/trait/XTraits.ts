// @ts-nocheck

setup.qresImpl.XTraits = class XTraits extends setup.Restriction {
  constructor(traits, minimum) {
    super()

    this.trait_keys = traits.map(trait => setup.keyOrSelf(trait))
    this.minimum = minimum
    if (this.minimum <= 0) throw new Error(`Minimum cannot be negative`)
    if (this.minimum > traits.length) throw new Error(`Minimum cannot be larger than number of traits`)
  }

  getTraits() {
    return this.trait_keys.map(key => setup.trait[key])
  }

  text() {
    const trait_texts = this.trait_keys.map(a => `setup.trait.${a}`)
    return `setup.qres.XTraits([${trait_texts.join(', ')}], ${this.minimum})`
  }

  explain() {
    const traittext = this.getTraits().map(trait => trait.rep()).join('')
    return `At least ${this.minimum} of ${traittext}`
  }

  isOk(unit) {
    let hits = 0
    for (const trait of this.getTraits()) {
      if (unit.isHasTraitExact(trait)) {
        hits += 1
      }
    }
    return hits >= this.minimum
  }

}

