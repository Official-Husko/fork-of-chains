/**
 * @file contactlist.js
 * @module ContactList
 * @description
 * Provides the ContactList class for managing a collection of Contact instances.
 * Handles creation, storage, retrieval, and lifecycle management of contacts, including filtering, addition, removal, and weekly advancement.
 * Ensures robust error handling, type safety, and performance.
 */

/**
 * ContactList manages a list of Contact keys and provides methods to add, remove, retrieve, and advance contacts.
 * @class
 */
setup.ContactList = class ContactList extends setup.TwineClass {
  /**
   * @type {Array<string|number>}
   * Array of contact keys managed by this list.
   */
  contact_keys;

  /**
   * Constructs a new ContactList instance.
   */
  constructor() {
    super();
    this.contact_keys = [];
  }

  /**
   * Retrieves all contacts, optionally filtered by a ContactTemplate.
   * @param {setup.ContactTemplate} [template] - Optional template to filter contacts by.
   * @returns {setup.Contact[]} Array of matching contacts.
   */
  getContacts(template) {
    let result = this.contact_keys.map(key => State.variables.contact[key]);
    if (template) {
      result = result.filter(contact => contact && contact.getTemplate() === template);
    }
    return result;
  }

  /**
   * Adds a contact to the list, ensuring uniqueness and updating statistics.
   * @param {setup.Contact} contact - The contact to add.
   */
  addContact(contact) {
    if (!contact) throw new Error("Contact undefined adding contact to contactlist");
    if (this.contact_keys.includes(contact.key)) throw new Error(`Contact ${contact.key} already in contactlist`);
    this.contact_keys.push(contact.key);
    State.variables.statistics.add('contact_obtained', 1);
    setup.notify(`<<successtext 'New contact'>>: ${contact.rep()}`);
  }

  /**
   * Removes a contact from the list and queues it for deletion.
   * @param {setup.Contact} contact - The contact to remove.
   */
  removeContact(contact) {
    if (!contact) throw new Error("Contact undefined removing contact to contactlist");
    const idx = this.contact_keys.indexOf(contact.key);
    if (idx === -1) throw new Error(`Contact ${contact.key} not found in contactlist`);
    this.contact_keys.splice(idx, 1);
    setup.queueDelete(contact, 'contact');
  }

  /**
   * Checks if the list contains a contact with the given template.
   * @param {setup.ContactTemplate} template - The template to check for.
   * @returns {boolean} True if a contact with the template exists, false otherwise.
   */
  isHasContact(template) {
    return this.getContacts().some(contact => contact && contact.getTemplate() === template);
  }

  /**
   * Advances all contacts by one week, applying their effects and removing expired ones.
   */
  advanceWeek() {
    const to_remove = [];
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
