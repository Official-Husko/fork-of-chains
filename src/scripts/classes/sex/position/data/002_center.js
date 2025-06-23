setup.SexPositionClass.Center = class Center extends setup.SexPosition {
  constructor() {
    super(
      'center',
      [ /* tags */
      ],
      'Center',
      'Center',
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
      const room = sex.getLocation().repRoom(sex)
      return [
        `a|Rep a|move to the center of the ${room}.`,
      ]
    }
  }

  /**
   * @returns {setup.SexPose}
   */
  getDefaultPose() { return setup.sexpose.lieup }

  getRelativePosition(position) {
    if (position == setup.sexposition.top) {
      return `under`
    } else {
      return `in front of`
    }
  }
}

setup.sexposition.center = new setup.SexPositionClass.Center()
