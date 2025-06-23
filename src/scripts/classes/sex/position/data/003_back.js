setup.SexPositionClass.Back = class Back extends setup.SexPosition {
  constructor() {
    super(
      'back',
      [ /* tags */
      ],
      'Back',
      'Back',
    )
  }

  /**
   * Describes what happens when a unit moves to this position. Assumes it's empty.
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} sex 
   * @returns {string | string[]}
   */
  rawDescribe(unit, sex) {
    const swap_with = sex.getUnitAtPosition(this)
    if (swap_with) {
      return [
        `a|Rep a|swap positions with b|rep.`,
        `a|Rep a|exchange positions with b|rep.`,
      ]
    } else {
      return [
        `a|Rep a|move to behind of c|rep.`,
      ]
    }
  }

  getRelativePosition(position) {
    if (position = setup.sexposition.front) {
      return `far from`
    } else {
      return `behind`
    }
  }
}

setup.sexposition.back = new setup.SexPositionClass.Back()
