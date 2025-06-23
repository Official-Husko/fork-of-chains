setup.CompanyTemplate = class CompanyTemplate extends setup.TwineClass {
  /**
   * @param {string} key
   * @param {string} name
   * 
   * @param {string} description_passage
   * 
   * What happens during the end of the week when your favor with this company is high enough
   * Should have the same number of elements with setup.FAVOR_EFFECT_THRESHOLDS
   * @param {array} favor_effects
   */
  constructor(key, name, description_passage, favor_effects,) {
    super()

    if (favor_effects.length != setup.FAVOR_EFFECT_THRESHOLDS.length)
      throw new Error(`${key} company favor effect has incorrect length of ${favor_effects.length}`)

    this.key = key
    this.name = name
    this.favor_effects = favor_effects
    this.description_passage = description_passage

    if (!(key in setup.companytemplate) ) {
      setup.companytemplate[key] = this
    }
  }

  getName() { return this.name }

  getFavorEffects() { return this.favor_effects }

  getDescriptionPassage() { return this.description_passage }

}
