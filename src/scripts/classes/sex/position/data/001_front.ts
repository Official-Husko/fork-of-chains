// @ts-nocheck

setup.SexPositionClass.Front = class Front extends setup.SexPosition {
  constructor() {
    super(
      'front',
      [ /* tags */
      ],
      'Front',
      'Front',
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
        `a|Rep a|move to in front of c|rep.`,
      ]
    }
  }

  /**
   * @returns {boolean}
   */
  isFacingRight() {
    return true
  }

  getRelativePosition(position) {
    if (position = setup.sexposition.back) {
      return `far from`
    } else {
      return `in front of`
    }
  }
}

setup.sexposition.front = new setup.SexPositionClass.Front()
