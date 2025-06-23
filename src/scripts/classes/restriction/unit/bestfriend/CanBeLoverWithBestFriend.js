setup.qresImpl.CanBeLoverWithBestFriend = class CanBeLoverWithBestFriend extends setup.Restriction {
  constructor() {
    super()
  }

  text() {
    return `setup.qres.CanBeLoverWithBestFriend()`
  }

  explain() {
    return `Can become lover with their best friend`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    const bf = unit.getBestFriend()
    if (!bf) return false
    return State.variables.friendship.isCanBecomeLovers(unit, bf)
  }
}
