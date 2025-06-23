
// Will be assigned to $contactlist
setup.ContactList = class ContactList extends setup.TwineClass {
  constructor() {
    super()
    this.contact_keys = []
  }

  /**
   * @param {setup.ContactTemplate} [template]
   * @returns {setup.Contact[]}
   */
  getContacts(template) {
    let result = this.contact_keys.map(key => State.variables.contact[key])
    if (template) {
      result = result.filter(contact => contact.getTemplate() == template)
    }
    return result
  }

  addContact(contact) {
    State.variables.statistics.add('contact_obtained', 1)

    if (!contact) throw new Error(`Contact undefined adding contact to contactlist`)
    if (this.contact_keys.includes(contact.key)) throw new Error(`Contact ${contact.key} already in contactlist`)
    this.contact_keys.push(contact.key)
    setup.notify(`<<successtext 'New contact'>>: ${contact.rep()}`)
  }

  removeContact(contact) {
    if (!contact) throw new Error(`Contact undefined removing contact to contactlist`)
    if (!this.contact_keys.includes(contact.key)) throw new Error(`Contact ${contact.key} not found in contactlist`)
    this.contact_keys = this.contact_keys.filter(contact_key => contact_key != contact.key)
    setup.queueDelete(contact, 'contact')
  }

  isHasContact(template) {
    let contacts = this.getContacts()
    for (let i = 0; i < contacts.length; ++i) {
      if (contacts[i].getTemplate() == template) return true
    }
    return false
  }

  advanceWeek() {
    let to_remove = []
    let contacts = this.getContacts()
    for (let i = 0; i < contacts.length; ++i) {
      let contact = contacts[i]
      contact.apply()
      contact.advanceWeek()
      if (contact.isExpired()) {
        to_remove.push(contact)
      }
    }
    for (let i = 0; i < to_remove.length; ++i) {
      this.removeContact(to_remove[i])
    }
  }

}
