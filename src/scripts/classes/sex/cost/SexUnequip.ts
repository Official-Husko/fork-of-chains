// @ts-nocheck

setup.qcImpl.SexUnequip = class SexUnequip extends setup.SexCost {
  /**
   * @param {string} actor_name
   * @param {setup.EquipmentSlot} equipment_slot
   */
  constructor(actor_name, equipment_slot) {
    super()
    this.actor_name = actor_name
    this.equipment_slot = equipment_slot
  }

  /**
   * @param {setup.SexAction} action
   */
  apply(action) {
    const unit = action.getActorUnit(this.actor_name)

    const eq = unit.getEquipmentAt(this.equipment_slot)
    if (!eq) return

    this.sex.displaceEquipment(unit, eq)
  }

  explain() {
    return `${this.actor_name} unequips ${this.equipment_slot.rep()}`
  }
}
