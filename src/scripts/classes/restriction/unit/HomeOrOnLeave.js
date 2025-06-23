/**
 * Unit must be at home: on duty, injured, or idle
 */
setup.qresImpl.HomeExceptOnLeave = class HomeExceptOnLeave extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.HomeExceptOnLeave()`
  }

  explain() {
    return `Unit is at home OR on leave`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.isHome(/* ignore_leave */ true)
  }
}
