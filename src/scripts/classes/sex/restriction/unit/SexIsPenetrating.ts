// @ts-nocheck

setup.qresImpl.SexIsPenetrating = class SexIsPenetrating extends setup.SexRestriction {
  /**
   * @param {setup.SexBodypart} [my_bodypart]
   */
  constructor(my_bodypart) {
    super()
    this.my_bodypart = my_bodypart
  }

  explain() {
    if (this.my_bodypart) {
      return `${this.my_bodypart.repsimple()} is penetrating something`
    } else {
      return `Is penetrating something`
    }
  }

  /**
   * @param {setup.Unit} unit
   */
  isOk(unit) {
    if (this.my_bodypart) {
      return !!this.sex.getBodypartPenetrationTarget(unit, this.my_bodypart)
    } else {
      return this.sex.isPenetrating(unit)
    }
  }
}


