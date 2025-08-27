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

import type { CONTACT_TEMPLATE_DEFINITIONS } from "../../data/contacts/_index";
import { TwineClass } from "../_TwineClass";
import type { UnitKey } from "../unit/Unit";
import type { ContactTemplate, ContactTemplateKey } from "./ContactTemplate";

export type ContactKey = keyof typeof CONTACT_TEMPLATE_DEFINITIONS | number;
//export type ContactKey = BrandedType<string | number, "ContactKey">;

export class Contact extends TwineClass {
  key: ContactKey;
  is_active: boolean;
  template_key: ContactTemplateKey;
  expires_in: number | undefined;
  unit_key: UnitKey | null;

  constructor(
    key: string | number | null,
    template: ContactTemplate,
    unit?: Unit | null,
  ) {
    super();

    if (key) {
      this.key = key as ContactKey;
    } else {
      this.key = State.variables.Contact_keygen++ as ContactKey;
    }

    this.is_active = true;
    this.template_key = template.key;
    this.expires_in = template.getExpiresIn();
    if (unit) {
      if (unit.contact_key) {
        throw new Error(
          `Unit is already a contact for contact ${unit.contact_key}`,
        );
      }
      this.unit_key = unit.key;
      unit.contact_key = key as ContactKey;
      const group = unit.getUnitGroup();
      if (group) {
        group.removeUnit(unit);
      }
    } else {
      this.unit_key = null;
    }

    if (this.key in State.variables.contact) {
      throw new Error(`Duplicate key ${this.key} for contact`);
    }
    State.variables.contact[this.key] = this;
  }

  getUnit(): Unit | null {
    return this.unit_key ? State.variables.unit[this.unit_key] : null;
  }

  delete(): void {
    const unit = this.getUnit();
    if (unit) {
      unit.contact_key = undefined;
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

  getTemplate(): ContactTemplate | null {
    if (!this.template_key) return null;
    return setup.contacttemplate[this.template_key] || null;
  }

  getRepMacro() {
    return "contactcard";
  }

  rep(): string {
    let base = setup.repMessage(this);
    const unit = this.getUnit();
    if (unit) {
      base += ` (${unit.rep()})`;
    }
    return base;
  }

  getDescription(): string {
    const template = this.getTemplate();
    if (!template) throw new Error("Contact template not found");
    const descr = template.getDescription();
    if (descr == null) throw new Error("Contact template description is null");
    return descr;
  }

  isCanExpire(): boolean {
    return this.expires_in !== null && this.expires_in !== undefined;
  }

  getExpiresIn(): number {
    if (!this.isCanExpire()) throw new Error("Can't expire");
    if (typeof this.expires_in !== "number")
      throw new Error("expires_in is not a number");
    return this.expires_in;
  }

  getName(): string {
    const template = this.getTemplate();
    if (!template) throw new Error("Contact template not found");
    return template.getName();
  }

  getApplyObjs(): Cost[] {
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
      setup.RestrictionLib.applyAll(this.getApplyObjs(), this as any);
    }
  }
}
