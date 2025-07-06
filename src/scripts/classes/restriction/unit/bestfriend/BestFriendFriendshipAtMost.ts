// @ts-nocheck

setup.qresImpl.BestFriendFriendshipAtMost = class BestFriendFriendshipAtMost extends setup.Restriction {
  constructor(amt) {
    super()

    this.amt = amt
  }

  text() {
    return `setup.qres.BestFriendFriendshipAtMost(${this.amt})`
  }

  explain() {
    return `Unit has a best friend/lover with friendship at most ${this.amt}`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    const bf = unit.getBestFriend()
    if (!bf) return false
    return State.variables.friendship.getFriendship(unit, bf) <= this.amt
  }
}
