setup.qresImpl.SexIsInLocationWithFurniture = class SexIsInLocationWithFurniture extends setup.SexRestriction {
  /**
   * @param {setup.Furniture} furniture
   */
  constructor(furniture) {
    super()
    this.furniture_key = furniture.key
  }

  /**
   * @returns {setup.Furniture}
   */
  getFurniture() {
    // @ts-ignore
    return setup.item[this.furniture_key]
  }

  explain() {
    return `Is in a location with ${this.getFurniture().rep()}`
  }

  /**
   * @param {setup.SexAction} action
   */
  isOk(action) {
    const location = this.sex.getLocation()
    const furniture = this.getFurniture()
    return location.getFurnitureAt(furniture.getSlot()) == furniture
  }
}


