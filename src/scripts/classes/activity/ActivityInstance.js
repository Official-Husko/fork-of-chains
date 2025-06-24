/**
 * ActivityInstance Class
 * -----------------------------------------------------------------------------
 * Represents a single, concrete occurrence of an activity in the game world. Each
 * instance is tied to a specific activity template, a set of actor units, and a room.
 * Handles registration with global managers, actor management, and display logic.
 *
 * Key Responsibilities:
 * - Registers itself with the global activity registry and room/unit mappings.
 * - Maintains a mapping of actor roles to participating units.
 * - Provides access to its template, actors, and room.
 * - Handles deletion, cleanup, and actor lifecycle management.
 * - Generates UI display elements for the activity.
 *
 * Usage Example:
 *   const instance = new setup.ActivityInstance(template, actors, room);
 *   instance.getActorsList();
 *   instance.getDisplay();
 *
 * Structure:
 *   setup.ActivityInstance = class ActivityInstance extends setup.TwineClass { ... }
 */
setup.ActivityInstance = class ActivityInstance extends setup.TwineClass {
  /**
   * Constructs a new ActivityInstance.
   *
   * @param {setup.ActivityTemplate} activity_template - The template for this activity instance.
   * @param {Object<string, setup.Unit>} actor_units - Map of actor role names to unit objects.
   * @param {setup.RoomInstance} room - The room where the activity takes place.
   * @throws {Error} If any actor unit is already assigned to another activity, or if the instance key is not unique.
   *
   * Registers the instance globally and with the activity list. Ensures all actor units are available.
   */
  constructor(activity_template, actor_units, room) {
    super();
    this.key = State.variables.ActivityInstance_keygen++;
    this.template_key = activity_template.key;
    this.room_key = room.key;
    /**
     * Maps actor role to unit key for this activity instance.
     * @type {Object<string, string>}
     */
    this.actor_unit_key_map = {};
    // For each actor, ensure the unit is not already on another activity, then map the actor role to the unit key
    for (const actor_key in actor_units) {
      const unit = actor_units[actor_key];
      if (State.variables.activitylist.getActivityOf(unit)) {
        throw new Error(`Unit ${unit.key} already on another activity`);
      }
      this.actor_unit_key_map[actor_key] = String(unit.key); // Ensure string keys
    }
    // Register this instance globally and with the activity list, ensuring uniqueness
    if (this.key in State.variables.activityinstance) {
      throw new Error(`Activity Instance ${this.key} already exists`);
    }
    State.variables.activityinstance[this.key] = this;
    State.variables.activitylist.registerActivity(this);
  }

  /**
   * Retrieves the RoomInstance for this activity.
   *
   * @returns {setup.RoomInstance} The room where this activity occurs.
   */
  getRoomInstance() {
    return State.variables.roominstance[this.room_key];
  }

  /**
   * Unregisters and deletes this activity instance and its generated actors.
   *
   * Cleans up all mappings and calls checkDelete on each actor unit to handle their lifecycle.
   */
  delete() {
    State.variables.activitylist.unregisterActivity(this);
    delete State.variables.activityinstance[this.key];
    for (const [, unit] of this.getActorsList()) {
      unit.checkDelete();
    }
  }

  /**
   * Returns a string representation for this activity (for UI display).
   *
   * @returns {string} A string for display purposes.
   */
  rep() {
    return setup.repMessage(this, "activitycardkey");
  }

  /**
   * Retrieves the display name for this activity instance.
   *
   * @returns {string} The name of the activity, as defined by its template.
   */
  getName() {
    return this.getTemplate().getName();
  }

  /**
   * Retrieves the ActivityTemplate for this instance.
   *
   * @returns {setup.ActivityTemplate} The template object for this activity.
   */
  getTemplate() {
    return setup.activitytemplate[this.template_key];
  }

  /**
   * Returns a list of [actor role, unit] pairs for this activity.
   *
   * @returns {Array<[string, setup.Unit]>} Array of [actor role, unit] pairs.
   *
   * Uses Object.entries and map for efficient transformation.
   */
  getActorsList() {
    // Optimized: use Object.entries and map directly
    return Object.entries(this.actor_unit_key_map).map(([actor_key, unit_key]) => [actor_key, State.variables.unit[unit_key]]);
  }

  /**
   * Returns an object mapping actor roles to units for this activity.
   *
   * @returns {Object<string, setup.Unit>} Map of actor role names to unit objects.
   *
   * Uses a single-pass reduce for efficiency and type safety.
   */
  getActorObj() {
    // Optimized: single pass using reduce, with explicit string key
    return Object.entries(this.actor_unit_key_map).reduce((res, [actor_key, unit_key]) => {
      res[String(actor_key)] = State.variables.unit[unit_key];
      return res;
    }, /** @type {Object<string, setup.Unit>} */ ({}));
  }

  /**
   * Retrieves the unit for a specific actor role.
   *
   * @param {string} actor_name - The actor role name.
   * @returns {setup.Unit} The unit assigned to the given actor role.
   */
  getActorUnit(actor_name) {
    return State.variables.unit[this.actor_unit_key_map[actor_name]];
  }

  /**
   * Returns a deterministic random seed for this activity instance.
   *
   * @returns {number} The seed value, generated once per instance.
   *
   * Used for any randomization that must be consistent for this activity instance.
   */
  getSeed() {
    if (!this.seed) {
      this.seed = 1 + Math.floor(Math.random() * 999999997);
    }
    return this.seed;
  }

  /**
   * Generates the HTML display for this activity inside its room container.
   *
   * @returns {string} HTML string representing the activity's actors in the room.
   *
   * Arranges actor images in a grid based on room size, with tooltips for each actor.
   */
  getDisplay() {
    const tile_size = setup.Tile.getTileSize();
    const room = this.getRoomInstance();
    const max_column = room.getWidth() - 1;
    let row = 0, col = 0;
    const actor_boxes = [];
    for (const [, actor] of this.getActorsList()) {
      actor_boxes.push(`<span data-tooltip="<<activitycardkey ${this.key}>>" data-tooltip-wide>${setup.DOM.toString(setup.DOM.Util.Image.load({
        image_name: actor.getImage(),
        image_class: "activity-unit",
        extra_styles: `top: ${tile_size * row + (tile_size / 2)}px; left: ${tile_size * col + (tile_size / 2)}px; width: ${tile_size}px; height: ${tile_size}px;`,
      }))}</span>`);
      col++;
      if (col === max_column) {
        col = 0;
        row++;
      }
    }
    return actor_boxes.join("");
  }

  /**
   * Debug utility: kills all actors in this activity instance.
   *
   * Calls the debug kill method on all actors for testing or debugging purposes.
   */
  debugKillActors() {
    setup.QuestInstance.debugKillActorsDo(this.getActorsList());
  }
};
