setup.qcImpl.UnitValueToFavor = class UnitValueToFavor extends setup.Cost {
  /**
   * @param {setup.Company | string} company
   * @param {number} favor_per_value
   * @param {number} favor_per_crit
   */
  constructor(company, favor_per_value, favor_per_crit) {
    super()
    this.company_key = setup.keyOrSelf(company)
    this.favor_per_value = favor_per_value
    this.favor_per_crit = favor_per_crit
  }

  text() {
    return `setup.qc.UnitValueToFavor('${this.company_key}', ${this.favor_per_value}, ${this.favor_per_crit})`
  }

  /**
   * @returns {setup.Company}
   */
  getCompany() { return State.variables.company[this.company_key] }

  explain() {
    const fpv = this.favor_per_value
    const fpc = this.favor_per_crit
    return `Favor with ${this.getCompany().rep()} = value * ${fpv} + crit * ${fpc}`
  }

  /**
   * @param {setup.SlaveOrder} slave_order 
   */
  apply(slave_order) {
    const unit = slave_order.getUnit()
    const criteria = slave_order.getCriteria()
    const mods = criteria.computeSuccessModifiers(unit, /* ignore extra traits = */ true)

    let favor = unit.getSlaveValue() * this.favor_per_value

    favor += mods.crit * this.favor_per_crit
    favor -= mods.disaster * this.favor_per_crit

    setup.qc.Favor(this.getCompany(), Math.round(favor)).apply()
  }
}

setup.SlaveOrderAddonImpl.UnitValueToFavor = class UnitValueToFavor extends setup.SlaveOrderAddonBase {
  /**
   * @param {setup.Company | string} company
   * @param {number} favor_per_value
   * @param {number} favor_per_crit
   */
  constructor(company, favor_per_value, favor_per_crit) {
    super()

    this.company_key = setup.keyOrSelf(company)
    this.favor_per_value = favor_per_value
    this.favor_per_crit = favor_per_crit
  }

  text() {
    return `setup.SlaveOrderAddon.UnitValueToFavor('${this.company_key}', ${this.favor_per_value}, ${this.favor_per_crit})`
  }

  /**
   * @returns {setup.Company}
   */
  getCompany() { return State.variables.company[this.company_key] }

  explain() {
    return `Gain favor with ${this.getCompany().rep()} equal to:
      Unit value * ${this.favor_per_value} +
      Crit traits * ${this.favor_per_crit}`
  }

  /**
   * @param {setup.SlaveOrder} slave_order 
   */
  apply(slave_order) {
    slave_order.fulfilled_outcomes.push(setup.qc.UnitValueToFavor(
      this.getCompany(), this.favor_per_value, this.favor_per_crit
    ))
  }

}
