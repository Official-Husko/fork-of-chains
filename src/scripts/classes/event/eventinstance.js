/**
 * Represents a single instance of an event, including the mapping of actors to units and all runtime state.
 * Handles retrieval of event data, actor assignments, reward application, and debug utilities.
 * Ensures efficient access to assigned units and provides deterministic seeding for reproducibility.
 *
 * @class EventInstance
 * @extends setup.TwineClass
 */
setup.EventInstance = class EventInstance extends setup.TwineClass {
  /**
   * Constructs an EventInstance, mapping actors to units and setting debug info for each unit.
   *
   * @param {any} event - The event object this instance is based on.
   * @param {Object<string, any>} actor_assignment - Mapping of actor names to unit objects.
   */
  constructor(/** @type {any} */ event, /** @type {Object<string, any>} */ actor_assignment) {
    super();
    /**
     * The unique key of the event this instance is based on.
     * @type {string}
     */
    this.event_key = event.key;
    /**
     * Maps actor names to assigned unit keys for this event instance.
     * Used for efficient lookup of assigned units.
     * @type {Object<string, string>}
     */
    this.actor_unit_key_map = {};
    for (const actor_name in actor_assignment) {
      const unit = actor_assignment[actor_name];
      this.actor_unit_key_map[actor_name] = unit.key;
      if (unit) {
        // Attach debug info to the unit for traceability during debugging.
        unit.setDebugInfo(event);
      }
    }
  }

  /**
   * Retrieves the event object associated with this instance.
   * @returns {setup.Event} The event definition for this instance.
   */
  getEvent() {
    return setup.event[this.event_key];
  }

  /**
   * Returns the template (event) for this instance. Alias for getEvent().
   * @returns {setup.Event} The event definition for this instance.
   */
  getTemplate() {
    return this.getEvent();
  }

  /**
   * Returns the display name of the event for this instance.
   * @returns {string} The event's display name.
   */
  getName() {
    return this.getEvent().name;
  }

  /**
   * Returns a list of [actor, unit] pairs for this event instance.
   * Useful for iteration and display purposes.
   * @returns {Array<[string, any]>} Array of [actor name, unit object] pairs.
   */
  getActorsList() {
    // Efficiently map actor names to their assigned unit objects.
    return Object.entries(this.actor_unit_key_map).map(
      ([actor_key, unit_key]) => [actor_key, State.variables.unit[unit_key]]
    );
  }

  /**
   * Returns an object mapping actor names to their assigned unit objects.
   * Optimized to avoid unnecessary array creation.
   * @returns {Object<string, any>} Object where keys are actor names and values are unit objects.
   */
  getActorObj() {
    /** @type {Object<string, any>} */
    const res = {};
    for (const actor in this.actor_unit_key_map) {
      res[actor] = State.variables.unit[this.actor_unit_key_map[actor]];
    }
    return res;
  }

  /**
   * Returns the unit object assigned to a given actor name.
   * Uses a local variable for clarity and micro-optimization.
   * @param {string} actor_name - The name of the actor.
   * @returns {any} The unit object assigned to the actor, or undefined if not found.
   */
  getActorUnit(actor_name) {
    const unit_key = this.actor_unit_key_map[actor_name];
    return State.variables.unit[unit_key];
  }

  /**
   * Applies all rewards for this event instance by invoking the restriction library.
   * Ensures all event rewards are processed in the context of this instance.
   */
  applyRewards() {
    setup.RestrictionLib.applyAll(this.getEvent().getRewards(), this);
  }

  /**
   * Returns a deterministic random seed for this event instance.
   * The seed is generated once and cached for reproducibility.
   * Uses legacy assignment for compatibility with older JavaScript engines.
   * @returns {number} The cached or newly generated seed value.
   */
  getSeed() {
    // Ensure the seed property exists on the instance for deterministic behavior.
    if (!Object.prototype.hasOwnProperty.call(this, "seed")) {
      // @ts-ignore
      this.seed = 1 + Math.floor(Math.random() * 999999997);
    }
    // @ts-ignore
    return this.seed;
  }

  /**
   * Debug utility: kills all actors assigned to this event instance using the QuestInstance helper.
   * Useful for testing and debugging event outcomes.
   */
  debugKillActors() {
    setup.QuestInstance.debugKillActorsDo(this.getActorsList());
  }
}
