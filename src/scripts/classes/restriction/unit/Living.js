
setup.qresImpl.Living = class Living extends setup.Restriction {
  /**
   * @param {setup.Living} living 
   */
  constructor(living) {
    super()
    this.living_key = setup.keyOrSelf(living)
  }

  text() {
    return `setup.qres.Living(setup.living.${this.living_key})`
  }

  getLiving() { return setup.living[this.living_key] }

  explain() {
    return `Unit is retired and has the following living: ${this.getLiving().rep()}`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.getLiving() == this.getLiving()
  }
}
