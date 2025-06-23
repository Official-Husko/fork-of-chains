// abstract
setup.SexAction.PositionChangeOther = class PositionChangeOther extends setup.SexAction {
  getTags() { return super.getTags().concat(['positionother', 'dom']) }

  /**
   * Change position to this
   * @returns {setup.SexPosition}
   */
  getNewPosition() {
    return setup.sexposition.center
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
          setup.qres.SexPositionCanChangeTo(this.getNewPosition())
        ],
        paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.resist, setup.sexpace.forced, setup.sexpace.mindbroken], 
      },
    ]
  }

  getOutcomes() {
    return [
      setup.qc.SexPositionChange('b', this.getNewPosition()),
    ]
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return `Move to ${this.getNewPosition().getTitle()}`
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    const unit = this.getActorUnit('b')
    return `Move ${unit.rep()} to the "${this.getNewPosition().getTitle()}" position`
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawStory(sex) {
    return setup.SexAction.PositionChange.describe(
      this.getActorUnit('b'), this.getNewPosition(), sex
    )
  }
}


setup.SexActionClass.PositionChangeOtherStand = class PositionChangeOtherStand extends setup.SexAction.PositionChangeOther {
  getNewPosition() { return setup.sexposition.front }
}

setup.SexActionClass.PositionChangeOtherBack = class PositionChangeOtherBack extends setup.SexAction.PositionChangeOther {
  getNewPosition() { return setup.sexposition.back }
}

setup.SexActionClass.PositionChangeOtherCenter = class PositionChangeOtherCenter extends setup.SexAction.PositionChangeOther {
  getNewPosition() { return setup.sexposition.center }
}

setup.SexActionClass.PositionChangeOtherTop = class PositionChangeOtherTop extends setup.SexAction.PositionChangeOther {
  getNewPosition() { return setup.sexposition.top }
}
