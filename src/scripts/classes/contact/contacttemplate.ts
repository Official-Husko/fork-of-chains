// @ts-ignore
declare const setup: any;

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
// @ts-ignore
setup.ContactTemplate = class ContactTemplate extends setup.TwineClass {
  key: string;
  name: string;
  tags: string[];
  description_passage: string | null;
  apply_objs: any[];
  expires_in?: number;

  constructor(
    key: string,
    name: string,
    tags: string[],
    description_passage: string | null,
    apply_objs: any[],
    expires_in?: number
  ) {
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

  isCanDeactivate(): boolean {
    return !this.getTags().includes('alwaysactive');
  }

  getTags(): string[] {
    return this.tags;
  }

  getDescriptionPassage(): string | null {
    return this.description_passage;
  }

  getName(): string {
    return this.name;
  }

  getApplyObjs(): any[] {
    return this.apply_objs;
  }

  getExpiresIn(): number | undefined {
    return this.expires_in;
  }

  rep(): string {
    return this.getName();
  }
};
