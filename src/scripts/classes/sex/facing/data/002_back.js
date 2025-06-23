setup.SexFacingClass.Back = class Back extends setup.SexFacing {
  constructor() {
    super(
      'back',
    )
  }

  /**
   * @returns {setup.SexFacing}
   */
  getOpposite() {
    return setup.sexfacing.front
  }

  isFrontIsh() { return false }
  isUp() { return false }
  isDown () { return false }
}

setup.sexfacing.back = new setup.SexFacingClass.Back()
