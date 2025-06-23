setup.qcImpl.ContactLose = class ContactLose extends setup.Cost {
  /**
   * 
   * @param {setup.ContactTemplate | string} contacttemplate 
   */
  constructor(contacttemplate) {
    super()

    this.contacttemplate_key = setup.keyOrSelf(contacttemplate)
  }

  text() {
    return `setup.qc.ContactLose(setup.contacttemplate.${this.contacttemplate_key})`
  }

  getTemplate() {
    return setup.contacttemplate[this.contacttemplate_key]
  }

  apply(quest) {
    const template = setup.contacttemplate[this.contacttemplate_key]
    const contacts = State.variables.contactlist.getContacts(template)
    for (const contact of contacts) {
      State.variables.contactlist.removeContact(contact)
    }
  }

  explain() {
    return `Lose contact: ${this.getTemplate().rep()}`
  }
}
