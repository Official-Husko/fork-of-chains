// @ts-nocheck


setup.qresImpl.Job = class Job extends setup.Restriction {
  constructor(job) {
    super()
    if (!job) throw new Error(`Missing job for qres.Job`)

    this.job_key = job.key
  }

  text() {
    return `setup.qres.Job(setup.job.${this.job_key})`
  }

  explain() {
    return `${setup.job[this.job_key].rep()}`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    // case one: unit already has the job
    if (unit.getJob().key == this.job_key) return true

    // case two: unit is a free unit in market of that particular job
    if (!unit.isYourCompany()) {
      const market = unit.getMarket()
      if (market && market.getJob().key == this.job_key) {
        const market_object = market.getMarketObject(unit)
        if (market_object && !market_object.getPrice()) {
          // Unit is being sold for free in the market.
          return true
        }
      }
    }

    return false
  }
}
