// @ts-nocheck

setup.qresImpl.NotOnActivity = class NotOnActivity extends setup.Restriction {
  constructor() {
    super()

  }

  text() {
    return `setup.qres.NotOnActivity()`
  }

  explain() {
    return `Unit is not already on another activity`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return !State.variables.activitylist.getActivityOf(unit)
  }
}
