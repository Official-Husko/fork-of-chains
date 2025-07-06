// @ts-nocheck

setup.qresImpl.WeeksWithCompanyAtLeast = class WeeksWithCompanyAtLeast extends setup.Restriction {
  /**
   * @param {number} weeks 
   */
  constructor(weeks) {
    super()

    this.weeks = weeks
  }

  text() {
    return `setup.qres.WeeksWithCompanyAtLeast(${this.weeks})`
  }

  explain() {
    return `Unit has been with your company for at least ${this.weeks} weeks`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.getWeeksWithCompany() >= this.weeks
  }
}
