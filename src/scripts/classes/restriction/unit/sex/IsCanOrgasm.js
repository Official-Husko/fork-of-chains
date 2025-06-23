setup.qresImpl.IsCanOrgasm = class IsCanOrgasm extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.IsCanOrgasm()`
  }

  explain() {
    return `Can orgasm: not blocked by slave rule or by chastity`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.isCanOrgasm()
  }
}
