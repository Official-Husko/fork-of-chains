// Two units gain friendship
setup.qcImpl.FriendshipWithYou = class FriendshipWithYou extends setup.Cost {
  constructor(actor_name, friendship_amt) {
    super()

    this.actor_name = actor_name
    this.friendship_amt = friendship_amt
  }

  text() {
    return `setup.qc.FriendshipWithYou('${this.actor_name}', ${this.friendship_amt})`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let target = State.variables.unit.player
    if (unit != target) {
      setup.qc.Friendship('unit', 'target', this.friendship_amt).apply(
        setup.costUnitHelperDict({
          unit: unit,
          target: target,
        })
      )
    }
  }

  explain(quest) {
    return `${this.actor_name} gain ${this.friendship_amt} friendship with you`
  }
}
