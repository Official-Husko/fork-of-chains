
setup.qresImpl.HasSlaveWithTraits = class HasSlaveWithTraits extends setup.Restriction {
  constructor(traits) {
    super()

    if (!Array.isArray(traits)) throw new Error(`array traits for has slave with trait is not an array but ${traits}`)
    this.trait_keys = []
    for (let i = 0; i < traits.length; ++i) {
      if (!traits[i].key) throw new Error(`HasSlaveWithTraits: ${i}-th trait is missing`)
      this.trait_keys.push(traits[i].key)
    }
  }

  static NAME = 'Have at least one slave with specific traits'
  static PASSAGE = 'RestrictionHasSlaveWithTraits'

  text() {
    let res = []
    for (let i = 0; i < this.trait_keys.length; ++i) {
      res.push(`setup.trait.${this.trait_keys[i]}`)
    }
    return `setup.qres.HasSlaveWithTraits([${res.join(', ')}])`
  }


  getTraits() {
    let result = []
    for (let i = 0; i < this.trait_keys.length; ++i) {
      result.push(setup.trait[this.trait_keys[i]])
    }
    return result
  }

  explain() {
    let base = `Has slave with traits:`
    let traits = this.getTraits()
    for (let i = 0; i < traits.length; ++i) {
      base += traits[i].rep()
    }
    return base
  }

  isOk() {
    let units = State.variables.company.player.getUnits({job: setup.job.slave})
    let traits = this.getTraits()
    for (let i = 0; i < units.length; ++i) {
      let ok = true
      for (let j = 0; j < traits.length; ++j) {
        if (!units[i].isHasTrait(traits[j])) {
          ok = false
          break
        }
      }
      if (ok) return true
    }
    return false
  }
}
