// @ts-nocheck

setup.qresImpl.WeeksWithCompanyAtMost = class WeeksWithCompanyAtMost extends setup.Restriction {
  /**
   * @param {number} weeks 
   */
  constructor(weeks) {
    super()

    this.weeks = weeks
  }

  text() {
    return `setup.qres.WeeksWithCompanyAtMost(${this.weeks})`
  }

  explain() {
    return `Unit has been with your company for at most ${this.weeks} weeks`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.getWeeksWithCompany() <= this.weeks
  }
}
