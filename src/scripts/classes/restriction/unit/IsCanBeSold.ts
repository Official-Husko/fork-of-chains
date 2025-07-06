// @ts-nocheck

setup.qresImpl.IsCanBeSold = class IsCanBeSold extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.IsCanBeSold()`
  }

  explain() {
    return `Can be sold and not in a party`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return !unit.getParty()
  }
}
