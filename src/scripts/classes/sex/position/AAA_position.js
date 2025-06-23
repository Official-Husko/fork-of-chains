setup.SexPositionClass = {}
setup.sexposition = class { }

/**
 * Where the unit is with respect to others.
 */
setup.SexPosition = class SexPosition extends setup.TwineClassCustom {
  /**
   * @param {string} key 
   * @param {string[]} tags 
   * @param {string} title 
   * @param {string} description 
   */
  constructor(key, tags, title, description) {
    super()
    this.key = key
    this.tags = tags
    this.title = title
    this.description = description
  }

  /**
   * @returns {string[]}
   */
  getTags() { return this.tags }

  /**
   * @returns {string}
   */
  getTitle() { return this.title }

  /**
   * @returns {string}
   */
  getDescription() { return this.description }

  /**
   * @returns {setup.SexPose}
   */
  getDefaultPose() { return setup.sexpose.stand }

  /**
   * @returns {string}
   */
  getContainer() { return `setup.SexPositionClass` }

  /**
   * @returns {string}
   */
  getImage() {
    return `img/sexposition/${this.key}.svg`
  }

  /**
   * @returns {string}
   */
  getImageRep() {
    return setup.repImgIcon(this.getImage(), this.getTitle())
  }

  /**
   * @returns {string}
   */
  rep() { return this.getImageRep() }

  /**
   * By default, all positions face left.
   * @returns {boolean}
   */
  isFacingRight() {
    return false
  }

  /**
   * Whether unit can move to this position
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   */
  isAllowed(unit, sex) {
    const current_position = sex.getPosition(unit)
    const swap_with = sex.getUnitAtPosition(this)

    // can always remain still
    if (current_position == this) return true

    // Disallow moving if it would empty the center position
    if (current_position == setup.sexposition.center && !swap_with) return false

    // Disallow moving to the top when the center position isn't lying up
    if (this == setup.sexposition.top) {
      const center = sex.getUnitAtPosition(setup.sexposition.center)
      if (!center || sex.getPose(center) != setup.sexpose.lieup) {
        return false
      }
    }

    // Disallow moving when currently being topped except swapping with top
    if (current_position == setup.sexposition.center && sex.getUnitAtPosition(setup.sexposition.top) &&
      this != setup.sexposition.top) return false

    // Disallow moving when being penetrated currently. If penetrating then it's ok
    if (sex.isBeingPenetrated(unit)) return false

    return true
  }

  /* =========================
      TEXT
  ========================= */

  /**
   * Describes what happens when a unit moves to this position. Assumes it's empty.
   * a: unit, b: swap with, c: center unit
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} sex 
   * @returns {string | string[]}
   */
  rawDescribe(unit, sex) {
    return ``
  }

  /**
   * Describes what happens when a unit moves to this position
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  describe(unit, sex) {
    const old_position = sex.getPosition(unit)
    if (old_position == this) return ''
    const swap_with = sex.getUnitAtPosition(this)
    const center = sex.getUnitAtPosition(setup.sexposition.center)
    return setup.SexUtil.convert(this.rawDescribe(unit, sex), { a: unit, b: swap_with, c: center }, sex)
  }

  /**
   * @param {setup.SexFacing} facing 
   * @returns {setup.SexFacing}
   */
  normalizeFacing(facing) {
    if (this.isFacingRight()) {
      return facing.getOpposite()
    } else {
      return facing
    }
  }

  /**
   * @param {setup.SexPosition} position 
   * @returns {boolean}
   */
  isAdjacentTo(position) {
    if (this == setup.sexposition.front && position == setup.sexposition.back) return false
    if (this == setup.sexposition.back && position == setup.sexposition.front) return false
    return true
  }

  /**
   * @param {setup.SexPosition} position
   * @returns {boolean}
   */
  isLeftOf(position) {
    if (this == setup.sexposition.front) return true
    if (position == setup.sexposition.front) return false

    if (this == setup.sexposition.back) return false
    if (position == setup.sexposition.back) return true

    return false
  }

  /**
   * I am ... position. E.g., in front of, behind, on top, ...
   * @param {setup.SexPosition} position 
   * @returns {string}
   */
  getRelativePosition(position) {
    return ''
  }

  /**
   * @returns {setup.SexPosition[]}
   */
  static getAllPositions() {
    return Object.values(setup.sexposition)
  }
}
