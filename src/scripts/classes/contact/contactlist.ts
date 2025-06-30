// @ts-ignore
declare const setup: any;
// @ts-ignore
declare const State: any;

/**
 * ContactList manages a list of Contact keys and provides methods to add, remove, retrieve, and advance contacts.
 * @class
 */
// @ts-ignore
setup.ContactList = class ContactList extends setup.TwineClass {
  contact_keys: Array<string | number>;

  constructor() {
    super();
    this.contact_keys = [];
  }

  getContacts(template?: any): any[] {
    let result = this.contact_keys.map(key => State.variables.contact[key]);
    if (template) {
      result = result.filter((contact: any) => contact && contact.getTemplate() === template);
    }
    return result;
  }

  addContact(contact: any): void {
    if (!contact) throw new Error("Contact undefined adding contact to contactlist");
    if (this.contact_keys.includes(contact.key)) throw new Error(`Contact ${contact.key} already in contactlist`);
    this.contact_keys.push(contact.key);
    State.variables.statistics.add('contact_obtained', 1);
    // @ts-ignore
    setup.notify(`<<successtext 'New contact'>>: ${contact.rep()}`);
  }

  removeContact(contact: any): void {
    if (!contact) throw new Error("Contact undefined removing contact to contactlist");
    const idx = this.contact_keys.indexOf(contact.key);
    if (idx === -1) throw new Error(`Contact ${contact.key} not found in contactlist`);
    this.contact_keys.splice(idx, 1);
    // @ts-ignore
    setup.queueDelete(contact, 'contact');
  }

  isHasContact(template: any): boolean {
    return this.getContacts().some((contact: any) => contact && contact.getTemplate() === template);
  }

  advanceWeek(): void {
    const to_remove: any[] = [];
    const contacts = this.getContacts();
    for (let i = 0; i < contacts.length; ++i) {
      const contact = contacts[i];
      if (!contact) continue;
      contact.apply();
      contact.advanceWeek();
      if (contact.isExpired()) {
        to_remove.push(contact);
      }
    }
    for (let i = 0; i < to_remove.length; ++i) {
      this.removeContact(to_remove[i]);
    }
  }
};
