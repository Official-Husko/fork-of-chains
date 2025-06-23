import { getDickPokeOutScore } from "../action/penis/breasts/util"

setup.qresImpl.SexCanTitfuckIntoMouth = class SexCanTitfuck extends setup.SexRestriction {
  /**
   * @param {string} my_actor_name 
   * @param {string} their_actor_name 
   */
  constructor(my_actor_name, their_actor_name) {
    super()
    this.my_actor_name = my_actor_name
    this.their_actor_name = their_actor_name
  }

  explain() {
    return `${this.my_actor_name} has a dick long enough to poke out of ${this.their_actor_name} breasts`
  }

  /**
   * @param {setup.SexAction} action
   */
  isOk(action) {
    const a = action.getActorUnit(this.my_actor_name)
    const b = action.getActorUnit(this.their_actor_name)
    return setup.sexbodypart.breasts.getTitfuck(a, b) && getDickPokeOutScore(a, b, this.sex) >= 1
  }
}


