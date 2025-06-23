
setup.qresImpl.NoContact = class NoContact extends setup.Restriction {
  constructor(contact_template) {
    super()

    this.template_key = contact_template.key
    if (!contact_template) throw new Error(`null template for no contact restriction`)
  }

  static NAME = 'Do NOT have a certain contact'
  static PASSAGE = 'RestrictionNoContact'

  text() {
    return `setup.qres.NoContact(setup.contacttemplate.${this.template_key})`
  }

  explain() {
    let contact = setup.contacttemplate[this.template_key]
    return `Do not have the contact: ${contact.rep()}`
  }

  isOk() {
    let contact = setup.contacttemplate[this.template_key]
    return !State.variables.contactlist.isHasContact(contact)
  }
}
