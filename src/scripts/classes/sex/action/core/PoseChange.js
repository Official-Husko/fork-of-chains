// abstract
setup.SexAction.PoseChange = class PoseChange extends setup.SexAction {
  getTags() { return super.getTags().concat(['poseself', 'pose', 'normal',]) }

  desc() {
    return this.getNewPose().getTitle()
  }

  getRestrictions() {
    return super.getRestrictions().concat(this.getNewPose().getRestrictions())
  }

  /**
   * Change position to this
   * @returns {setup.SexPose}
   */
  getNewPose() {
    return setup.sexpose.stand
  }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_TINY,
        restrictions: [
          setup.qres.Not(setup.qres.SexIsBeingPenetrated()),
          setup.qres.SexPoseCanChangeTo(this.getNewPose()),
        ],
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced, setup.sexpace.resist],
      },
    ]
  }

  getOutcomes() {
    return [
      setup.qc.SexPoseChange('a', this.getNewPose()),
    ]
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return this.getNewPose().getTitle()
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Move and switch to the "${this.getNewPose().getTitle()}" stance`
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawStory(sex) {
    return setup.SexAction.PoseChange.describe(this.getActorUnit('a'), this.getNewPose(), sex)
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexPose} pose 
   * @param {setup.SexInstance} sex 
   */
  static describe(unit, pose, sex) {
    // two parts. First, remove all ongoing penetrations. Then, switch pose.
    const sentences = []

    sentences.push(setup.SexBodypart.describePenetrationEnds(
      sex.getAllOngoing(unit), sex
    ))

    // now switch pose
    sentences.push(pose.describe(unit, sex))
    return sentences.join(' ')
  }
}


setup.SexActionClass.PoseChangeStand = class PoseChangeStand extends setup.SexAction.PoseChange {
  getNewPose() { return setup.sexpose.stand }
}

setup.SexActionClass.PoseChangeKneel = class PoseChangeKneel extends setup.SexAction.PoseChange {
  getNewPose() { return setup.sexpose.kneel }
}

setup.SexActionClass.PoseChangeSit = class PoseChangeSit extends setup.SexAction.PoseChange {
  getNewPose() { return setup.sexpose.sit }
}

setup.SexActionClass.PoseChangeAllFours = class PoseChangeAllFours extends setup.SexAction.PoseChange {
  getNewPose() { return setup.sexpose.allfours }
}

setup.SexActionClass.PoseChangeLieUp = class PoseChangeLieUp extends setup.SexAction.PoseChange {
  getNewPose() { return setup.sexpose.lieup }
}

setup.SexActionClass.PoseChangeMissionary = class PoseChangeMissionary extends setup.SexAction.PoseChange {
  getNewPose() { return setup.sexpose.missionary }
}

setup.SexActionClass.PoseChangeCowGirl = class PoseChangeCowGirl extends setup.SexAction.PoseChange {
  getNewPose() { return setup.sexpose.cowgirl }
}

setup.SexActionClass.PoseChangeSixtyNine = class PoseChangeSixtyNine extends setup.SexAction.PoseChange {
  getNewPose() { return setup.sexpose.sixtynine }
}

setup.SexActionClass.PoseChangeFaceSit = class PoseChangeFaceSit extends setup.SexAction.PoseChange {
  getNewPose() { return setup.sexpose.facesit }
}

setup.SexActionClass.PoseChangeUpsideDown = class PoseChangeUpsideDown extends setup.SexAction.PoseChange {
  getNewPose() { return setup.sexpose.upsidedown }
}
