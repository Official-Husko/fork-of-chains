/**
 * ActivityList Singleton
 * -----------------------------------------------------------------------------
 * Central manager for all activity instances in the game. Handles registration,
 * lookup, deletion, and weekly updates of activities. Maintains efficient mappings
 * between units, rooms, and their associated activities for fast access and integrity.
 *
 * Key Responsibilities:
 * - Registers and unregisters activity instances, ensuring no duplicates per room.
 * - Maps units and rooms to their current activities for quick lookup.
 * - Generates activities for units based on rarity, restrictions, and weighting.
 * - Advances the game week by cleaning up and generating new activities.
 * - Validates activity assignments to ensure all actors are eligible and available.
 *
 * Usage Example:
 *   const activity = setup.activitylist.getActivityOf(unit);
 *   setup.activitylist.advanceWeek();
 *
 * Structure:
 *   setup.ActivityList = class ActivityList extends setup.TwineClass { ... }
 */
setup.ActivityList = class ActivityList extends setup.TwineClass {
  /**
   * Initialize the ActivityList with mappings for rooms and units to activities.
   *
   * @constructor
   * @memberof setup
   *
   * @property {Object<number, number>} room_instance_key_to_activity_key - Maps room instance keys to activity keys.
   * @property {Object<number, number>} unit_key_to_activity_key - Maps unit keys to activity keys.
   */
  constructor() {
    super();
    /**
     * Maps room instance keys to activity keys.
     * @type {Object<number, number>}
     */
    this.room_instance_key_to_activity_key = {};
    /**
     * Maps unit keys to activity keys.
     * @type {Object<number, number>}
     */
    this.unit_key_to_activity_key = {};
  }

  /**
   * Retrieves all activity templates of a given rarity.
   *
   * @param {setup.Rarity} rarity - The rarity to filter activity templates by.
   * @returns {setup.ActivityTemplate[]} Array of activity templates matching the rarity.
   */
  getAllActivityTemplateOfRarity(rarity) {
    return Object.values(setup.activitytemplate).filter(template => template.getRarity() === rarity);
  }

  /**
   * Attempts to generate an activity for a unit, trying rarities in weighted order.
   *
   * @param {setup.Unit} unit - The unit for which to generate an activity.
   * @returns {setup.ActivityInstance|null} The generated activity instance, or null if none could be created.
   *
   * Tries each rarity in weighted order, filters templates by restrictions and weight,
   * and attempts to instantiate an activity. Limits attempts per rarity to avoid infinite loops.
   */
  generateActivity(unit) {
    const rarities_to_try = setup.Rarity.getRandomRarityOrderWeighted();
    for (const rarity of rarities_to_try) {
      /** @type {[setup.ActivityTemplate, number][]} */
      let acts = [];
      for (const act of this.getAllActivityTemplateOfRarity(rarity)) {
        if (setup.RestrictionLib.isUnitSatisfy(unit, act.getPrimaryActorRestrictions())) {
          const weight = act.computeWeight(unit);
          if (typeof weight === "number" && weight > 0) {
            acts.push([act, weight]);
          }
        }
      }
      let attempts = setup.ACTIVITY_MAX_ATTEMPT_PER_RARITY;
      while (acts.length && attempts) {
        attempts--;
        const [act] = setup.rng.sampleArray(acts, true);
        acts = acts.filter(([a]) => a !== act);
        if (act.isCanGenerateFor(unit)) {
          const instance = act.makeInstance(unit);
          if (instance) return instance;
        }
      }
    }
    return null;
  }

  /**
   * Deletes all activity instances in the game.
   *
   * Iterates through all activity instances and calls their delete method to clean up mappings and state.
   */
  deleteAllActivities() {
    for (const activity of Object.values(State.variables.activityinstance)) {
      activity.delete();
    }
  }

  /**
   * Advances the game week: deletes all activities and generates new ones for eligible units.
   *
   * For each eligible unit (e.g., slavers at home), attempts to generate a new activity with a certain probability.
   * Ensures no duplicate activities are assigned to the same unit.
   */
  advanceWeek() {
    this.deleteAllActivities();
    // Use both arguments for getUnits for compatibility
    for (const unit of State.variables.company.player.getUnits({ job: setup.job.slaver }, true)) {
      if (Math.random() < setup.ACTIVITY_CHANCE && unit.isHome() && !this.getActivityOf(unit)) {
        this.generateActivity(unit);
      }
    }
  }

  /**
   * Removes a unit's activity, if any is assigned.
   *
   * @param {setup.Unit} unit - The unit whose activity should be removed.
   *
   * Looks up the activity for the unit and deletes it if present.
   */
  removeUnitActivity(unit) {
    const activity = this.getActivityOf(unit);
    if (activity) activity.delete();
  }

  /**
   * Registers a new activity instance, mapping its room and all actor units to the activity key.
   *
   * @param {setup.ActivityInstance} activity - The activity instance to register.
   * @throws {Error} If the room already has an activity assigned.
   *
   * Ensures one activity per room. Maps all actor units to the activity for fast lookup.
   */
  registerActivity(activity) {
    const room_key = activity.getRoomInstance().key;
    if (Object.prototype.hasOwnProperty.call(this.room_instance_key_to_activity_key, room_key)) {
      throw new Error(`Duplicated activity on room ${room_key}`);
    }
    this.room_instance_key_to_activity_key[room_key] = activity.key;
    for (const [, unit] of activity.getActorsList()) {
      const unit_key = String(unit.key);
      /** @type {any} */ (this.unit_key_to_activity_key)[unit_key] = activity.key;
    }
  }

  /**
   * Unregisters an activity instance, removing its room and unit mappings.
   *
   * @param {setup.ActivityInstance} activity - The activity instance to unregister.
   *
   * Cleans up all mappings for the activity's room and actors.
   */
  unregisterActivity(activity) {
    for (const [, unit] of activity.getActorsList()) {
      const unit_key = String(unit.key);
      delete /** @type {any} */ (this.unit_key_to_activity_key)[unit_key];
    }
    const room_key = activity.getRoomInstance().key;
    delete this.room_instance_key_to_activity_key[room_key];
  }

  /**
   * Validates an activity instance, ensuring all slaver actors are available.
   *
   * @param {setup.ActivityInstance|null} activity - The activity instance to validate.
   * @returns {setup.ActivityInstance|null} The activity if valid, or null if deleted.
   *
   * If any required actor is not home or retired, deletes the activity and returns null.
   * Used to ensure only valid, available activities are returned by lookup methods.
   */
  _validateActivity(activity) {
    if (activity) {
      const groups = activity.getTemplate().getActorUnitGroups();
      for (const [actorname, unit] of activity.getActorsList()) {
        if (Array.isArray(groups[actorname])) {
          if (!unit.isHome() && !unit.isRetired()) {
            activity.delete();
            return null;
          }
        }
      }
    }
    return activity || null;
  }

  /**
   * Retrieves the activity instance a unit is currently assigned to, if any.
   *
   * @param {setup.Unit} unit - The unit to look up.
   * @returns {setup.ActivityInstance|null} The activity instance, or null if none.
   *
   * Looks up the activity by unit key and validates it before returning.
   */
  getActivityOf(unit) {
    return this._validateActivity(
      State.variables.activityinstance[/** @type {any} */ (this.unit_key_to_activity_key)[String(unit.key)]]
    );
  }

  /**
   * Retrieves the activity instance assigned to a room, if any.
   *
   * @param {setup.RoomInstance} room - The room to look up.
   * @returns {setup.ActivityInstance|null} The activity instance, or null if none.
   *
   * Looks up the activity by room key and validates it before returning.
   */
  getActivityAt(room) {
    return this._validateActivity(
      State.variables.activityinstance[this.room_instance_key_to_activity_key[room.key]]
    );
  }
};
