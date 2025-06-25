/**
 * @file ContentTemplate.js
 * @module ContentTemplate
 * @description
 * Provides the ContentTemplate class for defining and validating content/quest templates in the game.
 * Handles author info, tag validation, actor unit group mapping, and difficulty assignment.
 * Ensures robust error handling, type safety, and extensibility for future content features.
 */

/**
 * ContentTemplate defines the structure and behavior of a content/quest template, including tags, author, actor unit groups, and difficulty.
 * @class
 * @property {string} key - Unique identifier for this content template.
 * @property {string} name - Display name for the content template.
 * @property {object} author - Author info object (parsed from string or object).
 * @property {string[]} tags - Array of tags describing the template's properties.
 * @property {object} actor_unitgroup_key_map - Mapping of actor names to unit group keys/objects.
 * @property {setup.QuestDifficulty} difficulty - Difficulty level for the content template.
 * @property {string|null} TYPE - Type of content (event, quest, opportunity, etc.), set by subclasses.
 */
export class ContentTemplate extends setup.TwineClass {
  /**
   * Constructs a new ContentTemplate instance, validates input, and initializes all properties.
   * Throws if required fields are missing or invalid.
   *
   * @param {string} key - Unique key for this template.
   * @param {string} name - Display name for the template.
   * @param {string|object} author - Author info (string or {name, url}).
   * @param {string[]} tags - Array of tags for this template.
   * @param {Object<string, any>} actor_unitgroups - Actor-to-unitgroup mapping.
   * @param {setup.QuestDifficulty} difficulty - Difficulty level for the template.
   */
  constructor(key, name, author, tags, actor_unitgroups, difficulty) {
    super();
    /**
     * @type {'event' | 'quest' | 'opportunity' | 'activity' | 'interaction' | null}
     */
    this.TYPE = null; // Will be filled by subclass
    if (!key) throw new Error("quest key cannot be null");
    this.key = key;
    if (name === null || name === undefined) throw new Error(`Name of quest ${key} cannot be null`);
    this.name = name;
    // Defensive: ensure author is string or {name, url}
    this.author = setup.QuestTemplate.parseAuthorInfo(/** @type {string | {name: string, url: string}} */(author));
    if (!Array.isArray(tags)) throw new Error(`Tags of quest ${key} must be an array. E.g., ['transformation']. Put [] for no tags.`);
    // Cache tag keys for performance
    const questTagKeys = Object.keys(setup.QUESTTAGS);
    // Validate and sort tags in a single pass
    this.tags = tags.slice(); // avoid mutating input
    for (let i = 0; i < this.tags.length; ++i) {
      if (!questTagKeys.includes(this.tags[i])) {
        throw new Error(`${i}-th tag (${this.tags[i]}) of quest ${key} not recognized. Please check spelling and compare with the tags in src/scripts/classes/quest/questtags.js`);
      }
    }
    this.tags.sort((a, b) => questTagKeys.indexOf(a) - questTagKeys.indexOf(b));
    /**
     * @type {Object<string, {type: string, val?: *, key?: string}>}
     */
    if (actor_unitgroups) {
      this.actor_unitgroup_key_map = setup.ActorHelper.parseMap(actor_unitgroups);
    } else {
      this.actor_unitgroup_key_map = {};
    }
    this.difficulty = difficulty;
  }

  /**
   * Returns the template object (to be overridden by subclasses).
   * @returns {null}
   */
  getTemplate() { return null; }

  /**
   * Returns the parsed author info object.
   * @returns {object}
   */
  getAuthor() { return this.author; }

  /**
   * Returns the tags associated with this template.
   * @returns {string[]}
   */
  getTags() { return this.tags; }

  /**
   * Returns the difficulty level for this template.
   * @returns {setup.QuestDifficulty}
   */
  getDifficulty() { return this.difficulty; }

  /**
   * Returns the display name for this template.
   * @returns {string}
   */
  getName() { return this.name; }

  /**
   * Returns the actor unit groups for this template, parsed from the key map.
   * @returns {Object<string, setup.ContactTemplate | setup.UnitGroup | setup.Restriction[]>}
   */
  getActorUnitGroups() {
    return setup.ActorHelper.parseUnitGroups(this.actor_unitgroup_key_map);
  }

  /**
   * Returns the subraces directly involved in this quest, based on actor unit groups.
   * @returns {setup.Trait[]}
   */
  getActorSubraces() {
    const subraces = setup.TraitHelper.getAllTraitsOfTags(['subrace']);
    const unit_groups = this.getActorUnitGroups();
    /** @type {{[key: string]: boolean}} */
    const found = {};
    for (const group of Object.values(unit_groups)) {
      if (group instanceof setup.UnitGroup) {
        const pools_objs = group.getUnitPools();
        /** @type {{[key: string]: boolean}} */
        const races = {};
        for (const pool_obj of pools_objs) {
          /** @type {setup.UnitPool} */
          const pool = /** @type {setup.UnitPool} */(Array.isArray(pool_obj) ? pool_obj[0] : pool_obj);
          let subrace = null;
          for (const subrace_test of subraces) {
            if (pool.key.startsWith(subrace_test.key)) {
              subrace = subrace_test;
              break;
            }
          }
          if (subrace) {
            races[subrace.key] = true;
          }
        }
        if (Object.keys(races).length == 1) {
          found[Object.keys(races)[0]] = true;
        }
      }
    }
    return Object.keys(found).map(key => setup.trait[key]);
  }

  /**
   * Returns the result job for a given actor name (to be implemented in subclasses).
   * @param {string} actor_name
   * @returns {setup.Job | null}
   */
  getActorResultJob(actor_name) {
    return null;
  }
}
