// @ts-nocheck


setup.qresImpl.NoTrait = class NoTrait extends setup.Restriction {
  /**
   * @param {setup.Trait | string} trait 
   */
  constructor(trait) {
    super()

    this.trait_key = setup.keyOrSelf(trait)
  }

  text() {
    return `setup.qres.NoTrait(setup.trait.${this.trait_key})`
  }


  explain() {
    let trait = setup.trait[this.trait_key]
    let cover = [trait]
    if (trait.getTraitGroup()) {
      cover = trait.getTraitGroup().getTraitCover(setup.trait[this.trait_key])
    }
    let text = ''
    for (let i = 0; i < cover.length; ++i) {
      text += cover[i].repNegative()
    }
    return text
  }

  isOk(unit) {
    let trait = setup.trait[this.trait_key]
    return !unit.isHasTrait(trait)
  }
}
