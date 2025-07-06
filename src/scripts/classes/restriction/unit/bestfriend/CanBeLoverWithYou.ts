// @ts-nocheck

setup.qresImpl.CanBeLoverWithYou = class CanBeLoverWithYou extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.CanBeLoverWithYou()`
  }

  explain() {
    return `Can become lover with you`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    if (unit.isYou()) return false
    return State.variables.friendship.isCanBecomeLovers(unit, State.variables.unit.player)
  }
}
