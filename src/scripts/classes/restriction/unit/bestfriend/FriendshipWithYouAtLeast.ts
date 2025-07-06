// @ts-nocheck


setup.qresImpl.FriendshipWithYouAtLeast = class FriendshipWithYouAtLeast extends setup.Restriction {
  constructor(amt) {
    super()

    this.amt = amt
  }

  text() {
    return `setup.qres.FriendshipWithYouAtLeast(${this.amt})`
  }

  explain() {
    return `Unit's friendship with you is at least ${this.amt}` 
  }

  isOk(unit) {
    return State.variables.friendship.getFriendship(State.variables.unit.player, unit) >= this.amt
  }
}
