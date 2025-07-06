// @ts-nocheck


/**
 * Unit must be at home: on duty, injured, or idle
 */
setup.qresImpl.Home = class Home extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.Home()`
  }

  explain() {
    return `Unit is at home`
  }

  /**
   * @param {any} unit 
   */
  isOk(unit) {
    return unit.isHome()
  }
}
