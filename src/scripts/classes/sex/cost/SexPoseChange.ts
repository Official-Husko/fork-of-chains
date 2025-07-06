// @ts-nocheck

setup.qcImpl.SexPoseChange = class SexPoseChange extends setup.SexCost {
  /**
   * @param {string} actor_name
   * @param {setup.SexPose} pose 
   */
  constructor(actor_name, pose) {
    super()
    this.actor_name = actor_name
    this.pose = pose
  }

  /**
   * @param {setup.SexAction} action
   */
  apply(action) {
    const unit = action.getActorUnit(this.actor_name)

    // First, remove all ongoing penetrations involving unit
    this.sex.clearOngoing(unit)

    // Finally, move unit to new posse
    this.sex.setPose(unit, this.pose)

    // Describe genital proximity
    this.sex.getScene().appendText(setup.SexText.proximityDescription(unit, this.sex))
  }

  explain() {
    return `Switch pose to ${this.pose.rep()}`
  }
}
