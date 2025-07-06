// @ts-nocheck

/**
 * Unit must be available: at home and not injured. They can be on a duty.
 */
setup.qresImpl.Available = class Available extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.Available()`
  }

  explain() {
    return `Unit is available for work`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.isAvailable()
  }
}
