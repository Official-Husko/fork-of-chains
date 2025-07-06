// @ts-nocheck

// rename a unit's first name
setup.qcImpl.FirstName = class FirstName extends setup.Cost {
  /**
   * @param {string} actor_name 
   * @param {string} first_name 
   */
  constructor(actor_name, first_name) {
    super()

    this.actor_name = actor_name
    this.first_name = first_name
  }

  text() {
    return `setup.qc.FirstName('${this.actor_name}', '${setup.escapeJsString(this.first_name)}')`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)
    unit.setName(this.first_name, unit.getSurname())
  }

  explain(quest) {
    return `The first name of ${this.actor_name} becomes ${this.first_name}`
  }
}
