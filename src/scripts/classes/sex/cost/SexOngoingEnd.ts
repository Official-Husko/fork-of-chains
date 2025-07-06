// @ts-nocheck

setup.qcImpl.SexOngoingEnd = class SexOngoingEnd extends setup.SexCost {
  /**
   * @param {string} my_actor_name 
   * @param {setup.SexBodypart} my_bodypart 
   */
  constructor(my_actor_name, my_bodypart) {
    super()
    this.my_actor_name = my_actor_name
    this.my_bodypart = my_bodypart
  }

  /**
   * @param {setup.SexAction} action
   */
  apply(action) {
    const me = action.getActorUnit(this.my_actor_name)
    this.sex.cancelOngoing(me, this.my_bodypart)
  }

  explain() {
    return `${this.my_actor_name}'s ${this.my_bodypart.getTitle()} stops penetrating`
  }
}
