class PositionChange extends setup.SexPlan {
  constructor(...args) {
    // @ts-ignore
    super(...args)

    this.tries_remain = setup.Sex.AI_POSITION_CHANGE_MAX_ATTEMPTS
  }

  /**
   * @returns {setup.SexPosition}
   */
  preferredPosition() {
    return setup.sexposition.center
  }

  /**
   * @param {setup.SexAction[]} actions 
   * @returns {setup.SexAction | null}
   */
  selectAction(actions) {
    this.tries_remain -= 1

    const want = this.preferredPosition()

    const possible = actions.filter(
      action => action instanceof setup.SexAction.PositionChange && action.getNewPosition() == want)
    if (possible.length) return setup.rng.choice(possible)

    if (want.isAllowed(this.unit, this.sex)) {
      // then give up
      return this.giveUp()
    }

    if (this.sex.isBeingPenetrated(this.unit)) {
      // stop penetrations
      const possible = actions.filter(action =>
        action.getTags().includes('penetrationendsub'))
      if (possible.length) return setup.rng.choice(possible)
      return this.giveUp()
    }

    if (want == setup.sexposition.top) {
      const center = this.sex.getUnitAtPosition(setup.sexposition.center)

      // should never happen, but just in case:
      if (!center) return this.giveUp()

      if (this.sex.getPose(center) != setup.sexpose.lieup) {
        // make them lie down so can be topped.
        const possible = actions.filter(action =>
          action instanceof setup.SexAction.PoseChangeOther &&
          action.getActorUnit('b') == center &&
          action.getNewPose() == setup.sexpose.lieup)
        if (possible.length) return setup.rng.choice(possible)
        return this.giveUp()
      }
    }

    const my_position = this.sex.getPosition(this.unit)
    if (my_position == setup.sexposition.center && this.sex.getUnitAtPosition(setup.sexposition.top)) {
      // can't move because i'm being topped. Switch position with the top.
      const possible = actions.filter(action =>
        action instanceof setup.SexAction.PositionChange &&
        action.getNewPosition() == setup.sexposition.top)
      if (possible.length) return setup.rng.choice(possible)
      return this.giveUp()
    }

    if (my_position == setup.sexposition.center && !this.sex.getUnitAtPosition(want)) {
      // can't move because nobody is in the center. Move the other unit to the center first.
      const possible = actions.filter(action =>
        action instanceof setup.SexAction.PositionChangeOther &&
        action.getNewPosition() == setup.sexposition.center)
      if (possible.length) return setup.rng.choice(possible)
      return this.giveUp()
    }

    // ?? don't know what is caussing it
    return this.giveUp()
  }

  giveUp() {
    this.tries_remain = 0
    return null
  }

  /**
   * Whether the plan has been completed or aborted, and a new plan should be taken
   * @returns {boolean}
   */
  isComplete() {
    return this.tries_remain == 0 || this.sex.getPosition(this.unit) == this.preferredPosition()
  }
}


setup.SexPlanClass.PositionChangeFront = class PositionChangeFront extends PositionChange {
  preferredPosition() { return setup.sexposition.front }
}

setup.SexPlanClass.PositionChangeBack = class PositionChangeBack extends PositionChange {
  preferredPosition() { return setup.sexposition.back }
}

setup.SexPlanClass.PositionChangeCenter = class PositionChangeCenter extends PositionChange {
  preferredPosition() { return setup.sexposition.center }
}

setup.SexPlanClass.PositionChangeTop = class PositionChangeTop extends PositionChange {
  preferredPosition() { return setup.sexposition.top }
}
