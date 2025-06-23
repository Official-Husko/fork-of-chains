
// Don't put to class. ItemPoolGroup can be a thing in the future.
setup.ItemPool = class ItemPool {
  constructor(key, item_chances) {
    // equip_chances: {item_key: chance}
    this.key = key
    this.item_chances = item_chances

    if (key in setup.itempool) throw new Error(`Duplicate item pool key ${key}`)
    setup.itempool[key] = this
  }

  /**
   * @param {boolean} [is_normalize]
   * @returns {Array<[any, number]>}
   */
  getItemChances(is_normalize) {
    /**
     * @type {Array<[any, number]>}
     */
    const chances = []
    for (const key in this.item_chances) {
      chances.push([key, this.item_chances[key]])
    }
    if (is_normalize) {
      setup.rng.normalizeChanceArray(chances)
    }
    return chances
  }

  getName() {
    return this.key
  }

  rep() {
    return setup.repMessage(this, 'itempoolcardkey')
  }

  /**
   * @returns {number}
   */
  getAverageValue() {
    const chances_copy = this.getItemChances(/* normalize = */ true)
    let value = 0.0
    for (const [item_key, chance] of chances_copy) {
      value += chance * (setup.item[item_key].getValue() || 0)
    }
    return Math.round(value)
  }

  generateItem() {
    let item_key = setup.rng.sampleObject(this.item_chances, true)
    return setup.item[item_key]
  }
}

