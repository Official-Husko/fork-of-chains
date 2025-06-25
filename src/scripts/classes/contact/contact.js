/**
 * Represents a Contact in the game, which may be associated with a unit and is based on a ContactTemplate.
 * Handles contact lifecycle, activation, expiration, and application of template effects.
 * Ensures unique keys, manages unit association, and provides robust error handling and state management.
 *
 * @class Contact
 * @property {string|number} key - Unique identifier for this contact.
 * @property {boolean} is_active - Whether this contact is currently active.
 * @property {string|number} template_key - Key of the associated ContactTemplate.
 * @property {number|null} expires_in - Number of weeks until expiration, or null if permanent.
 * @property {string|number|null} unit_key - Key of the associated unit, or null if none.
 */
setup.Contact = class Contact extends setup.TwineClass {
  /**
   * Constructs a new Contact instance. Registers itself in the global contact state and manages unit association.
   * Throws if the key is not unique or if the unit is already a contact.
   *
   * @param {string | number | null} key - Unique key for this contact, or null to auto-generate.
   * @param {setup.ContactTemplate} template - The template this contact is based on.
   * @param {setup.Unit} [unit] - Optional unit to associate with this contact.
   */
  constructor(key, template, unit) {
    super();
    // Auto-generate key if not provided
    if (!key) {
      key = State.variables.Contact_keygen;
      State.variables.Contact_keygen += 1;
    }
    this.is_active = true;
    this.template_key = template.key;
    this.expires_in = template.getExpiresIn();
    // Associate with a unit if provided, ensuring no duplicate contact assignment
    if (unit) {
      if (unit.contact_key) {
        throw new Error(`Unit is already a contact for contact ${unit.contact_key}`);
      }
      this.unit_key = unit.key;
      unit.contact_key = key;
      const group = unit.getUnitGroup();
      if (group) {
        group.removeUnit(unit);
      }
    } else {
      this.unit_key = null;
    }
    this.key = key;
    if (this.key in State.variables.contact) {
      throw new Error(`Duplicate key ${this.key} for contact`);
    }
    State.variables.contact[this.key] = this;
  }

  /**
   * Retrieves the associated unit for this contact, or null if none.
   * @returns {setup.Unit | null}
   */
  getUnit() {
    return this.unit_key ? State.variables.unit[this.unit_key] : null;
  }

  /**
   * Deletes this contact, cleaning up unit association and removing from global state.
   * If a unit is associated, its contact_key is cleared and it may be deleted if orphaned.
   */
  delete() {
    const unit = this.getUnit();
    if (unit) {
      unit.contact_key = null;
      unit.checkDelete();
    }
    delete State.variables.contact[this.key];
  }

  /**
   * Returns whether this contact is currently active.
   * @returns {boolean}
   */
  isActive() {
    return !!this.is_active;
  }

  /**
   * Toggles the active state of this contact.
   */
  toggleIsActive() {
    this.is_active = !this.is_active;
  }

  /**
   * Retrieves the ContactTemplate associated with this contact.
   * Returns null if the template key is missing or not found.
   *
   * @returns {setup.ContactTemplate|null}
   */
  getTemplate() {
    if (!this.template_key) return null;
    return setup.contacttemplate[this.template_key] || null;
  }

  /**
   * Returns a string representation of this contact, including the associated unit if present.
   *
   * @returns {string}
   */
  rep() {
    let base = setup.repMessage(this, "contactcardkey");
    const unit = this.getUnit();
    if (unit) {
      base += ` (${unit.rep()})`;
    }
    return base;
  }

  /**
   * Returns the passage name for this contact's description, as defined by its template.
   * Throws if the template is missing or the passage is null.
   *
   * @returns {string}
   */
  getDescriptionPassage() {
    const template = this.getTemplate();
    if (!template) throw new Error("Contact template not found");
    const passage = template.getDescriptionPassage();
    if (passage == null) throw new Error("Contact template description passage is null");
    return passage;
  }

  /**
   * Returns true if this contact can expire (i.e., has a finite expires_in value).
   * @returns {boolean}
   */
  isCanExpire() {
    return this.expires_in !== null && this.expires_in !== undefined;
  }

  /**
   * Returns the number of weeks until this contact expires. Throws if not expirable.
   * @returns {number}
   */
  getExpiresIn() {
    if (!this.isCanExpire()) throw new Error("Can't expire");
    if (typeof this.expires_in !== "number") throw new Error("expires_in is not a number");
    return this.expires_in;
  }

  /**
   * Returns the display name for this contact, as defined by its template.
   * @returns {string}
   */
  getName() {
    const template = this.getTemplate();
    if (!template) throw new Error("Contact template not found");
    return template.getName();
  }

  /**
   * Returns the array of restriction/apply objects for this contact, as defined by its template.
   * @returns {any[]}
   */
  getApplyObjs() {
    const template = this.getTemplate();
    if (!template) throw new Error("Contact template not found");
    return template.getApplyObjs();
  }

  /**
   * Advances the expiration timer by one week, if this contact can expire.
   * Does nothing if the contact is permanent.
   */
  advanceWeek() {
    if (!this.isCanExpire()) return;
    if (typeof this.expires_in === "number") {
      this.expires_in -= 1;
    }
  }

  /**
   * Returns true if this contact is expired (i.e., expires_in is zero or less).
   * @returns {boolean}
   */
  isExpired() {
    return typeof this.expires_in === "number" && this.expires_in <= 0;
  }

  /**
   * Applies all restrictions/effects associated with this contact, if it is active.
   * Uses the RestrictionLib to apply all effects to this contact.
   */
  apply() {
    if (this.isActive()) {
      setup.RestrictionLib.applyAll(this.getApplyObjs(), this);
    }
  }
};
