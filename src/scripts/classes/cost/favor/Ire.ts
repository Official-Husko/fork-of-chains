// @ts-nocheck


setup.qcImpl.Ire = class Ire extends setup.Cost {
  /**
   * @param {setup.Company | string} company
   * @param {number} ire_amt
   */
  constructor(company, ire_amt) {
    super()

    this.company_key = setup.keyOrSelf(company)
    this.ire_amt = ire_amt
  }

  text() {
    return `setup.qc.Ire('${this.company_key}', ${this.ire_amt})`
  }

  /**
   * @returns {setup.Company}
   */
  getCompany() { return State.variables.company[this.company_key] }

  /**
   * @param {any} quest 
   */
  apply(quest) {
    const company = this.getCompany()
    const adjusted = State.variables.ire.adjustIre(company, this.ire_amt)
    let adj = ""
    const absadjusted = Math.abs(adjusted)
    if (absadjusted > 16) {
      adj = "a huge amount of"
    } else if (absadjusted > 12) {
      adj = "a large amount of"
    } else if (absadjusted > 8) {
      adj = "significant chunk of"
    } else if (absadjusted > 6) {
      adj = "good amount of"
    } else if (absadjusted > 4) {
      adj = "some"
    } else if (absadjusted > 2) {
      adj = "a little"
    } else if (absadjusted) {
      adj = "a tiny amount of"
    }
    if (adjusted > 0) {
      setup.notify(`Gain ${setup.DOM.toString(setup.DOM.Text.dangerlite(adj))} ire with ${company.rep()}`)
    } else if (adjusted < 0) {
      setup.notify(`Lose ${setup.DOM.toString(setup.DOM.Text.successlite(adj))} ire with ${company.rep()}`)
    }
  }

  explain() {
    const adjustment = this.ire_amt
    const company = this.getCompany()
    if (adjustment < 0) {
      return `Lose ${setup.DOM.toString(setup.DOM.Text.successlite(`${-adjustment}`))} ire with ${company.rep()}`
    } else {
      return `Gain ${setup.DOM.toString(setup.DOM.Text.dangerlite(`${adjustment}`))} ire with ${company.rep()}`
    }
  }
}
