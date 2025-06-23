setup.SexFacingClass.DownBack = class DownBack extends setup.SexFacing {
  constructor() {
    super(
      'downback',
    )
  }
  /**
   * @returns {setup.SexFacing}
   */
  getOpposite() {
    return setup.sexfacing.upback
  }

  isFrontIsh() { return false }
  isUp() { return false }
  isDown () { return true }
}

setup.sexfacing.downback = new setup.SexFacingClass.DownBack()
