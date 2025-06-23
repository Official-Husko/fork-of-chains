setup.SexLocationClass = {}
setup.sexlocation = class { }

/**
 * Where the sex takes place. Some actions are locked behind places.
 */
setup.SexLocation = class SexLocation extends setup.TwineClassCustom {
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

  /* =========================
      DEFINITIONS
  ========================= */

  /**
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return []
  }

  /* =========================
      BASIC
  ========================= */

  /**
   * @returns {string}
   */
  getContainer() { return `setup.SexBodypartClass` }

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

  rep() {
    return `<span data-tooltip="${setup.escapeHtml(this.getDescription())}">${this.getTitle()}</span>`
  }

  /**
   * @param {setup.SexInstance} sex
   * @returns {boolean}
   */
  isAllowed(sex) {
    return setup.RestrictionLib.isPrerequisitesSatisfied(sex, this.getRestrictions())
  }

  /**
   * Whether this sex location raises the height of its middle position.
   * @returns {boolean}
   */
  isHigh() {
    return false
  }

  /* =========================
      FURNITURE
  ========================= */

  /**
   * @returns {Object<string, setup.Item>}
   */
  getFurnitures() {
    return {
      slaverbed: setup.furnitureslot.slaverbed.getBasicFurniture(),
      slavebed: setup.furnitureslot.slavebed.getBasicFurniture(),
      foodtray: setup.furnitureslot.foodtray.getBasicFurniture(),
      drinktray: setup.furnitureslot.drinktray.getBasicFurniture(),
      reward: setup.furnitureslot.reward.getBasicFurniture(),

      punishment: setup.furnitureslot.punishment.getBasicFurniture(),
      lighting: setup.furnitureslot.lighting.getBasicFurniture(),
      object: setup.furnitureslot.object.getBasicFurniture(),
      tile: setup.furnitureslot.tile.getBasicFurniture(),
      wall: setup.furnitureslot.wall.getBasicFurniture(),
    }
  }

  /**
   * @param {setup.FurnitureSlot} slot 
   * @return {setup.Furniture}
   */
  getFurnitureAt(slot) {
    // @ts-ignore
    return this.getFurnitures()[slot.key]
  }

  /**
   * @returns {setup.Furniture}
   */
  getSlaverBed() {
    return this.getFurnitureAt(setup.furnitureslot.slaverbed)
  }

  /**
   * @returns {setup.Furniture}
   */
  getSlaveBed() {
    return this.getFurnitureAt(setup.furnitureslot.slavebed)
  }

  /**
   * @returns {setup.Furniture}
   */
  getFoodTray() {
    return this.getFurnitureAt(setup.furnitureslot.foodtray)
  }

  /**
   * @returns {setup.Furniture}
   */
  getDrinkTray() {
    return this.getFurnitureAt(setup.furnitureslot.drinktray)
  }

  /**
   * @returns {setup.Furniture}
   */
  getReward() {
    return this.getFurnitureAt(setup.furnitureslot.reward)
  }

  /**
   * @returns {setup.Furniture}
   */
  getPunishment() {
    return this.getFurnitureAt(setup.furnitureslot.punishment)
  }

  /**
   * @returns {setup.Furniture}
   */
  getLighting() {
    return this.getFurnitureAt(setup.furnitureslot.lighting)
  }

  /**
   * @returns {setup.Furniture}
   */
  getTile() {
    return this.getFurnitureAt(setup.furnitureslot.tile)
  }

  /**
   * @returns {setup.Furniture}
   */
  getObject() {
    return this.getFurnitureAt(setup.furnitureslot.object)
  }

  /**
   * @returns {setup.Furniture}
   */
  getWall() {
    return this.getFurnitureAt(setup.furnitureslot.wall)
  }

  /**
   * Returns the furniture on which sex happens.
   * 
   * @param {setup.SexInstance} sex 
   * @returns {setup.Furniture}
   */
  getSurface(sex) {
    if (this.isHigh()) {
      return this.getSlaverBed()
    } else {
      return this.getTile()
    }
  }

  /* =========================
      TEXT
  ========================= */

  /**
   * Describes the floor, bed, etc.
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  repSurface(sex) {
    return this.getSurface(sex).rep()
  }

  /**
   * Describes the wall, painting, etc. Unit gaze at "xxx"
   * @param {setup.SexInstance} sex 
   * @returns {string[]}
   */
  repRawGazeAt(sex) {
    return []
  }

  /**
   * Describes the wall, painting, etc. Unit gaze at "xxx"
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  repGazeAt(sex) {
    const object = this.getObject()
    const lighting = this.getLighting()
    const wall = this.getWall()
    const tile = this.getTile()
    const punishment = this.getPunishment()
    const reward = this.getReward()
    const slaverbed = this.getSlaverBed()
    const slavebed = this.getSlaveBed()
    const drinktray = this.getDrinkTray()
    const foodtray = this.getFoodTray()
    const room = this.repRoom(sex)

    const base = this.repRawGazeAt(sex)

    if (!object.isBasic()) {
      base.push(
        `the ${object.rep()} in the corner of the ${room}`,
        `the ${object.rep()}`,
      )
    }

    if (!lighting.isBasic()) {
      base.push(
        `the ${lighting.rep()} illuminating the ${room}`
      )
    }

    if (!wall.isBasic()) {
      base.push(
        `the ${wall.rep()}`,
        `the ${wall.rep()} on the walls`,
      )
    } else {
      base.push(
        `an empty spot on the walls`,
      )
    }

    if (!tile.isBasic()) {
      base.push(
        `the ${tile.rep()}`,
        `the ${tile.rep()} on the floor`,
      )
    } else {
      base.push(
        `an empty spot on the floor`,
      )
    }

    if (!drinktray.isBasic()) {
      base.push(
        `the ${drinktray.rep()}`,
        `the empty ${drinktray.rep()}`,
      )
    }

    if (!foodtray.isBasic()) {
      base.push(
        `the ${foodtray.rep()}`,
        `the empty ${foodtray.rep()}`,
      )
    }

    if (!slavebed.isBasic()) {
      base.push(
        `the ${slavebed.rep()} where your slaves sleep in`,
        `the ${slavebed.rep()}`,
      )
    }

    const basic_object = [
      punishment, reward,
    ]

    for (const obj of basic_object) {
      if (!obj.isBasic()) {
        base.push(`the ${obj.rep()}`)
      }
    }

    return setup.rng.choice(base)
  }


  /**
   * Describes the room. Moves to the center of the ...
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  repRoom(sex) {
    return `room`
  }

  /**
   * Describes ambience as half sentence, e.g.,: Mmeanwhile, {output}.
   * Example: "the sounds of other slaves moaning could be heard across the corridor".
   * @param {setup.SexInstance} sex 
   * @returns {string[]}
   */
  repRawAmbience(sex) {
    return []
  }

  /**
   * Describes atmosphere of the room, as half sentence. E.g.: Meanwhile, {output}.
   * Example: "the sounds of other slaves moaning could be heard across the corridor".
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  repAmbience(sex) {
    const base = this.repRawAmbience(sex)

    for (const slot of Object.values(setup.furnitureslot)) {
      const furniture = this.getFurnitureAt(slot)
      const texts = furniture.getTexts()
      if (texts.ambience) {
        for (const text of texts.ambience) {
          base.push(setup.Text.replaceRepMacros(text, { a: furniture }))
        }
      }
    }

    return setup.rng.choice(base)
  }

  /**
   * A sentence for starting a sex here.
   * @param {setup.SexInstance} sex 
   * @returns {string | string[]}
   */
  rawRepStart(sex) {
    return `a|They a|is in an open field, ready for some action.`
  }

  /**
   * A sentence for starting a sex here.
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  repStart(sex) {
    return setup.SexUtil.convert(this.rawRepStart(sex), { a: sex.getUnits()[0] }, sex)
  }

  /**
   * A sentence describing a unit's position here. E.g., "Lying on the floor",
   * @param {setup.SexInstance} sex 
   * @returns {string | string[]}
   */
  rawDescribePosition(unit, sex) {
    const pose = sex.getPose(unit)
    return `${pose.describePosition(unit, sex)} on the ${this.repSurface(sex)}`
  }

  /**
   * A sentence describing a unit's position here. E.g., "Lying on the floor",
   * A sentence for starting a sex here.
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  describePosition(unit, sex) {
    return setup.SexUtil.convert(this.rawDescribePosition(unit, sex), { a: sex.getUnits()[0] }, sex)
  }

  /**
   * @returns {string}
   */
  repUpsideDownFurniture() {
    for (const furniture of Object.values(this.getFurnitures())) {
      if (furniture instanceof setup.Furniture) {
        if (furniture.getTags().includes('upsidedown')) {
          return furniture.rep()
        }
      }
    }
    return ''
  }

  /* =========================
      STATIC
  ========================= */

  /**
   * @param {setup.SexInstance} sex
   * @returns {setup.SexLocation[]}
   */
  static getAllAllowedLocations(sex) {
    return this.getAllLocations().filter(location => location.isAllowed(sex))
  }

  /**
   * @returns {setup.SexLocation[]}
   */
  static getAllLocations() {
    const base = Object.values(setup.sexlocation)

    for (const bedchamber of Object.values(State.variables.bedchamber)) {
      base.push(new setup.SexLocationClass.Bedchamber(bedchamber, /* high = */ true))
      base.push(new setup.SexLocationClass.Bedchamber(bedchamber, /* high = */ false))
    }

    return base
  }
}

