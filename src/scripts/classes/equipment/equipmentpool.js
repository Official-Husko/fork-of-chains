
setup.EquipmentPool = class EquipmentPool extends setup.TwineClass {
  constructor(key, equip_chances) {
    super()
    // equip_chances: {equipment_key: chance}
    this.key = key
    this.equip_chances = equip_chances

    if (key in setup.equipmentpool) throw new Error(`Duplicate equipment pool key ${key}`)
    setup.equipmentpool[key] = this
  }

  getName() {
    return this.key
  }

  rep() {
    return setup.repMessage(this, 'equipmentpoolcardkey')
  }

  /**
   * @param {boolean} [is_normalize]
   * @returns {Array<[any, number]>}
   */
  getEquipmentChances(is_normalize) {
    /**
     * @type {Array<[any, number]>}
     */
    const chances = []
    for (const key in this.equip_chances) {
      chances.push([key, this.equip_chances[key]])
    }
    if (is_normalize) {
      setup.rng.normalizeChanceArray(chances)
    }
    return chances
  }

  /**
   * @returns {number}
   */
  getAverageValue() {
    const chances_copy = this.getEquipmentChances(/* normalize = */ true)
    let value = 0.0
    for (const [equipment_key, chance] of chances_copy) {
      value += chance * (setup.equipment[equipment_key].getValue() || 0)
    }
    return Math.round(value)
  }

  generateEquipment() {
    let equip_key = setup.rng.sampleObject(this.equip_chances, true)
    return setup.equipment[equip_key]
  }

}
