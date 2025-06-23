setup.SexFacingClass.UpBack = class UpBack extends setup.SexFacing {
  constructor() {
    super(
      'upback',
    )
  }

  /**
   * @returns {setup.SexFacing}
   */
  getOpposite() {
    return setup.sexfacing.downback
  }

  isFrontIsh() { return false }
  isUp() { return true }
  isDown () { return false }
}

setup.sexfacing.upback = new setup.SexFacingClass.UpBack()
