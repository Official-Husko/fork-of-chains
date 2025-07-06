// @ts-nocheck


setup.EquipmentPoolGroup = class EquipmentPoolGroup extends setup.EquipmentPool {
  constructor(key, group_chances) {
    super(key, undefined)

    // note: this is behaved as an equipment pool
    // group_chances: {equipment_pool_key: chance}

    for (let groupkey in group_chances.length) {
      if (!(groupkey in setup.equipmentpool)) throw new Error(`group ${groupkey} not recognized in ${key}`)
    }
    this.group_chances = group_chances
  }

  /**
   * @param {boolean} [is_normalize]
   * @returns {Array<[any, number]>}
   */
  getEquipmentPoolChances(is_normalize) {
    /**
     * @type {Array<[any, number]>}
     */
    const chances = []
    for (const key in this.group_chances) {
      chances.push([key, this.group_chances[key]])
    }
    if (is_normalize) {
      setup.rng.normalizeChanceArray(chances)
    }
    return chances
  }

  generateEquipment() {
    let key = setup.rng.sampleObject(this.group_chances, true)
    let pool = setup.equipmentpool[key]
    return pool.generateEquipment()
  }

  /**
   * @returns {number}
   */
  getAverageValue() {
    let average = 0.0
    for (const [pool_key, chance] of this.getEquipmentPoolChances()) {
      average += chance * setup.equipmentpool[pool_key].getAverageValue()
    }
    return Math.round(average)
  }
}


