setup.qcImpl.SexEquip = class SexEquip extends setup.SexCost {
  /**
   * @param {string} actor_name
   * @param {setup.Equipment} equipment
   */
  constructor(actor_name, equipment) {
    super()
    this.actor_name = actor_name
    this.equipment = equipment
  }

  /**
   * @param {setup.SexAction} action
   */
  apply(action) {
    const unit = action.getActorUnit(this.actor_name)
    this.sex.equipTemporarily(unit, this.equipment)
  }

  explain() {
    return `${this.actor_name} equips ${this.equipment.rep()}`
  }
}
