// rename a unit's first name
setup.qcImpl.Surname = class Surname extends setup.Cost {
  /**
   * @param {string} actor_name 
   * @param {string} surname 
   */
  constructor(actor_name, surname) {
    super()

    this.actor_name = actor_name
    this.surname = surname
  }

  text() {
    return `setup.qc.Surname('${this.actor_name}', '${setup.escapeJsString(this.surname)}')`
  }

  apply(quest) {
    /**
     * @type {setup.Unit}
     */
    const unit = quest.getActorUnit(this.actor_name)
    unit.setName(unit.getFirstName(), this.surname)
  }

  explain(quest) {
    return `The surname of ${this.actor_name} becomes ${this.surname}`
  }
}
