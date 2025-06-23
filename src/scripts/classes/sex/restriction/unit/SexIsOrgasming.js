setup.qresImpl.SexIsOrgasming = class SexIsOrgasming extends setup.SexRestriction {
  constructor() {
    super()
  }

  explain() {
    return `About to climax`
  }

  /**
   * @param {setup.Unit} unit
   */
  isOk(unit) {
    return this.sex.isOrgasming(unit)
  }
}


