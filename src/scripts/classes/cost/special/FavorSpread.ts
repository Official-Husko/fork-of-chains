// @ts-nocheck

/**
 * Increase favor of one other company at random.
 */
setup.qcImpl.FavorSpread = class FavorSpread extends setup.Cost {
  /**
   * @param {setup.Company | string} company   // excluded company
   * @param {number} amount   // amount of gained favor
   */
  constructor(company, amount) {
    super()
    this.company_key = setup.keyOrSelf(company)
    this.amount = amount
  }

  text() {
    return `setup.qc.FavorSpread('${this.company_key}', ${this.amount})`
  }

  /**
   * @param {any} quest 
   */
  apply(quest) {
    const companies = []
    for (const companykey in State.variables.company) {
      const company = State.variables.company[companykey]

      if (!State.variables.favor.isCompanyKnown(company)) continue

      if (company == State.variables.company.player) continue

      // cannot be the same with spreader
      if (company.key == this.company_key) continue

      companies.push(company)
    }

    const chosen = setup.rng.choice(companies)
    setup.qc.Favor(chosen, this.amount).apply(quest)
  }

  /**
   * @param {*} quest 
   */
  explain(quest) {
    return `Gain ${this.amount} favor with a random company except ${State.variables.company[this.company_key].rep()}`
  }
}
