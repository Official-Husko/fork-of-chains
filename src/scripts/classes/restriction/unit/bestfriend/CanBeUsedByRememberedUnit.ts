// @ts-nocheck

setup.qresImpl.CanBeUsedByRememberedUnit = class CanBeUsedByRememberedUnit extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.CanBeUsedByRememberedUnit()`
  }

  explain() {
    return `Unit must be usable by remembered unit`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    const owner = setup.qresImpl.RememberUnit.getRememberedUnit()
    return unit.isUsableBy(owner)
  }
}
