
// Flavor text about banter between two units.
setup.BanterInstance = class BanterInstance {
  constructor(
    initiator,
    target,
    friendship_amt,
  ) {
    this.initiator_key = initiator.key
    this.target_key = target.key
    this.friendship_amt = friendship_amt
    this.text = setup.Text.Banter.generate(initiator, target, friendship_amt)
  }

  getTexts() { return this.text }

  getFriendshipAmt() {
    return this.friendship_amt
  }

  getActorObj() {
    return {
      a: this.getInitiator(),
      b: this.getTarget(),
    }
  }

  getInitiator() {
    return State.variables.unit[this.initiator_key]
  }

  getTarget() {
    return State.variables.unit[this.target_key]
  }
}
