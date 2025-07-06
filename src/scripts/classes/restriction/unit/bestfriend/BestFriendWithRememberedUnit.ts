// @ts-nocheck

setup.qresImpl.BestFriendWithRememberedUnit = class BestFriendWithRememberedUnit extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.BestFriendWithRememberedUnit()`
  }

  explain() {
    return `Unit must be the best friend/lover of the remembered unit`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    const bf = setup.qresImpl.RememberUnit.getRememberedUnit()
    return unit.getBestFriend() == bf
  }
}
