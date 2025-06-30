// @ts-ignore
declare const setup: any;
// @ts-ignore
declare const State: any;

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
// @ts-ignore
setup.Contact = class Contact extends setup.TwineClass {
  key: string | number;
  is_active: boolean;
  template_key: string | number;
  expires_in: number | null;
  unit_key: string | number | null;

  constructor(key: string | number | null, template: any, unit?: any) {
    super();
    if (!key) {
      key = State.variables.Contact_keygen;
      State.variables.Contact_keygen += 1;
    }
    this.is_active = true;
    this.template_key = template.key;
    this.expires_in = template.getExpiresIn();
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
    // @ts-ignore
    this.key = key;
    if (this.key in State.variables.contact) {
      throw new Error(`Duplicate key ${this.key} for contact`);
    }
    State.variables.contact[this.key] = this;
  }

  getUnit(): any | null {
    return this.unit_key ? State.variables.unit[this.unit_key] : null;
  }

  delete(): void {
    const unit = this.getUnit();
    if (unit) {
      unit.contact_key = null;
      unit.checkDelete();
    }
    delete State.variables.contact[this.key];
  }

  isActive(): boolean {
    return !!this.is_active;
  }

  toggleIsActive(): void {
    this.is_active = !this.is_active;
  }

  getTemplate(): any | null {
    if (!this.template_key) return null;
    return setup.contacttemplate[this.template_key] || null;
  }

  rep(): string {
    // @ts-ignore
    let base = setup.repMessage(this, "contactcardkey");
    const unit = this.getUnit();
    if (unit) {
      base += ` (${unit.rep()})`;
    }
    return base;
  }

  getDescriptionPassage(): string {
    const template = this.getTemplate();
    if (!template) throw new Error("Contact template not found");
    const passage = template.getDescriptionPassage();
    if (passage == null) throw new Error("Contact template description passage is null");
    return passage;
  }

  isCanExpire(): boolean {
    return this.expires_in !== null && this.expires_in !== undefined;
  }

  getExpiresIn(): number {
    if (!this.isCanExpire()) throw new Error("Can't expire");
    if (typeof this.expires_in !== "number") throw new Error("expires_in is not a number");
    return this.expires_in;
  }

  getName(): string {
    const template = this.getTemplate();
    if (!template) throw new Error("Contact template not found");
    return template.getName();
  }

  getApplyObjs(): any[] {
    const template = this.getTemplate();
    if (!template) throw new Error("Contact template not found");
    return template.getApplyObjs();
  }

  advanceWeek(): void {
    if (!this.isCanExpire()) return;
    if (typeof this.expires_in === "number") {
      this.expires_in -= 1;
    }
  }

  isExpired(): boolean {
    return typeof this.expires_in === "number" && this.expires_in <= 0;
  }

  apply(): void {
    if (this.isActive()) {
      // @ts-ignore
      setup.RestrictionLib.applyAll(this.getApplyObjs(), this);
    }
  }
};
