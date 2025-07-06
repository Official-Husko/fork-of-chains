// @ts-nocheck


/**
 * Increase ire of three other companies outside of the spreader.
 */
setup.qcImpl.IreSpread = class IreSpread extends setup.Cost {
  /**
   * @param {setup.Company | string} company 
   */
  constructor(company) {
    super()
    this.company_key = setup.keyOrSelf(company)
  }

  text() {
    return `setup.qc.IreSpread('${this.company_key}')`
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

    setup.rng.shuffleArray(companies)

    let limit = 3
    if (this.company_key == 'royal') {
      // royal gets extra
      limit += 1
    }
    for (let i = 0; i < limit; ++i) {
      if (companies.length <= i) break
      setup.qc.Ire(companies[i], 10).apply(quest);
    }
  }

  /**
   * @param {*} quest 
   */
  explain(quest) {
    return `Gain ire with three other companies except ${State.variables.company[this.company_key].rep()}`
  }
}
