// @ts-nocheck

setup.qresImpl.Equipped = class Equipped extends setup.Restriction {
  /**
   * @param {setup.Equipment} equipment 
   */
  constructor(equipment) {
    super()

    if (!equipment) throw new Error(`Equipment null in Equipped`)
    this.equipment_key = setup.keyOrSelf(equipment)
  }

  /**
   * @returns {setup.Equipment}
   */
  getEquipment() {
    return setup.equipment[this.equipment_key]
  }

  text() {
    return `setup.qres.Equipped('${this.equipment_key}')`
  }

  explain() {
    return `equips ${this.getEquipment().rep()}`
  }

  /**
   * @param {setup.Unit} unit 
   */
  isOk(unit) {
    const equipment = this.getEquipment()
    return unit.getEquipmentAt(equipment.getSlot()) == equipment
  }
}
