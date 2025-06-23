
setup.Speech = class Speech extends setup.TwineClass {
  constructor(key, name, description, traits) {
    super()
    
    if (!key) throw new Error(`null key for speech`)
    this.key = key

    if (!name) throw new Error(`null name for speech ${key}`)
    this.name = name

    if (!description) throw new Error(`null description for speech ${key}`)
    this.description = description

    this.trait_keys = []
    for (let i = 0; i < traits.length; ++i) {
      this.trait_keys.push(traits[i].key)
    }

    if (key in setup.speech) throw new Error(`Speech ${key} duplicated`)
    setup.speech[key] = this
  }

  getDescription() { return this.description }
  getName() { return this.name }

  /**
   * @param {setup.Unit} unit 
   * @returns {number}
   */
  computeScore(unit) {
    let score = 0
    for (let i = 0; i < this.trait_keys.length; ++i) {
      let trait = setup.trait[this.trait_keys[i]]
      if (unit.isHasTraitExact(trait)) ++score
    }
    return score
  }

  getAdverbs() {
    return setup.SPEECH_ADVERBS[this.key]
  }

  rep() {
    return this.getName()
  }

}
