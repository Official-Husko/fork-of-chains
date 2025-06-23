setup.qresImpl.SexCanUnequip = class SexCanUnequip extends setup.SexRestriction {
  /**
   * @param {setup.EquipmentSlot} equipment_slot
   */
  constructor(equipment_slot) {
    super()
    this.equipment_slot = equipment_slot
  }

  explain() {
    return `Can unequip ${this.equipment_slot.rep()}`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    for (const bodypart of setup.SexBodypart.getAllBodyparts()) {
      if (bodypart.isHasBodypart(unit, this.sex)) {
        const eq = this.sex.getBlockingEquipment(unit, bodypart)
        if (eq && eq.getSlot() == this.equipment_slot) return true
      }
    }
    return false
  }
}


