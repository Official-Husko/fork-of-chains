/**
 * ActivityTemplate Class
 * -----------------------------------------------------------------------------
 * Represents a blueprint for activities that can occur in the game. Each activity
 * template defines the requirements for actors, restrictions, rarity, dialogues,
 * and the rooms in which the activity can take place. This class is responsible
 * for validating its configuration, instantiating activities, and providing
 * trait-based weighting for activity selection.
 *
 * Key Responsibilities:
 * - Validates all input parameters and ensures type safety.
 * - Registers itself in the global activity template registry.
 * - Provides methods to retrieve critical/disaster traits, actor requirements,
 *   and available rooms.
 * - Handles dialogue structure and developer tool support for dialogue editing.
 * - Computes activity weighting based on unit traits for selection algorithms.
 *
 * Example Usage:
 *   const template = new setup.ActivityTemplate({...});
 *   const instance = template.makeInstance(unit);
 *   const criticalTraits = template.getCriticalTraits();
 *
 * Structure:
 *   setup.ActivityTemplate = class ActivityTemplate extends ContentTemplate { ... }
 */
import { doFinalize } from "../../util/questassign";
import { ContentTemplate } from "../content/ContentTemplate";

/**
 * @type {Registry<any>}
 */
setup.activitytemplate = {};

