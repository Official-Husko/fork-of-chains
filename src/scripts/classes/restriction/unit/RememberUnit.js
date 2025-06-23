setup.qresImpl.RememberUnit = class RememberUnit extends setup.Restriction {
  constructor() {
    super()

  }

  text() {
    return `setup.qres.RememberUnit()`
  }

  explain() {
    return `Remember this unit (used with setup.qres.BestFriendWithRememberedUnit, setup.qres.CanUseRememberedUnit, and setup.qres.CanBeUsedWithRememberedUnit)`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    setup.qresImpl.RememberUnit.rememberUnit(unit)
    return true
  }

  /**
   * @param {setup.Unit} unit 
   */
  static rememberUnit(unit) {
    State.temporary.remember_unit_rememberedUnit_key = unit.key
  }

  /**
   * @returns {setup.Unit}
   */
  static getRememberedUnit() {
    const key = State.temporary.remember_unit_rememberedUnit_key
    if (!key) throw new Error(`No remembered unit!`)
    return State.variables.unit[key]
  }
}
