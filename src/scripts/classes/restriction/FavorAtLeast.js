setup.qresImpl.FavorAtLeast = class FavorAtLeast extends setup.Restriction {
  /**
   * 
   * @param {setup.Company} company 
   * @param {number} favor_amt 
   */
  constructor(company, favor_amt) {
    super()

    this.company_key = setup.keyOrSelf(company)
    this.favor_amt = favor_amt
  }

  text() {
    return `setup.qres.FavorAtLeast('${this.company_key}', ${this.favor_amt})`
  }

  isOk() {
    let company = State.variables.company[this.company_key]
    return State.variables.favor.getFavor(company) >= this.favor_amt
  }

  explain() {
    let company = State.variables.company[this.company_key]
    return `Favor with ${company.rep()} at least ${setup.DOM.toString(setup.DOM.Util.favor(this.favor_amt))}`
  }
}
