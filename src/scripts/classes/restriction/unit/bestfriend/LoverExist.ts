// @ts-nocheck

setup.qresImpl.LoverExist = class LoverExist extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.LoverExist()`
  }

  explain() {
    return `Unit has a lover`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return !!unit.getLover()
  }
}
