setup.qresImpl.CanUseRememberedUnit = class CanUseRememberedUnit extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.CanUseRememberedUnit()`
  }

  explain() {
    return `Unit must be able to use remembered unit`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    const slave = setup.qresImpl.RememberUnit.getRememberedUnit()
    return slave.isUsableBy(unit)
  }
}
