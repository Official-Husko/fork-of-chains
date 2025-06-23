setup.qcImpl.EquipmentLose = class EquipmentLose extends setup.Cost {
  /**
   * @param {setup.Equipment} equipment 
   */
  constructor(equipment) {
    super()

    this.equipment_key = setup.keyOrSelf(equipment)
  }

  text() {
    return `setup.qc.EquipmentLose(setup.equipment.${this.equipment_key})`
  }

  getEquipment() { return setup.equipment[this.equipment_key] }

  apply(quest) {
    const equipment = this.getEquipment()
    if (State.variables.armory.getEquipmentCount(equipment)) {
      State.variables.armory.removeEquipment(equipment, 1)
    }
  }

  explain() {
    return `Lose ${this.getEquipment().rep()}`
  }
}
