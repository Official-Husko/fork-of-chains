setup.SexFacingClass.Front = class Front extends setup.SexFacing {
  constructor() {
    super(
      'front',
    )
  }

  /**
   * @returns {setup.SexFacing}
   */
  getOpposite() {
    return setup.sexfacing.back
  }

  isFrontIsh() { return true }
  isUp() { return false }
  isDown () { return false }
}

setup.sexfacing.front = new setup.SexFacingClass.Front()
