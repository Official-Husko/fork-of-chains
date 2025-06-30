/**
 * ContentTemplate.ts
 * ------------------
 * This module defines the ContentTemplate class, which provides a base for content/quest templates in the game.
 * It handles validation, author info parsing, tag management, actor unit group mapping, and difficulty assignment.
 *
 * Key Responsibilities:
 * - Validate and initialize all template properties.
 * - Parse and normalize author info.
 * - Validate, sort, and manage tags.
 * - Map actor names to unit group keys/objects.
 * - Provide extensibility for subclasses (event, quest, etc.).
 *
 * Best Practices:
 * - Use explicit type annotations for all parameters and properties.
 * - Throw clear errors for invalid input.
 * - Keep all validation and parsing logic encapsulated in the constructor.
 * - Document all public methods and properties.
 */

// Declare global game objects and helpers
// 'setup' is the SugarCube global for game logic and classes

declare const setup: any;

/**
 * Type for author info, which can be a string or an object with name and url.
 */
type AuthorInfo = string | { name: string; url: string };

/**
 * ContentTemplate defines the structure and behavior of a content/quest template, including tags, author, actor unit groups, and difficulty.
 */
export class ContentTemplate extends setup.TwineClass {
  TYPE: 'event' | 'quest' | 'opportunity' | 'activity' | 'interaction' | null = null;
  key: string;
  name: string;
  author: { name: string; url?: string };
  tags: string[];
  actor_unitgroup_key_map: Record<string, any>;
  difficulty: any;

  /**
   * Constructs a new ContentTemplate instance, validates input, and initializes all properties.
   * Throws if required fields are missing or invalid.
   *
   * @param key - Unique key for this template.
   * @param name - Display name for the template.
   * @param author - Author info (string or {name, url}).
   * @param tags - Array of tags for this template.
   * @param actor_unitgroups - Actor-to-unitgroup mapping.
   * @param difficulty - Difficulty level for the template.
   */
  constructor(
    key: string,
    name: string,
    author: AuthorInfo,
    tags: string[],
    actor_unitgroups: Record<string, any>,
    difficulty: any
  ) {
    super();
    this.TYPE = null; // Will be filled by subclass
    if (!key) throw new Error("quest key cannot be null");
    this.key = key;
    if (name === null || name === undefined) throw new Error(`Name of quest ${key} cannot be null`);
    this.name = name;
    // Defensive: ensure author is string or {name, url}
    this.author = setup.QuestTemplate.parseAuthorInfo(author);
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
    if (actor_unitgroups) {
      this.actor_unitgroup_key_map = setup.ActorHelper.parseMap(actor_unitgroups);
    } else {
      this.actor_unitgroup_key_map = {};
    }
    this.difficulty = difficulty;
  }

  /**
   * Returns the template object (to be overridden by subclasses).
   */
  getTemplate(): null {
    return null;
  }

  /**
   * Returns the parsed author info object.
   */
  getAuthor(): { name: string; url?: string } {
    return this.author;
  }

  /**
   * Returns the tags associated with this template.
   */
  getTags(): string[] {
    return this.tags;
  }

  /**
   * Returns the difficulty level for this template.
   */
  getDifficulty(): any {
    return this.difficulty;
  }

  /**
   * Returns the display name for this template.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Returns the actor unit groups for this template, parsed from the key map.
   */
  getActorUnitGroups(): Record<string, any> {
    return setup.ActorHelper.parseUnitGroups(this.actor_unitgroup_key_map);
  }

  /**
   * Returns the subraces directly involved in this quest, based on actor unit groups.
   */
  getActorSubraces(): any[] {
    const subraces = setup.TraitHelper.getAllTraitsOfTags(['subrace']);
    const unit_groups = this.getActorUnitGroups();
    const found: Record<string, boolean> = {};
    for (const group of Object.values(unit_groups)) {
      if (group instanceof setup.UnitGroup) {
        const pools_objs = group.getUnitPools();
        const races: Record<string, boolean> = {};
        for (const pool_obj of pools_objs) {
          const pool = Array.isArray(pool_obj) ? pool_obj[0] : pool_obj;
          let subrace = null;
          for (const subrace_test of subraces) {
            if (pool.key.startsWith(subrace_test.key)) {
              subrace = subrace_test;
              break;
            }
          }
          if (subrace) {
            // @ts-ignore
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
   */
  getActorResultJob(actor_name: string): any {
    return null;
  }
}
