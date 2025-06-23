
setup.qcImpl.Favor = class Favor extends setup.Cost {
  /**
   * @param {setup.Company | string} company
   * @param {number} favor_amt
   */
  constructor(company, favor_amt) {
    super()

    this.company_key = setup.keyOrSelf(company)
    this.favor_amt = favor_amt
  }

  text() {
    return `setup.qc.Favor('${this.company_key}', ${this.favor_amt})`
  }

  /**
   * @returns {setup.Company}
   */
  getCompany() { return State.variables.company[this.company_key] }

  isOk() {
    return State.variables.favor.getFavor(this.getCompany()) + this.favor_amt >= 0
  }

  /**
   * @param {any} quest 
   */
  apply(quest) {
    const company = this.getCompany()
    const adjusted = State.variables.favor.adjustFavor(company, this.favor_amt)
    if (adjusted > 0) {
      setup.notify(`Gained ${setup.DOM.toString(setup.DOM.Text.successlite((adjusted / 10).toFixed(1)))} favor with ${company.rep()}`)
    } else if (adjusted < 0) {
      setup.notify(`Lost ${setup.DOM.toString(setup.DOM.Text.dangerlite((-adjusted / 10).toFixed(1)))} favor with ${company.rep()}`)
    }
  }

  undoApply() {
    State.variables.favor.adjustFavor(this.getCompany(), -this.favor_amt)
  }

  explain() {
    const adjustment = this.favor_amt
    const company = this.getCompany()
    if (adjustment < 0) {
      return `Lose ${setup.DOM.toString(setup.DOM.Text.dangerlite((-adjustment / 10).toFixed(1)))} favor with ${company.rep()}`
    } else {
      return `Gain ${setup.DOM.toString(setup.DOM.Text.successlite((adjustment / 10).toFixed(1)))} favor with ${company.rep()}`
    }
  }
}
