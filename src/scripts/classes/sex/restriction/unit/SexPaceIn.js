setup.qresImpl.SexPaceIn = class SexPaceIn extends setup.SexRestriction {
  /**
   * @param {setup.SexPace[]} paces
   */
  constructor(paces) {
    super()
    this.paces = paces
  }

  explain() {
    return `Pace: ${this.paces.map(pace => pace.rep()).join(', ')}`
  }

  isOk(unit) {
    return this.paces.includes(this.sex.getPace(unit))
  }
}


