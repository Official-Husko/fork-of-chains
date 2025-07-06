// @ts-nocheck


setup.MarketUnit = class MarketUnit extends setup.Market {
  constructor(key, name, varname, job) {
    super(key, name, varname)
    this.job_key = job.key
  }

  getJob() { return setup.job[this.job_key] }

  isCanBuyObjectOther(market_object) {
    if (!State.variables.company.player.isCanAddUnitWithJob(this.getJob())) return false
    return true
  }

  /**
   * @param {setup.MarketObject} market_object 
   */
  doAddObject(market_object) {
    /**
     * @type {setup.Unit}
     */
    const unit = market_object.getObject()
    State.variables.company.player.addUnit(unit, this.getJob())
    const source = market_object.repSource()
    if (!unit.getWeeksWithCompany() && source) {
      unit.addHistory(`originated from: ${source}.`)
    }
  }
}
