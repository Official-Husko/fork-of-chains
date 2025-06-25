import { ContentTemplate } from "../content/ContentTemplate"

/**
 * @file event.js
 * @module Event
 * @description
 * Defines the Event class for in-game events, extending ContentTemplate. Handles event-specific logic such as passage execution, unit restrictions, rewards, requirements, cooldown, and rarity. Ensures robust validation, registration, and provides utility methods for event management and debugging.
 */

/**
 * Represents an in-game event, including passage, unit restrictions, rewards, requirements, cooldown, and rarity.
 * Extends ContentTemplate for tag, author, and actor group management.
 *
 * @class Event
 * @extends ContentTemplate
 */
setup.Event = class Event extends ContentTemplate {
  /**
   * Constructs a new Event instance, validates input, and registers the event.
   *
   * @typedef {{name: string, url: string}} AuthorInfo
   * @param {string} key - Unique event identifier.
   * @param {string} name - Display name for the event.
   * @param {string | AuthorInfo} author - Author info (string or object).
   * @param {string[]} tags - Array of tags for this event.
   * @param {string} passage - Passage to execute for this event.
   * @param {Object<string, setup.Restriction[]>} unit_restrictions - Restrictions per actor.
   * @param {Object<string, any>} actor_unitgroups - Actor-to-unitgroup mapping.
   * @param {setup.Cost[]} rewards - Effects of the event.
   * @param {setup.Restriction[]} requirements - Eligibility requirements.
   * @param {number} cooldown - Weeks until this event can trigger again (-1 for never).
   * @param {setup.Rarity} rarity - Rarity of the event.
   * @throws {Error} If input is invalid or event key is duplicated.
   */
  constructor(
    key,
    name,
    author,
    tags,
    passage,
    unit_restrictions,
    actor_unitgroups,
    rewards,
    requirements,
    cooldown,
    rarity
  ) {
    super(key, name, author, tags, actor_unitgroups, setup.qdiff.normal40);
    /**
     * Type of this content (always "event").
     * @type {"event"}
     */
    this.TYPE = "event";

    /**
     * Restrictions for each actor in the event.
     * @type {Object<string, setup.Restriction[]>}
     */
    this.unit_restrictions = unit_restrictions;
    for (const restriction of Object.values(unit_restrictions)) {
      if (!Array.isArray(restriction)) {
        throw new Error("(LEGACY) role of event " + this.key + " has a non-array restriction!");
      }
    }

    /**
     * Passage to execute for this event.
     * @type {string}
     */
    this.passage = passage;
    /**
     * Effects of the event.
     * @type {setup.Cost[]}
     */
    this.rewards = rewards;
    /**
     * Eligibility requirements for this event.
     * @type {setup.Restriction[]}
     */
    this.requirements = requirements;
    /**
     * Cooldown in weeks for this event (-1 for never).
     * @type {number}
     */
    this.cooldown = cooldown;

    if (!(rarity instanceof setup.Rarity)) throw new Error("Unknown rarity for event " + key + "!");
    /**
     * Rarity of the event.
     * @type {setup.Rarity}
     */
    this.rarity = rarity;

    if (key in setup.event) throw new Error("Event " + key + " already exists");
    setup.event[key] = this;
    setup.EventPool.registerEvent(this, rarity);
  }

  /**
   * Validates event parameters for sanity and uniqueness.
   * @param {string} key - Event key.
   * @param {string} name - Event name.
   * @param {string} desc - Event description.
   * @param {Object<string, setup.Restriction[]>} unit_criterias - Restrictions per actor.
   * @param {Object<string, any>} actor_unitgroups - Actor-to-unitgroup mapping.
   * @param {setup.Cost[]} outcomes - Event outcomes.
   * @param {setup.Restriction[]} restrictions - Event requirements.
   * @param {number} cooldown - Cooldown in weeks.
   * @param {setup.Rarity} rarity - Event rarity.
   * @returns {string|null} Error message if invalid, otherwise null.
   */
  static sanityCheck(
    key,
    name,
    desc,
    unit_criterias,
    actor_unitgroups,
    outcomes,
    restrictions,
    cooldown,
    rarity
  ) {
    if (!key) return "Key cannot be empty";
    if (key in setup.event) return "Key " + key + " is duplicated with another event";
    if (!name) return "Name cannot be null";
    if (!desc) return "Description cannot be empty";
    if (cooldown < -1) return "Cooldown cannot be below -1";
    for (let i = 0; i < restrictions.length; ++i) {
      // Defensive: try to extract actor_name if present, else fallback
      let actorName = "(unknown)";
      if (restrictions[i] && typeof restrictions[i] === "object" && restrictions[i] !== null) {
        // Use bracket notation and suppress type error for legacy/unknown structure
        // @ts-ignore
        if (typeof restrictions[i]["actor_name"] !== "undefined") {
          // @ts-ignore
          actorName = String(restrictions[i]["actor_name"]);
        }
      }
      if (!setup.QuestTemplate.isCostActorIn(restrictions[i], unit_criterias, actor_unitgroups)) {
        return "Actor " + actorName + " not found in the " + i + "-th event restriction";
      }
    }
    for (let i = 0; i < outcomes.length; ++i) {
      let actorName = "(unknown)";
      if (outcomes[i] && typeof outcomes[i] === "object" && outcomes[i] !== null) {
        // @ts-ignore
        if (typeof outcomes[i]["actor_name"] !== "undefined") {
          // @ts-ignore
          actorName = String(outcomes[i]["actor_name"]);
        }
      }
      if (!setup.QuestTemplate.isCostActorIn(outcomes[i], unit_criterias, actor_unitgroups)) {
        return "Actor " + actorName + " not found in the " + i + "-th event outcome";
      }
    }
    return null;
  }

  /**
   * Returns the display name for this event.
   * @returns {string}
   */
  rep() { return this.getName(); }

  /**
   * Returns the unit restrictions for this event.
   * @returns {Object<string, setup.Restriction[]>}
   */
  getUnitRestrictions() { return this.unit_restrictions; }

  /**
   * Returns all actor names involved in this event.
   * @returns {string[]}
   */
  getAllActorNames() {
    // Avoid duplicate actor names by using a Set
    return Array.from(new Set([
      ...Object.keys(this.getActorUnitGroups()),
      ...Object.keys(this.getUnitRestrictions())
    ]));
  }

  /**
   * Returns the passage to be executed for this event.
   * @returns {string}
   */
  getPassage() { return this.passage; }

  /**
   * Returns the rewards for this event.
   * @returns {setup.Cost[]}
   */
  getRewards() { return this.rewards; }

  /**
   * Returns the requirements for this event.
   * @returns {setup.Restriction[]}
   */
  getRequirements() { return this.requirements; }

  /**
   * Returns the cooldown for this event.
   * @returns {number}
   */
  getCooldown() { return this.cooldown; }

  /**
   * Returns the rarity for this event.
   * @returns {setup.Rarity}
   */
  getRarity() { return this.rarity; }

  /**
   * Returns the difficulty for this event, based on player level and plateau.
   * @returns {setup.QuestDifficulty}
   */
  getDifficulty() {
    const level = Math.min(State.variables.unit.player.getLevel(), setup.LEVEL_PLATEAU);
    return setup.qdiff["normal" + level];
  }

  /**
   * Returns the result job for a given actor name, based on rewards.
   * @param {string} actor_name
   * @returns {setup.Job|null}
   */
  getActorResultJob(actor_name) {
    for (const cost of this.getRewards()) {
      // @ts-ignore
      if (cost.IS_SLAVE && cost.getActorName() === actor_name) return setup.job.slave;
      // @ts-ignore
      if (cost.IS_SLAVER && cost.getActorName() === actor_name) return setup.job.slaver;
    }
    return null;
  }

  /**
   * Debug utility: creates an instance of this event with random or efficient unit assignment.
   * Optimized for performance and clarity.
   * @param {boolean} is_efficient - If true, assign available player units efficiently.
   * @returns {setup.EventInstance}
   */
  debugMakeInstance(is_efficient) {
    let assignment = setup.EventPool.getEventUnitAssignmentRandom(this, {});
    // Cache unit restrictions and actor unit groups for performance
    const unit_restrictions = this.getUnitRestrictions();
    const actor_unitgroup = this.getActorUnitGroups();
    const actor_keys = Object.keys(unit_restrictions);
    if (!assignment) {
      // Early return if there are no unit restrictions
      if (actor_keys.length === 0) {
        return new setup.EventInstance(this, {});
      }
      /** @type {any} */
      assignment = {};
      let available_units = State.variables.company.player.getUnits({}, null)
        .filter(unit => !unit.isEngaged() && !State.variables.leave.isOnLeave(unit));
      if (is_efficient) {
        setup.rng.shuffleArray(available_units);
      }
      for (const actor_key of actor_keys) {
        // @ts-ignore
        if (is_efficient && available_units.length > 0) {
          // @ts-ignore
          assignment[actor_key] = available_units.shift();
        } else {
          // @ts-ignore
          assignment[actor_key] = setup.unitpool.subrace_lizardkin_male.generateUnit();
          // @ts-ignore
          State.variables.company.player.addUnit(assignment[actor_key], setup.job.slaver);
        }
      }
    }
    const actors = setup.DebugActor.getActors(actor_unitgroup, is_efficient);
    const finalized_assignment = setup.EventPool.finalizeEventAssignment(this, assignment, actors) || {};
    return new setup.EventInstance(this, finalized_assignment);
  }

  /**
   * Determines if this event can be generated right now, based on settings, requirements, and cooldown.
   * @returns {boolean}
   */
  isCanGenerate() {
    if (State.variables.settings.isBanned(this.getTags())) return false;
    if (!setup.RestrictionLib.isPrerequisitesSatisfied(this, this.getRequirements())) return false;
    if (!setup.RestrictionLib.isActorUnitGroupViable(this.getActorUnitGroups())) return false;
    if (State.variables.calendar.isOnCooldown(this)) return false;
    return true;
  }
};
