// @ts-nocheck

/**
 * Tracks the amount of ire your company has with all other entities out there.
 * @extends setup.TwineClass
 */
setup.Ire = class Ire extends setup.TwineClass {
  constructor() {
    super()

    /**
     * company_key: ire amount
     * @type {object}
     */
    this.company_ire_map = {}
  }

  /**
   * ire with company += ire
   * @param {setup.Company} company
   * @param {number} ire
   */
  adjustIre(company, ire) {
    if (!(company.key in this.company_ire_map)) {
      this.company_ire_map[company.key] = 0
    }

    const init_ire = this.company_ire_map[company.key]

    this.company_ire_map[company.key] += ire

    this.company_ire_map[company.key] = Math.max(
      this.company_ire_map[company.key],
      0)

    const final_ire = this.company_ire_map[company.key]

    return final_ire - init_ire
  }


  /**
   * @param {setup.Company} company
   */
  getIre(company) {
    if (!(company.key in this.company_ire_map)) return 0
    return this.company_ire_map[company.key]
  }

  /**
   * Get a description of the companys "ire rating" towards you
   * @param {setup.Company} company 
   * @returns {string}
   */
  getIreDisplay(company) {
    const ire = this.getIre(company)
    if (ire == 0) {
      return setup.DOM.toString(setup.DOM.Text.success('No grievances'))
    } else if (ire < 4) {
      return setup.DOM.toString(setup.DOM.Text.successlite('Very few grievances'))
    } else if (ire < 8) {
      return `Have disagreements with your company`
    } else if (ire < 12) {
      return setup.DOM.toString(setup.DOM.Text.dangerlite('Bears a grudge against your company'))
    } else if (ire < 16) {
      return setup.DOM.toString(setup.DOM.Text.dangerlite('Vengeful against your company'))
    } else if (ire < 20) {
      return setup.DOM.toString(setup.DOM.Text.danger('Almost at a breaking point! Get ready for retaliation'))
    } else {
      return setup.DOM.toString(setup.DOM.Text.danger('To Arms! This company will sabotage you very soon'))
    }
  }

  /**
   * Whether your company has ever interacted with this company.
   * Should only be called by $favor.isCompanyKnown
   * @param {setup.Company} company
   */
  _isCompanyKnown(company) {
    return company.key in this.company_ire_map
  }
}
