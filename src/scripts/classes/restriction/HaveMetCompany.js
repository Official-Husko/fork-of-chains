setup.qresImpl.HaveMetCompany = class HaveMetCompany extends setup.Restriction {
  /**
   * 
   * @param {setup.Company} company 
   */
  constructor(company) {
    super()

    this.company_key = setup.keyOrSelf(company)
  }

  text() {
    return `setup.qres.HaveMetCompany('${this.company_key}')`
  }

  isOk() {
    const company = State.variables.company[this.company_key]
    return State.variables.favor.isCompanyKnown(company)
  }

  explain() {
    const company = State.variables.company[this.company_key]
    return `Have met ${company.getName()}`
  }
}
