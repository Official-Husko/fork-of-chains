
/**
 * Unit must be a bodyshifter
 */
setup.qresImpl.Bodyshifter = class Bodyshifter extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.Bodyshifter()`
  }

  explain() {
    return `Unit is a bodyshifter`
  }

  /**
   * @param {any} unit 
   */
  isOk(unit) {
    return State.variables.bodyshift.isBodyshifter(unit)
  }
}