setup.ActivityTemplate = class ActivityTemplate extends ContentTemplate {
  /**
   * Constructs a new ActivityTemplate instance.
   *
   * @typedef {{name: string, url: string}} AuthorInfo - Information about the author.
   *
   * @param {Object} args - The configuration object for the activity template.
   * @param {string} args.key - Unique identifier for this activity template.
   * @param {string} args.name - Human-readable name of the activity.
   * @param {AuthorInfo} args.author - Author metadata for attribution.
   * @param {string[]} args.tags - Tags for filtering and categorizing activities.
   * @param {setup.Trait[]} args.critical_traits - Traits that increase the chance of this activity being selected for a unit.
   * @param {setup.Trait[]} args.disaster_traits - Traits that decrease the chance of this activity being selected for a unit.
   * @param {Object<string, any>} args.actor_unitgroups - Mapping of actor names to unit group requirements or restriction arrays.
   * @param {setup.Restriction[]} args.restrictions - List of restrictions that must be satisfied for this activity to be generated.
   * @param {setup.Rarity} args.rarity - Rarity object controlling how often this activity appears.
   * @param {Array<DialogueRaw>} args.dialogues - Array of dialogue objects for this activity.
   * @param {setup.RoomTemplate[]} args.room_templates - List of room templates where this activity can occur.
   * @param {boolean} [args.devtool] - If true, enables developer tool mode for editing.
   * @throws {Error} If any required argument is missing or invalid.
   *
   * The constructor performs deep validation of all arguments, ensures type safety,
   * and registers the template globally. It also processes actor unit groups to
   * append or filter restrictions as needed, depending on devtool mode.
   */
  constructor({
    key,
    name,
    author,
    tags,
    actor_unitgroups,
    critical_traits,
    disaster_traits,
    restrictions,
    rarity,
    dialogues,
    room_templates,
    devtool,
  }) {
    // Initialize the base ContentTemplate with core properties.
    super(key, name, author, tags, actor_unitgroups, setup.qdiff.normal40);

    // Ensure all actor unit groups are properly configured for activity assignment.
    for (const group of Object.values(this.actor_unitgroup_key_map)) {
      if (group.type == 'companyunit') {
        if (!devtool) {
          // Add restrictions to prevent the player and already-active units from being selected.
          group.val.push(
            setup.qres.NotYou(),
            setup.qres.NotOnActivity(),
          );
          // If the group does not allow retired units and does not require injury, require availability.
          if (!setup.Living.isRestrictionsAllowRetired(group.val) &&
            group.val.filter((/** @type {any} */res) => res instanceof setup.qresImpl.IsInjured).length == 0
          ) {
            group.val.push(
              setup.qres.Available(),
            );
          }
        } else {
          // In devtool mode, remove restrictions for easier testing.
          group.val = group.val.filter((/** @type {any} */res) =>
            !(res instanceof setup.qresImpl.Home) &&
            !(res instanceof setup.qresImpl.NotYou) &&
            !(res instanceof setup.qresImpl.NotOnActivity) &&
            !(res instanceof setup.qresImpl.Available)
          );
        }
      }
    }

    // Validate that the primary actor is a company unit and that actor_unitgroups is not empty.
    if (!Array.isArray(this.getPrimaryActorRestrictions())) {
      throw new Error(`First actor for activity ${this.key} must be a company unit!`);
    }
    if (!Object.keys(actor_unitgroups).length) {
      throw new Error(`Activity ${this.key} missing actor!`);
    }
    if (!Array.isArray(Object.values(actor_unitgroups)[0])) {
      throw new Error(`Primary actor for ${this.key} must be a slaver!`);
    }

    /**
     * Activity type identifier for this template.
     * @type {"activity"}
     */
    const type = "activity";
    this.TYPE = type;

    // Validate and extract critical and disaster trait keys, ensuring all are defined.
    if (!Array.isArray(critical_traits)) {
      throw new Error(`Critical Traits must be an array for Activity ${this.key}`);
    }
    if (!Array.isArray(disaster_traits)) {
      throw new Error(`Critical Traits must be an array for Activity ${this.key}`);
    }
    this.critical_trait_keys = critical_traits.map(trait => trait.key);
    if (this.critical_trait_keys.filter(key => !key).length) {
      throw new Error(`Undefined critical trait for Activity ${this.key}`);
    }
    this.disaster_trait_keys = disaster_traits.map(trait => trait.key);
    if (this.disaster_trait_keys.filter(key => !key).length) {
      throw new Error(`Undefined disaster trait for Activity ${this.key}`);
    }

    // Store and validate restrictions.
    this.restrictions = restrictions;
    if (!Array.isArray(restrictions)) {
      throw new Error(`Restrictions must be an array for Activity ${this.key}`);
    }
    for (const restriction of restrictions) {
      if (!(restriction instanceof setup.Restriction)) {
        throw new Error(`Restriction ${restriction} isnt' a restriction`);
      }
    }

    // Store and validate rarity.
    this.rarity = rarity;
    if (!(rarity instanceof setup.Rarity)) {
      throw new Error(`Rarity for ${this.key} must be a Rarity`);
    }

    // Validate and process dialogues. Ensures each dialogue has the correct structure and actors.
    // If a dialogue's texts are an array, expand to all speech types. Otherwise, check for completeness and actor validity.
    this.dialogues = dialogues;
    if (!Array.isArray(dialogues)) {
      throw new Error(`Dialogue must be an array`);
    }
    for (let i = 0; i < dialogues.length; ++i) {
      const dialogue = dialogues[i];
      if (Array.isArray(dialogue.texts)) {
        // If only one set of texts is provided, use it for all speech types.
        const texts_base = dialogue.texts;
        dialogue.texts = {
          friendly: texts_base,
          bold: texts_base,
          cool: texts_base,
          witty: texts_base,
          debauched: texts_base,
        };
      } else {
        // Validate that all required speech types are present in the dialogue.
        if (Object.values(dialogue.texts).length != Object.values(setup.speech).length) {
          throw new Error(`Missing speech type in dialogue!`);
        }
        for (const text of Object.keys(dialogue.texts)) {
          if (!(text in setup.speech)) {
            throw new Error(`Missing speech type ${text} in dialogue for Activity ${this.key}`);
          }
        }
        if (!(dialogue.actor in this.actor_unitgroup_key_map)) {
          throw new Error(`Missing dialogue actor ${dialogue.actor} from Activity ${this.key}`);
        }
      }
    }

    // Validate that all room templates are instances of setup.RoomTemplate and extract their keys.
    if (!Array.isArray(room_templates)) {
      throw new Error(`Room Templates must be an array`);
    }
    for (const room_template of room_templates) {
      if (!(room_template instanceof setup.RoomTemplate)) {
        throw new Error(`Room template ${room_template} isnt' a room_template`);
      }
    }
    this.room_template_keys = room_templates.map(template => template.key);

    // Register this template globally, ensuring uniqueness by key.
    if (key in setup.activitytemplate) throw new Error(`Activity Base ${key} already exists`);
    setup.activitytemplate[key] = this;
  }

  /**
   * Performs a sanity check on the template configuration.
   *
   * @returns {string|null} Returns a string describing the first error found, or null if valid.
   *
   * Checks for missing names, actor requirements, dialogue lines, and validates that all restrictions
   * reference valid actors. Useful for debugging and validation during development.
   */
  sanityCheck() {
    if (!this.name) return 'Name cannot be null';
    for (let i = 0; i < this.restrictions.length; ++i) {
      if (!setup.QuestTemplate.isCostActorIn(this.restrictions[i], { 'a': '' }, this.actor_unitgroup_key_map)) {
        // @ts-ignore
        return `Actor ${this.restrictions[i].actor_name} not found in the ${i}-th quest restriction`;
      }
    }
    if (!(Object.keys(this.actor_unitgroup_key_map).length)) {
      return `Must have at least one actor!`;
    }
    if (!Array.isArray(Object.values(this.actor_unitgroup_key_map)[0])) {
      return `Primary actor must be a slaver!`;
    }
    if (!this.dialogues.length) {
      return `Must have at least one line of dialogue!`;
    }
    return null;
  }

  /**
   * Returns a short string representation of the activity template (its name).
   *
   * @returns {string}
   */
  rep() { return this.getName(); }

  /**
   * Retrieves the array of dialogue objects for this activity.
   *
   * @returns {Dialogue[]} Array of dialogue objects.
   */
  getDialogues() {
    // @ts-ignore
    return this.dialogues;
  }

  /**
   * Retrieves a deep-copied array of dialogues for use in developer tools.
   *
   * If all speech types share the same text, replaces non-primary types with empty strings
   * to make editing easier in dev tools.
   *
   * @returns {Dialogue[]} Array of dialogue objects, modified for dev tool editing.
   */
  getDialoguesDevTool() {
    const dialogues = setup.deepCopy(this.getDialogues());
    for (const dialogue of dialogues) {
      const texts = dialogue.texts;
      const frend_string = JSON.stringify(texts.friendly);
      if (
        (JSON.stringify(texts.bold) == frend_string) &&
        (JSON.stringify(texts.cool) == frend_string) &&
        (JSON.stringify(texts.witty) == frend_string) &&
        (JSON.stringify(texts.debauched) == frend_string)
      ) {
        texts.bold = [""];
        texts.cool = [""];
        texts.witty = [""];
        texts.debauched = [""];
      }
    }
    return dialogues;
  }

  /**
   * Converts developer tool dialogue format back to the standard format.
   *
   * For any speech type with a single empty string, replaces it with the 'friendly' text.
   * This ensures that all speech types have valid text arrays before saving or using the template.
   */
  makeProperFromDevTool() {
    for (const dialogue of this.getDialogues()) {
      for (const speech of Object.values(setup.speech)) {
        // @ts-ignore
        const texts = dialogue.texts[speech.key];
        if (texts.length == 1 && texts[0] == "") {
          // @ts-ignore
          dialogue.texts[speech.key] = dialogue.texts.friendly;
        }
      }
    }
  }

  /**
   * Retrieves the list of room template objects associated with this activity.
   *
   * @returns {setup.RoomTemplate[]} Array of room template objects.
   */
  getRoomTemplates() {
    return this.room_template_keys.map(key => setup.roomtemplate[key]);
  }

  /**
   * Returns the rarity object for this activity template.
   *
   * @returns {setup.Rarity}
   */
  getRarity() { return this.rarity; }

  /**
   * Returns the list of prerequisite restrictions for this activity.
   *
   * @returns {setup.Restriction[]} Array of restriction objects.
   */
  getPrerequisites() { return this.restrictions; }

  /**
   * Returns the restriction array for the primary actor (the first actor in the unit group map).
   *
   * @returns {setup.Restriction[]} Array of restrictions for the primary actor.
   */
  getPrimaryActorRestrictions() {
    // @ts-ignore
    return Object.values(this.getActorUnitGroups())[0];
  }

  /**
   * Returns the name of the primary actor (the first key in the actor unit group map).
   *
   * @returns {string} Name of the primary actor.
   */
  getPrimaryActorName() {
    return Object.keys(this.getActorUnitGroups())[0];
  }

  /**
   * Finds and returns an available room instance for this activity, if any.
   *
   * @param {setup.Unit} [unit] - Optional unit to check for room availability.
   * @returns {setup.RoomInstance|null} A room instance if available, otherwise null.
   *
   * Iterates through all possible room templates, shuffles available rooms, and returns the first
   * room that does not already have an activity assigned. Used to ensure activities only occur in
   * valid, unoccupied rooms.
   */
  getAvailableRoomIfAny(unit) {
    const room_templates = this.getRoomTemplates();
    for (const template of room_templates) {
      const avail = State.variables.roomlist.getRoomInstances({ template: template });
      setup.rng.shuffleArray(avail);
      for (const test of avail) {
        if (!State.variables.activitylist.getActivityAt(test)) {
          return test;
        }
      }
    }
    return null;
  }

  /**
   * Determines if this activity can be generated for the given unit.
   *
   * @param {setup.Unit} unit - The unit to check eligibility for.
   * @returns {boolean} True if the activity can be generated for the unit, false otherwise.
   *
   * Checks for tag bans, cooldowns, primary actor restrictions, actor group viability, prerequisite
   * satisfaction, and room availability. Used in activity selection and generation logic.
   */
  isCanGenerateFor(unit) {
    if (State.variables.settings.isBanned(this.getTags())) return false;
    if (State.variables.calendar.isOnCooldown(this)) return false;
    const primary_restrictions = this.getPrimaryActorRestrictions();
    if (!setup.RestrictionLib.isUnitSatisfy(unit, primary_restrictions)) {
      return false;
    }
    const actor_unit_groups = this.getActorUnitGroups();
    if (!setup.RestrictionLib.isActorUnitGroupViable(actor_unit_groups)) return false;
    const restrictions = this.getPrerequisites();
    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, restrictions)) {
      return false;
    }
    if (!this.getAvailableRoomIfAny(unit)) {
      return false;
    }
    return true;
  }

  /**
   * Returns the list of critical traits for this activity template.
   *
   * @returns {setup.Trait[]} Array of critical trait objects.
   *
   * Units with these traits are more likely to be selected for this activity.
   */
  getCriticalTraits() {
    return this.critical_trait_keys.map(key => setup.trait[key]);
  }

  /**
   * Returns the list of disaster traits for this activity template.
   *
   * @returns {setup.Trait[]} Array of disaster trait objects.
   *
   * Units with these traits are less likely to be selected for this activity.
   */
  getDisasterTraits() {
    return this.disaster_trait_keys.map(key => setup.trait[key]);
  }

  /**
   * Computes the selection weight for this activity for a given unit.
   *
   * @param {setup.Unit} unit - The unit to compute the weight for.
   * @returns {number} The computed weight value.
   *
   * The weight is determined by the number of critical and disaster traits the unit has,
   * using predefined multipliers. Higher weight increases the chance of this activity
   * being selected for the unit.
   */
  computeWeight(unit) {
    const critTraits = this.getCriticalTraits();
    const disasterTraits = this.getDisasterTraits();
    const crits = critTraits.filter(trait => unit.isHasTraitExact(trait)).length;
    const disasters = disasterTraits.filter(trait => unit.isHasTraitExact(trait)).length;
    const crit_mult = setup.ACTIVITY_CHANCE_MULTIPLIER_CRIT_TRAITS;
    const disaster_mult = setup.ACTIVITY_CHANCE_MULTIPLIER_DISASTER_TRAITS;
    return (
      crit_mult[Math.min(crits, crit_mult.length - 1)] *
      disaster_mult[Math.min(disasters, disaster_mult.length - 1)]
    );
  }

  /**
   * Returns the names of all actors required by this activity template.
   *
   * @returns {string[]} Array of actor names.
   */
  getAllActorNames() {
    return Object.keys(this.getActorUnitGroups());
  }

  /**
   * Attempts to instantiate an activity from this template for the given unit.
   *
   * @param {setup.Unit} [unit] - The unit to use as the primary actor, if provided.
   * @returns {setup.ActivityInstance|null} The created activity instance, or null if instantiation failed.
   *
   * Finds an available room, instantiates actors, and creates a new ActivityInstance.
   * Returns null if no suitable room or actors are found.
   */
  makeInstance(unit) {
    const room = this.getAvailableRoomIfAny(unit);
    if (!room) {
      // No available room for this activity.
      return null;
    }
    const actor_name_primary = this.getPrimaryActorName();
    /** @type {Object<string, setup.Unit>} */
    const default_actors = {};
    if (unit) {
      default_actors[actor_name_primary] = unit;
    }
    const actors = setup.QuestPool.instantiateActors(this, default_actors);
    if (!actors) {
      // Could not find suitable actors.
      return null;
    }
    return new setup.ActivityInstance(this, actors, room);
  }

  /**
   * Debug utility: forcibly creates an activity instance, bypassing normal restrictions.
   *
   * @param {boolean} efficient_mode - If true, uses efficient actor generation for testing.
   * @returns {setup.ActivityInstance} The created activity instance.
   *
   * Deletes all existing activities, attempts to create a normal instance, and if that fails,
   * forcibly selects a random room and generates actors for testing or debugging purposes.
   */
  debugMakeInstance(efficient_mode) {
    State.variables.activitylist.deleteAllActivities();
    // Try to make instance normally first.
    const instance = this.makeInstance(undefined);
    if (instance) {
      return instance;
    }
    let room = this.getAvailableRoomIfAny(undefined);
    if (!room) {
      // Force a random room if none available.
      room = setup.rng.choice(State.variables.roomlist.getRoomInstances());
    }
    // Generate actors for this activity.
    const actors = setup.DebugActor.getActors(this.getActorUnitGroups(), efficient_mode);
    // Instantiate the activity.
    return new setup.ActivityInstance(this, actors, /** @type {setup.RoomInstance} */(room));
  }
};
