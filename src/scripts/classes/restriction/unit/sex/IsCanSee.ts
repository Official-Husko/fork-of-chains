// @ts-nocheck

setup.qresImpl.IsCanSee = class IsCanSee extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.IsCanSee()`
  }

  explain() {
    return `Can see: not blocked by slave rule or by blindfold`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.isCanSee()
  }
}
