// @ts-nocheck


setup.qcImpl.EquipmentDirect = class EquipmentDirect extends setup.Cost {
  /**
   * @param {setup.Equipment} equipment 
   */
  constructor(equipment) {
    super()
    
    if (!equipment) throw new Error(`Null equipment pool`)
    this.equipment_key = setup.keyOrSelf(equipment)
  }

  text() {
    return `setup.qc.EquipmentDirect('${this.equipment_key}')`
  }

  /**
   * @param {object=} quest 
   */
  apply(quest) {
    State.variables.armory.addEquipment(setup.equipment[this.equipment_key])
  }

  explain() {
    let equipment = setup.equipment[this.equipment_key]
    return `Gain ${equipment.rep()}`
  }
}
