
setup.Contact = class Contact extends setup.TwineClass {
  /**
   * @param {string | number | null} key
   * @param {setup.ContactTemplate} template 
   * @param {setup.Unit} [unit]  Unit associated with this contact, if any
   */
  constructor(key, template, unit) {
    super()

    if (!key) {
      key = State.variables.Contact_keygen
      State.variables.Contact_keygen += 1
    }

    this.is_active = true
    this.template_key = template.key
    this.expires_in = template.getExpiresIn()

    if (unit) {
      if (unit.contact_key) {
        throw new Error(`Unit is already a contact for contact ${unit.contact_key}`)
      }
      this.unit_key = unit.key
      unit.contact_key = key
      if (unit.getUnitGroup()) {
        unit.getUnitGroup().removeUnit(unit)
      }
    } else {
      this.unit_key = null
    }

    this.key = key
    if (this.key in State.variables.contact) throw new Error(`Duplicate key ${this.key} for contact`)
    State.variables.contact[this.key] = this
  }

  /**
   * @returns {setup.Unit | null}
   */
  getUnit() {
    if (this.unit_key) {
      return State.variables.unit[this.unit_key]
    } else {
      return null
    }
  }

  delete() {
    const unit = this.getUnit()
    if (unit) {
      unit.contact_key = null
      unit.checkDelete()
    }
    delete State.variables.contact[this.key]
  }

  /**
   * @returns {boolean}
   */
  isActive() { return !!this.is_active }

  toggleIsActive() { this.is_active = !this.is_active }

  /**
   * @returns {setup.ContactTemplate}
   */
  getTemplate() {
    if (!this.template_key) return null
    return setup.contacttemplate[this.template_key]
  }

  rep() {
    let base = setup.repMessage(this, 'contactcardkey')
    if (this.getUnit()) {
      base += ` (${this.getUnit().rep()})`
    }
    return base
  }

  getDescriptionPassage() { return this.getTemplate().getDescriptionPassage() }

  isCanExpire() {
    if ((this.expires_in === null) || (this.expires_in === undefined)) return false
    return true
  }

  getExpiresIn() {
    if (!this.isCanExpire()) throw new Error(`Can't expire`)
    return this.expires_in
  }

  getName() { return this.getTemplate().getName() }

  getApplyObjs() { return this.getTemplate().getApplyObjs() }

  advanceWeek() {
    if (!this.isCanExpire()) return
    this.expires_in -= 1
  }

  isExpired() { return this.expires_in <= 0 }

  apply() {
    if (this.isActive()) {
      setup.RestrictionLib.applyAll(this.getApplyObjs(), this)
    }
  }

}
