// @ts-nocheck


setup.qresImpl.FriendshipWithYouAtMost = class FriendshipWithYouAtMost extends setup.Restriction {
  constructor(amt) {
    super()

    this.amt = amt
  }

  text() {
    return `setup.qres.FriendshipWithYouAtMost(${this.amt})`
  }

  explain() {
    return `Unit's friendship with you is at most ${this.amt}` 
  }

  isOk(unit) {
    return State.variables.friendship.getFriendship(State.variables.unit.player, unit) <= this.amt
  }
}
