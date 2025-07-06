// @ts-nocheck

// abstract
setup.SexAction.PoseChangeOther = class PoseChangeOther extends setup.SexAction {
  getTags() { return super.getTags().concat(['poseother', 'pose', 'dom']) }

  desc() {
    return `Switch your partner position to: ${this.getNewPose().getTitle()}`
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
        paces: [setup.sexpace.dom, setup.sexpace.normal],
      },
      {
        energy: setup.Sex.ENERGY_TINY,
        restrictions: [
          setup.qres.Not(setup.qres.SexIsBeingPenetrated()),
          setup.qres.SexPoseCanChangeTo(this.getNewPose()),
        ],
        paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.resist, setup.sexpace.forced, setup.sexpace.mindbroken],
      },
    ]
  }

  getOutcomes() {
    return [
      setup.qc.SexPoseChange('b', this.getNewPose()),
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
    const unit = this.getActorUnit('b')
    return `Switch ${unit.rep()} to the "${this.getNewPose().getTitle()}" stance`
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawStory(sex) {
    return setup.SexAction.PoseChange.describe(this.getActorUnit('b'), this.getNewPose(), sex)
  }
}


setup.SexActionClass.PoseChangeOtherStand = class PoseChangeOtherStand extends setup.SexAction.PoseChangeOther {
  getNewPose() { return setup.sexpose.stand }
}

setup.SexActionClass.PoseChangeOtherKneel = class PoseChangeOtherKneel extends setup.SexAction.PoseChangeOther {
  getNewPose() { return setup.sexpose.kneel }
}

setup.SexActionClass.PoseChangeOtherSit = class PoseChangeOtherSit extends setup.SexAction.PoseChangeOther {
  getNewPose() { return setup.sexpose.sit }
}

setup.SexActionClass.PoseChangeOtherAllFours = class PoseChangeOtherAllFours extends setup.SexAction.PoseChangeOther {
  getNewPose() { return setup.sexpose.allfours }
}

setup.SexActionClass.PoseChangeOtherLieUp = class PoseChangeOtherLieUp extends setup.SexAction.PoseChangeOther {
  getNewPose() { return setup.sexpose.lieup }
}

setup.SexActionClass.PoseChangeOtherMissionary = class PoseChangeOtherMissionary extends setup.SexAction.PoseChangeOther {
  getNewPose() { return setup.sexpose.missionary }
}

setup.SexActionClass.PoseChangeOtherCowGirl = class PoseChangeOtherCowGirl extends setup.SexAction.PoseChangeOther {
  getNewPose() { return setup.sexpose.cowgirl }
}

setup.SexActionClass.PoseChangeOtherSixtyNine = class PoseChangeOtherSixtyNine extends setup.SexAction.PoseChangeOther {
  getNewPose() { return setup.sexpose.sixtynine }
}

setup.SexActionClass.PoseChangeOtherFaceSit = class PoseChangeOtherFaceSit extends setup.SexAction.PoseChangeOther {
  getNewPose() { return setup.sexpose.facesit }
}

setup.SexActionClass.PoseChangeOtherUpsideDown = class PoseChangeOtherUpsideDown extends setup.SexAction.PoseChangeOther {
  getNewPose() { return setup.sexpose.upsidedown }
}
