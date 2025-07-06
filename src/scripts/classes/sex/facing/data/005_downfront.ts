// @ts-nocheck

setup.SexFacingClass.DownFront = class DownFront extends setup.SexFacing {
  constructor() {
    super(
      'downfront',
    )
  }
  /**
   * @returns {setup.SexFacing}
   */
  getOpposite() {
    return setup.sexfacing.upfront
  }

  isFrontIsh() { return true }
  isUp() { return false }
  isDown () { return true }
}

setup.sexfacing.downfront = new setup.SexFacingClass.DownFront()
