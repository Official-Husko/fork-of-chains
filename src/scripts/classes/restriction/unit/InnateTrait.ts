// @ts-nocheck

setup.qresImpl.InnateTrait = class InnateTrait extends setup.Restriction {
  /**
   * 
   * @param {setup.Trait} trait 
   */
  constructor(trait) {
    super()
    this.trait_key = setup.keyOrSelf(trait)
  }

  text() {
    return `setup.qres.InnateTrait(setup.trait.${this.trait_key})`
  }

  explain() {
    return `Innate: ${setup.trait[this.trait_key].rep()}`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.isHasInnateTrait(setup.trait[this.trait_key])
  }
}
