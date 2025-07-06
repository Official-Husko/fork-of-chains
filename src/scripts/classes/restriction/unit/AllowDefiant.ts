// @ts-nocheck

/**
 * Usually, defiant units are disallowed from participating in many things, such as quests, events, interactions,
 * etc. This restriction will allow them to participate in those.
 */
setup.qresImpl.AllowDefiant = class AllowDefiant extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.AllowDefiant()`
  }

  explain() {
    if (State.variables.gDebug) {
      return `Allow defiant units`
    } else {
      return ``
    }
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    return true
  }
}
