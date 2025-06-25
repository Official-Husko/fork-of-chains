/**
 * @file contacttemplate.js
 * @module ContactTemplate
 * @description
 * Provides the ContactTemplate class for defining templates for contacts in the game.
 * Handles validation, property management, and provides accessors for template data and restrictions.
 * Ensures unique keys, robust error handling, and type safety.
 */

/**
 * ContactTemplate defines the structure and behavior of a contact template, including tags, restrictions, and expiration.
 * @class
 * @property {string} key - Unique identifier for this contact template.
 * @property {string} name - Display name for the contact template.
 * @property {string[]} tags - Array of tags describing the template's properties.
 * @property {string|null} description_passage - Passage name for the template's description, or null if none.
 * @property {any[]} apply_objs - Array of restriction/apply objects for this template.
 * @property {number|undefined} expires_in - Number of weeks until expiration, or undefined if permanent.
 */
setup.ContactTemplate = class ContactTemplate extends setup.TwineClass {
  /**
   * Constructs a new ContactTemplate instance, validates input, and registers itself globally.
   * Throws if required fields are missing or if the key is not unique.
   *
   * @param {string} key - Unique key for this template.
   * @param {string} name - Display name for the template.
   * @param {string[]} tags - Array of tags for this template.
   * @param {string|null} description_passage - Passage name for the template's description, or null.
   * @param {any[]} apply_objs - Array of restriction/apply objects.
   * @param {number|undefined} [expires_in] - Optional number of weeks until expiration.
   */
  constructor(key, name, tags, description_passage, apply_objs, expires_in) {
    super();
    if (!key) throw new Error(`Missing key for contact template`);
    this.key = key;
    if (!name) throw new Error(`Missing name for contact template ${key}`);
    this.name = name;
    if (!Array.isArray(tags)) throw new Error(`Tags must be an array for contact template ${key}`);
    this.tags = tags;
    this.description_passage = description_passage ?? null;
    if (!Array.isArray(apply_objs)) throw new Error(`apply_objs must be an array for contact template ${key}`);
    this.apply_objs = apply_objs;
    for (let i = 0; i < this.apply_objs.length; ++i) {
      if (!this.apply_objs[i]) throw new Error(`${i}-th applyobj for contact template ${key} missing`);
    }
    this.expires_in = expires_in;
    if (this.key in setup.contacttemplate) throw new Error(`Duplicate key ${this.key} for contact template`);
    setup.contacttemplate[this.key] = this;
  }

  /**
   * Returns true if this template can be deactivated (i.e., does not have the 'alwaysactive' tag).
   * @returns {boolean}
   */
  isCanDeactivate() {
    return !this.getTags().includes('alwaysactive');
  }

  /**
   * Returns the tags associated with this template.
   * @returns {string[]}
   */
  getTags() {
    return this.tags;
  }

  /**
   * Returns the passage name for this template's description, or null if none.
   * @returns {string|null}
   */
  getDescriptionPassage() {
    return this.description_passage;
  }

  /**
   * Returns the display name for this template.
   * @returns {string}
   */
  getName() {
    return this.name;
  }

  /**
   * Returns the array of restriction/apply objects for this template.
   * @returns {any[]}
   */
  getApplyObjs() {
    return this.apply_objs;
  }

  /**
   * Returns the number of weeks until this template expires, or undefined if permanent.
   * @returns {number|undefined}
   */
  getExpiresIn() {
    return this.expires_in;
  }

  /**
   * Returns a string representation of this template (the display name).
   * @returns {string}
   */
  rep() {
    return this.getName();
  }
};
