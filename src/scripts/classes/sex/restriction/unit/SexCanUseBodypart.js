setup.qresImpl.SexCanUseBodypart = class SexCanUseBodypart extends setup.SexRestriction {
  /**
   * @param {setup.SexBodypart} bodypart
   */
  constructor(bodypart) {
    super()
    this.bodypart = bodypart
  }

  explain() {
    return `Can use ${this.bodypart.repsimple()}`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return this.sex.isCanUse(unit, this.bodypart)
  }
}


