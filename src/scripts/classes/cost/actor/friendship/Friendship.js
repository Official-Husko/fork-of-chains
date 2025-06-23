// Two units gain friendship
setup.qcImpl.Friendship = class Friendship extends setup.Cost {
  /**
   * @param {string} actor_name 
   * @param {string} target_actor_name 
   * 
   * Usually a number. Can be "reset" however, indicating the friendship should be reset
   * @param {number | "reset"} friendship_amt
   */
  constructor(actor_name, target_actor_name, friendship_amt) {
    super()

    this.actor_name = actor_name
    this.target_actor_name = target_actor_name
    this.friendship_amt = friendship_amt
  }

  text() {
    return `setup.qc.Friendship('${this.actor_name}', '${this.target_actor_name}', ${this.friendship_amt})`
  }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    let target = quest.getActorUnit(this.target_actor_name)
    if (this.friendship_amt == 'reset') {
      State.variables.friendship.deleteFriendship(unit, target)
      if (unit.isYourCompany() && target.isYourCompany()) {
        setup.notify(`a|Rep and b|rep have forgotten about each other...`, { a: unit, b: target })
      }
    } else {
      // @ts-ignore
      const adjusted = State.variables.friendship.adjustFriendship(unit, target, this.friendship_amt)
      if (adjusted && unit.isYourCompany() && target.isYourCompany()) {
        const friendship = setup.DOM.toString(setup.DOM.Util.friendship(adjusted))
        if (adjusted > 0) {
          setup.notify(`a|Rep a|gain ${friendship} friendship with b|rep.`, { a: unit, b: target })
        } else {
          setup.notify(`a|Rep a|gain ${friendship} rivalry with b|rep.`, { a: unit, b: target })
        }
      }
    }
  }

  explain(quest) {
    if (this.friendship_amt == 'reset') {
      return `Reset friendship between ${this.actor_name} and ${this.target_actor_name}`
    } else {
      // @ts-ignore
      return `${this.actor_name} and ${this.target_actor_name} gain ${setup.DOM.toString(setup.DOM.Util.friendship(this.friendship_amt))} ${this.friendship_amt > 0 ? 'friendship' : 'rivalry'}`
    }
  }
}
