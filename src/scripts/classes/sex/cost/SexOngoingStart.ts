// @ts-nocheck

setup.qcImpl.SexOngoingStart = class SexOngoingStart extends setup.SexCost {
  /**
   * @param {string} my_actor_name 
   * @param {setup.SexBodypart} my_bodypart 
   * @param {string} their_actor_name 
   * @param {setup.SexBodypart} their_bodypart 
   */
  constructor(my_actor_name, my_bodypart, their_actor_name, their_bodypart) {
    super()
    this.my_actor_name = my_actor_name
    this.my_bodypart = my_bodypart
    this.their_actor_name = their_actor_name
    this.their_bodypart = their_bodypart
  }

  /**
   * @param {setup.SexAction} action
   */
  apply(action) {
    const me = action.getActorUnit(this.my_actor_name)
    const them = action.getActorUnit(this.their_actor_name)
    this.sex.setOngoing(me, this.my_bodypart, them, this.their_bodypart)
  }

  explain() {
    return `${this.my_actor_name}'s ${this.my_bodypart.getTitle()} start penetrating ${this.their_actor_name}'s ${this.their_bodypart.getTitle()}`
  }
}
