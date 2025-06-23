setup.SexFacingClass.UpFront = class UpFront extends setup.SexFacing {
  constructor() {
    super(
      'upfront',
    )
  }

  /**
   * @returns {setup.SexFacing}
   */
  getOpposite() {
    return setup.sexfacing.downfront
  }

  isFrontIsh() { return true }
  isUp() { return true }
  isDown () { return false }
}

setup.sexfacing.upfront = new setup.SexFacingClass.UpFront()
