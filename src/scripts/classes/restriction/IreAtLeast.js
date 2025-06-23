setup.qresImpl.IreAtLeast = class IreAtLeast extends setup.Restriction {
  /**
   * 
   * @param {setup.Company} company 
   * @param {number} ire_amt 
   */
  constructor(company, ire_amt) {
    super()

    this.company_key = setup.keyOrSelf(company)
    this.ire_amt = ire_amt
  }

  text() {
    return `setup.qres.IreAtLeast('${this.company_key}', ${this.ire_amt})`
  }

  isOk() {
    let company = State.variables.company[this.company_key]
    return State.variables.ire.getIre(company) >= this.ire_amt
  }

  explain() {
    let company = State.variables.company[this.company_key]
    return `Ire with ${company.rep()} at least ${setup.DOM.toString(setup.DOM.Text.dangerlite(this.ire_amt))}`
  }
}
