setup.RoomInstance = class RoomInstance extends setup.TwineClass {
  /**
   * @param {{
   * template: setup.RoomTemplate,
   * }} args
   */
  constructor({
    template,
  }) {
    super()

    this.key = State.variables.RoomInstance_keygen
    State.variables.RoomInstance_keygen += 1

    this.template_key = template.key
    if (!this.template_key) throw new Error(`Unrecognized room template`)

    /**
     * @type {Array<string | number>}
     */
    this.owner_keys = []

    /**
     * @type {TileLocation | null}
     */
    this.location = null

    /**
     * Number of times this building has been rotated clockwise 90 degrees
     * @type {0|1|2|3}
     */
    this.clockwise_rotations = 0

    /**
     * @type {number[] | null}
     */
    this.cached_skill_bonuses = null

    if (this.key in State.variables.roominstance) throw new Error(`Room instance ${this.key} already exists`)
    State.variables.roominstance[this.key] = this

    State.variables.roomlist.resetCache()
  }

  resetCache() {
    this.cached_skill_bonuses = null
    State.variables.roomlist.resetCache()
  }

  /**
   * @returns {string}
   */
  rep() {
    return setup.repMessage(this, 'roominstancecardkey')
  }

  /**
   * @returns {string}
   */
  repFull() {
    return this.getTemplate().repTags() + setup.repMessage(this, 'roominstancecardkey') + ` (${this.getTemplate().getWidth()} x ${this.getTemplate().getHeight()})`
  }

  delete() {
    delete State.variables.roominstance[this.key]
    State.variables.roomlist.resetCache()
  }

  /**
   * @returns {number[]}
   */
  getSkillBonuses() {
    if (!this.cached_skill_bonuses) {
      // compute the skill bonus first.
      if (!State.variables.fort.player.isHasBuilding(setup.buildingtemplate.landscapingoffice)) {
        this.cached_skill_bonuses = Array(setup.skill.length).fill(0)
      } else if (!this.isPlaced()) {
        this.cached_skill_bonuses = Array(setup.skill.length).fill(0)
      } else {
        this.cached_skill_bonuses = State.variables.fortgrid.getAffectingRooms(
          this, this.getLocation()
        ).skill_bonuses
      }
    }
    return this.cached_skill_bonuses
  }

  /**
   * @returns {setup.RoomTemplate | null}
   */
  getTemplate() {
    return setup.roomtemplate[this.template_key]
  }

  /**
   * @returns {setup.Unit[]}
   */
  getOwners() {
    return this.owner_keys.map(key => State.variables.unit[key])
  }

  /**
   * @returns {string}
   */
  getName() {
    return this.getTemplate().getName()
  }

  isPlaced() {
    return this.location != null
  }

  getLocation() {
    return this.location
  }

  /**
   * Don't call directly. Use fortgrid.relocateRoom.
   * @param {TileLocation | null} location_top_left
   */
  _relocate(location_top_left) {
    if (location_top_left && State.variables.fortgrid.isRoomOutOfBounds(this, location_top_left)) {
      throw new Error(`New room placement for ${this.getName()} is out of bounds!`)
    }

    this.location = location_top_left
    delete this.seed

    this.resetCache()
  }

  /**
   * @returns {number}
   */
  getWidth() {
    if (this.getClockwiseRotations() % 2) {
      return this.getTemplate().getHeight()
    } else {
      return this.getTemplate().getWidth()
    }
  }

  /**
   * @returns {number}
   */
  getHeight() {
    if (this.getClockwiseRotations() % 2) {
      return this.getTemplate().getWidth()
    } else {
      return this.getTemplate().getHeight()
    }
  }

  /**
   * @returns {0|1|2|3}
   */
  getClockwiseRotations() {
    return this.clockwise_rotations
  }

  rotate90anticlockwise() {
    if (this.getTemplate().isFixed()) throw new Error(`Cannot rotate fixed room: ${this.key}`)
    // @ts-ignore
    this.clockwise_rotations = (this.clockwise_rotations + 3) % 4
  }

  rotate90clockwise() {
    if (this.getTemplate().isFixed()) throw new Error(`Cannot rotate fixed room: ${this.key}`)
    // @ts-ignore
    this.clockwise_rotations = (this.clockwise_rotations + 1) % 4
  }

  rotate180() {
    if (this.getTemplate().isFixed()) throw new Error(`Cannot rotate fixed room: ${this.key}`)
    // @ts-ignore
    this.clockwise_rotations = (this.clockwise_rotations + 2) % 4
  }

  /**
   * @param {0|1|2|3} rotation 
   */
  setRotation(rotation) {
    this.clockwise_rotations = rotation
  }

  resetRotation() {
    this.clockwise_rotations = 0
  }

  /**
   * Get a random number for this event that remains the same always.
   */
  getSeed() {
    if (this.seed) return this.seed
    this.seed = 1 + Math.floor(Math.random() * 999999997)
    return this.seed
  }

  /**
   * @returns {ImageObject | null}
   */
  getImageObject() {
    const images = this.getTemplate().getImageList()
    if (images.length) {
      return images[this.getSeed() % images.length]
    } else {
      return null
    }
  }

  isShouldRotateImage() {
    const image_object = this.getImageObject()
    return !image_object || (!image_object.info.directional && !image_object.info.norotate)
  }

  /**
   * @returns {boolean}
   */
  isWalled() {
    const image_object = this.getImageObject()
    return !image_object || (!image_object.info.nowalls)
  }

  /**
   * @param {ImageObject} image_object
   * @param {number} rotations 
   * @returns {string}
   */
  static getDirectionalImagePath(image_object, rotations) {
    const splitted = image_object.path.split('.')
    const extension = splitted[splitted.length - 1]
    splitted.pop()
    const name = splitted.join('.')
    let direction
    if (rotations == 0) {
      direction = 's'
    } else if (rotations == 1) {
      direction = 'w'
    } else if (rotations == 2) {
      direction = 'n'
    } else {
      direction = 'e'
    }
    return `${name}-${direction}.${extension}`
  }

  /**
   * @returns {string}
   */
  getImage() {
    const image_object = this.getImageObject()
    if (image_object) {
      if (image_object.info.directional) {
        return setup.RoomInstance.getDirectionalImagePath(image_object, this.getClockwiseRotations())
      } else {
        return image_object.path
      }
    }
    return `img/room/noimage.png`
  }

  /**
   * @param {TileLocation} [location_top_left]
   * @returns {TileLocation}
   */
  getEntranceLocation(location_top_left) {
    const rotations = this.getClockwiseRotations()

    if (!location_top_left) {
      location_top_left = this.getLocation()
      if (!location_top_left) {
        throw new Error(`Unknown location for getting entrance location`)
      }
    }

    const door_col = this.getTemplate().getDoorColumn()
    if (rotations == 0) {
      // bottom, follow door column
      return {
        row: location_top_left.row + this.getHeight(),
        col: location_top_left.col + door_col,
      }
    } else if (rotations == 1) {
      // left side, row is door column
      return {
        row: location_top_left.row + door_col,
        col: location_top_left.col - 1,
      }
    } else if (rotations == 2) {
      // up, door is opposite
      return {
        row: location_top_left.row - 1,
        col: location_top_left.col + this.getWidth() - door_col - 1,
      }
    } else {
      // right
      return {
        row: location_top_left.row + this.getHeight() - door_col - 1,
        col: location_top_left.col + this.getWidth(),
      }
    }
  }
}
