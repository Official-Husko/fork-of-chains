setup.qresImpl.SexIsOngoingWithAnyone = class SexIsOngoingWithAnyone extends setup.SexRestriction {
  /**
   * @param {setup.SexBodypart} my_bodypart 
   * @param {setup.SexBodypart} their_bodypart 
   */
  constructor(my_bodypart, their_bodypart) {
    super()
    this.my_bodypart = my_bodypart
    this.their_bodypart = their_bodypart
  }

  explain() {
    return `${this.my_bodypart.repsimple()} is penetrating ${this.their_bodypart.repsimple()}`
  }

  /**
   * @param {setup.Unit} unit
   */
  isOk(unit) {
    const target = this.sex.getBodypartPenetrationTarget(unit, this.my_bodypart)
    return target && target.bodypart == this.their_bodypart
  }
}


