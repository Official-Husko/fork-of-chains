// @ts-nocheck

/**
 * Singleton at $activitylist
 */
setup.ActivityList = class ActivityList extends setup.TwineClass {
  constructor() {
    super()
    /**
     * @type {Object<number, number>}
     */
    this.room_instance_key_to_activity_key = {}
    this.unit_key_to_activity_key = {}
  }

  /**
   * @param {setup.Rarity} rarity 
   * @returns {setup.ActivityTemplate[]}
   */
  getAllActivityTemplateOfRarity(rarity) {
    return Object.values(setup.activitytemplate).filter(template => template.getRarity() == rarity)
  }

  /**
   * @param {setup.Unit} unit 
   */
  generateActivity(unit) {
    // How this works: pick a rarity, then find a random eligible activity with this rarity.
    // If doesnt exist, drop to a lower rarity and repeat.
    const rarities_to_try = setup.Rarity.getRandomRarityOrderWeighted()

    for (const rarity of rarities_to_try) {
      /**
       * @type {Array<[*, number]>}
       */ // @ts-ignore
      let acts = this.getAllActivityTemplateOfRarity(rarity).filter(act =>
        setup.RestrictionLib.isUnitSatisfy(unit, act.getPrimaryActorRestrictions())
      ).map(
        act => [act, act.computeWeight(unit)]
      ).filter(act => act[1] > 0)
      let attempts = setup.ACTIVITY_MAX_ATTEMPT_PER_RARITY
      while (acts.length && attempts) {
        attempts -= 1
        const act = setup.rng.sampleArray(acts, /* normalize = */ true)
        acts = acts.filter(t => t[0] != act)
        if (act.isCanGenerateFor(unit)) {
          // Try to generate this activity
          const instance = act.makeInstance(unit)
          if (instance) {
            return instance
          }
        }
      }
    }
    return null
  }

  deleteAllActivities() {
    for (const activity of Object.values(State.variables.activityinstance)) {
      activity.delete()
    }
  }

  advanceWeek() {
    this.deleteAllActivities()

    for (const unit of State.variables.company.player.getUnits({ job: setup.job.slaver })) {
      if (Math.random() < setup.ACTIVITY_CHANCE && unit.isHome() && !this.getActivityOf(unit)) {
        this.generateActivity(unit)
      }
    }
  }

  /**
   * @param {setup.Unit} unit 
   */
  removeUnitActivity(unit) {
    const activity = this.getActivityOf(unit)
    if (activity) {
      activity.delete()
    }
  }

  /**
   * @param {setup.ActivityInstance} activity 
   */
  registerActivity(activity) {
    const room_key = activity.getRoomInstance().key
    if (room_key in this.room_instance_key_to_activity_key) {
      throw new Error(`Duplicated activity on room ${room_key}`)
    }
    this.room_instance_key_to_activity_key[room_key] = activity.key

    const units = activity.getActorsList()
    for (const [actor_name, unit] of units) {
      const unit_key = unit.key
      if (this.unit_key_to_activity_key[unit_key]) {
        throw new Error(`Unit ${unit_key} already on an activity!`)
      }
      this.unit_key_to_activity_key[unit_key] = activity.key
    }
  }

  /**
   * @param {setup.ActivityInstance} activity 
   */
  unregisterActivity(activity) {
    const units = activity.getActorsList()
    for (const [actor_name, unit] of units) {
      const unit_key = unit.key
      delete this.unit_key_to_activity_key[unit_key]
    }

    const room_key = activity.getRoomInstance().key
    delete this.room_instance_key_to_activity_key[room_key]
  }

  /**
   * @param {setup.ActivityInstance | null} activity 
   * @returns {setup.ActivityInstance | null}
   */
  _validateActivity(activity) {
    if (activity) {
      // check all the slaver actors are still available
      const groups = activity.getTemplate().getActorUnitGroups()
      for (const [actorname, unit] of activity.getActorsList()) {
        if (Array.isArray(groups[actorname])) {
          if (!unit.isHome() && !unit.isRetired()) {
            activity.delete()
            return null
          }
        }
      }
    }
    return activity || null
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {setup.ActivityInstance | null}
   */
  getActivityOf(unit) {
    return this._validateActivity(
      State.variables.activityinstance[this.unit_key_to_activity_key[unit.key]]
    )
  }

  /**
   * @param {setup.RoomInstance} room 
   * @returns {setup.ActivityInstance | null}
   */
  getActivityAt(room) {
    return this._validateActivity(
      State.variables.activityinstance[this.room_instance_key_to_activity_key[room.key]]
    )
  }
}
