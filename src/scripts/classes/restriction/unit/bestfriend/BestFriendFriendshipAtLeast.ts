// @ts-nocheck

setup.qresImpl.BestFriendFriendshipAtLeast = class BestFriendFriendshipAtLeast extends setup.Restriction {
  constructor(amt) {
    super()

    this.amt = amt
  }

  text() {
    return `setup.qres.BestFriendFriendshipAtLeast(${this.amt})`
  }

  explain() {
    return `Unit has a best friend/lover with friendship at least ${this.amt}`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    const bf = unit.getBestFriend()
    if (!bf) return false
    return State.variables.friendship.getFriendship(unit, bf) >= this.amt
  }
}
