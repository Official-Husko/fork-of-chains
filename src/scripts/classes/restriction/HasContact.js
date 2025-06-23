
setup.qresImpl.HasContact = class HasContact extends setup.Restriction {
  constructor(contact_template) {
    super()

    this.template_key = contact_template.key
    if (!contact_template) throw new Error(`null template for has contact restriction`)
  }

  static NAME = 'Must have a certain contact'
  static PASSAGE = 'RestrictionHasContact'

  text() {
    return `setup.qres.HasContact(setup.contacttemplate.${this.template_key})`
  }

  explain() {
    let contact = setup.contacttemplate[this.template_key]
    return `Must have the contact: ${contact.rep()}`
  }

  isOk() {
    let contact = setup.contacttemplate[this.template_key]
    return State.variables.contactlist.isHasContact(contact)
  }
}
