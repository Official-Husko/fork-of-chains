// @ts-nocheck

setup.qresImpl.YourLover = class YourLover extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.YourLover()`
  }

  explain() {
    return `Unit must be your lover` 
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return unit.getLover()?.isYou()
  }
}
