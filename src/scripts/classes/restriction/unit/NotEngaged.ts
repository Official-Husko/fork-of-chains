// @ts-nocheck

/**
 * Unit must not be engaged
 */
setup.qresImpl.NotEngaged = class NotEngaged extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.NotEngaged()`
  }

  explain() {
    return `Unit is not engaged`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return !unit.isEngaged()
  }
}
