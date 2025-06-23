setup.qresImpl.SexIsInPenetration = class SexIsInPenetration extends setup.SexRestriction {
  /**
   * @param {setup.SexBodypart} [my_bodypart]
   */
  constructor(my_bodypart) {
    super()
    this.my_bodypart = my_bodypart
  }

  explain() {
    if (this.my_bodypart) {
      return `${this.my_bodypart.repsimple()} is involved in some penetration`
    } else {
      return `Is involved in a penetration`
    }
  }

  /**
   * @param {setup.Unit} unit
   */
  isOk(unit) {
    return setup.qres.SexIsBeingPenetrated(this.my_bodypart).isOk(unit) ||
           setup.qres.SexIsPenetrating(this.my_bodypart).isOk(unit)
  }
}


