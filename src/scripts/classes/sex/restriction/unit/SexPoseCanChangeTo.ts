// @ts-nocheck

setup.qresImpl.SexPoseCanChangeTo = class SexPoseCanChangeTo extends setup.SexRestriction {
  /**
   * @param {setup.SexPose} pose
   */
  constructor(pose) {
    super()
    this.pose = pose
  }

  explain() {
    return `Can switch to ${this.pose.rep()}`
  }

  isOk(unit) {
    return this.sex.getPose(unit) != this.pose && this.pose.isAllowed(unit, this.sex)
  }
}


