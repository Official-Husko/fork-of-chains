// @ts-nocheck

setup.qcImpl.Contact = class Contact extends setup.Cost {
  /**
   * 
   * @param {setup.ContactTemplate | string} contacttemplate 
   * @param {string} [actor_name]
   * @param {setup.UnitGroup | string} [unit_group]
   */
  constructor(contacttemplate, actor_name, unit_group) {
    super()

    this.contacttemplate_key = setup.keyOrSelf(contacttemplate)
    this.actor_name = actor_name
    this.unit_group_key = null
    if (unit_group) {
      this.unit_group_key = setup.keyOrSelf(unit_group)
    }
    if (actor_name && unit_group) {
      throw new Error(`Can't have both unit group and actor`)
    }
  }

  text() {
    return `setup.qc.Contact(setup.contacttemplate.${this.contacttemplate_key}, ${this.actor_name ? `'${this.actor_name}'` : 'null'}, ${this.unit_group_key ? `'${this.unit_group_key}'` : 'null'})`
  }

  getTemplate() {
    return setup.contacttemplate[this.contacttemplate_key]
  }

  getUnitGroup() {
    if (this.unit_group_key) {
      return setup.unitgroup[this.unit_group_key]
    } else {
      return null
    }
  }

  apply(quest) {
    const template = setup.contacttemplate[this.contacttemplate_key]

    let unit
    if (this.actor_name) {
      unit = quest.getActorUnit(this.actor_name)
    } else if (this.getUnitGroup()) {
      unit = this.getUnitGroup().getUnit()
    } else {
      unit = null
    }

    State.variables.contactlist.addContact(
      new setup.Contact(/* key */ null, template, unit)
    )
  }

  explain() {
    let base = `Get a new contact: ${this.getTemplate().rep()}`
    if (this.getUnitGroup()) {
      base += ` from ${this.getUnitGroup().rep()}`
    } else if (this.actor_name) {
      base += ` with unit ${this.actor_name}`
    }
    return base
  }
}
