// @ts-nocheck

setup.qcImpl.FavorUnitValue = class FavorUnitValue extends setup.Cost {
  /**
   * @param {string} actor_name
   * @param {setup.Company | string} company
   * @param {number} favor_per_value
   */
  constructor(actor_name, company, favor_per_value) {
    super()
    this.actor_name = actor_name
    this.company_key = setup.keyOrSelf(company)
    this.favor_per_value = favor_per_value
  }

  text() {
    return `setup.qc.FavorUnitValue('${this.actor_name}', '${this.company_key}', ${this.favor_per_value})`
  }

  /**
   * @returns {setup.Company}
   */
  getCompany() { return State.variables.company[this.company_key] }

  explain() {
    const fpv = this.favor_per_value
    return `Gain favor with ${this.getCompany().rep()} equals ${this.actor_name}'s value times ${fpv}`
  }

  apply(quest) {
    const unit = quest.getActorUnit(this.actor_name)
    const favor = unit.getSlaveValue() * this.favor_per_value
    setup.qc.Favor(this.getCompany(), Math.round(favor)).apply()
  }
}
