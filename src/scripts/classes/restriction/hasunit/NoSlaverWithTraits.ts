// @ts-nocheck


setup.qresImpl.NoSlaverWithTraits = class NoSlaverWithTraits extends setup.Restriction {
  constructor(traits) {
    super()

    if (!Array.isArray(traits)) throw new Error(`array traits for no slaver with trait is not an array but ${traits}`)
    this.trait_keys = []
    for (let i = 0; i < traits.length; ++i) {
      if (!traits[i].key) throw new Error(`NoSlaverWithTraits: ${i}-th trait is missing`)
      this.trait_keys.push(traits[i].key)
    }
  }

  static NAME = 'None of your slavers have ALL these specific traits'
  static PASSAGE = 'RestrictionNoSlaverWithTraits'

  text() {
    let res = []
    for (let i = 0; i < this.trait_keys.length; ++i) {
      res.push(`setup.trait.${this.trait_keys[i]}`)
    }
    return `setup.qres.NoSlaverWithTraits([${res.join(', ')}])`
  }




  getTraits() {
    let result = []
    for (let i = 0; i < this.trait_keys.length; ++i) {
      result.push(setup.trait[this.trait_keys[i]])
    }
    return result
  }

  explain() {
    let base = `No slaver with ALL these traits:`
    let traits = this.getTraits()
    for (let i = 0; i < traits.length; ++i) {
      base += traits[i].rep()
    }
    return base
  }

  isOk() {
    let units = State.variables.company.player.getUnits({job: setup.job.slaver})
    let traits = this.getTraits()
    for (let i = 0; i < units.length; ++i) {
      let ok = true
      for (let j = 0; j < traits.length; ++j) {
        if (!units[i].isHasTrait(traits[j])) {
          ok = false
          break
        }
      }
      if (ok) return false
    }
    return true
  }
}
