setup.qresImpl.AllowLovers = class AllowLovers extends setup.Restriction {
  /**
   * @param {setup.Trait | string} gender1 
   * @param {setup.Trait | string} gender2 
   */
  constructor(gender1, gender2) {
    super()
    this.gender1_key = setup.keyOrSelf(gender1)
    this.gender2_key = setup.keyOrSelf(gender2)
  }

  /**
   * @returns {setup.Trait[]}
   */
  getGenders() {
    return [setup.trait[this.gender1_key], setup.trait[this.gender2_key]]
  }

  text() {
    return `setup.qres.AllowLovers('${this.gender1_key}', '${this.gender2_key}')`
  }

  explain() {
    const genders = this.getGenders()
    return `Settings allow ${genders[0].rep()} to love ${genders[1].rep()}`
  }

  isOk(quest) {
    const genders = this.getGenders()
    return State.variables.settings.isCanBecomeLovers(genders[0], genders[1])
  }
}
