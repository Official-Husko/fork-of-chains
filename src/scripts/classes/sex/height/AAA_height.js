setup.SexHeightClass = {}
setup.sexheight = class {}

/**
 * Where a bodypart is height-wise. To align them for sex.
 */
setup.SexHeight = class SexHeight extends setup.TwineClassCustom {
  /**
   * @param {string} key 
   * @param {number} height_value 
   */
  constructor(key, height_value) {
    super()
    this.key = key
    this.height_value = height_value
  }

  /**
   * @returns {number}
   */
  getHeightValue() { return this.height_value }

  /**
   * @returns {string}
   */
  getContainer() { return `setup.SexHeightClass` }

  /**
   * get height one step above this one.
   * @returns {setup.SexHeight}
   */
  getNextHigherHeight() { return null }

  /**
   * The height level, e.g., "head", "waist", "floor"
   * @returns {string}
   */
  repHeightLevel() {
    return ''
  } 

  /**
   * @returns {setup.SexHeight[]}
   */
  static getAllHeights() {
    return Object.values(setup.sexheight)
  }
}
