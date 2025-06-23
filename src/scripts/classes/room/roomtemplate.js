
setup.RoomTemplate = class RoomTemplate extends setup.TwineClass {
  static ROOM_IMAGES = {}
  static PORTAL_ROOM_TEMPLATE_KEYS = ['portalindoors', 'portaloutdoors']

  /**
   * @param {{
   * key: string,
   * tags: string[],
   * width: number,
   * height: number,
   * name?: string,
   * description_passage?: string,
   * skill_bonus?: Array<{
   *   type: "always" | "near" | "adjacent",
   *   skill_key: string | number,
   *   bonus_amount?: number,
   *   room_keys?: string[],
   * }>,
   * door_column?: number,
   * is_fixed?: boolean,
   * is_passable?: boolean,
   * is_door?: boolean,
   * is_optional?: boolean,
   * is_outdoors?: boolean,
   * }} args
   */
  constructor({
    key,
    name,
    description_passage,
    tags,
    width,
    height,
    skill_bonus,
    door_column,
    is_fixed,
    is_passable,
    is_door,
    is_optional,
    is_outdoors,
  }) {
    super()

    this.key = key
    this.name = name
    this.description_passage = description_passage
    this.tags = tags
    if (!Array.isArray(tags)) throw new Error(`${key} room tags must be array`)
    this.tags.sort()

    this.width = width
    this.height = height
    this.door_column = door_column
    if (is_door) {
      if (this.door_column === undefined) {
        throw new Error(`Door column must be defined for rooms with door: room ${this.key}`)
      }
      if (this.door_column < 0 || this.door_column >= this.width) {
        throw new Error(`Door column of ${this.key} is out of range: must be between 0 and ${this.width - 1}`)
      }
    } else {
      if (this.door_column !== undefined) {
        throw new Error(`Room ${this.key} has no door but it has door column defined!`)
      }
    }

    if (is_passable && is_door) {
      throw new Error(`Room ${this.key} is both passable and has a door!`)
    }

    /**
     * Will be filled asynchronously
     * @type {Array<ImageObject>}
     */
    this.image_list = []

    this.raw_skill_bonus = skill_bonus || []
    if (!Array.isArray(skill_bonus)) throw new Error(`${key} room skill bonus must be array`)

    /**
     * @type {Array<{
     *   type: "always" | "near" | "adjacent",
     *   skill_key: string | number,
     *   bonus: number,
     *   room_template_key?: string,
     * }>}
     */
    this.skill_bonus = []

    for (const sb of skill_bonus) {
      if (!['always', 'near', 'adjacent'].includes(sb.type))
        throw new Error(`${key} unrecognized room type: ${sb.type}`)
    }

    this.building_template_key = null
    this.is_fixed = !!is_fixed
    this.is_passable = !!is_passable
    this.is_door = !!is_door
    this.is_optional = !!is_optional
    this.is_outdoors = !!is_outdoors
    this.is_hide_name = this.getTags().includes('hidename')
    this.is_hide_skill = this.getTags().includes('hideskill')

    // extra computed tags
    if (this.is_outdoors) {
      this.tags.push('outdoors')
    } else {
      this.tags.push('indoors')
    }

    if (!this.is_door) {
      this.tags.push('nodoor')
    }

    if (this.is_passable) {
      this.tags.push('passable')
    }

    if (this.is_optional) {
      this.tags.push('optional')
    }

    if (this.is_fixed) {
      this.tags.push('fixed')
    }

    this.cached_rep_tag = null
    this.cached_type_tag = null
    this.max_room_count = null

    if (key in setup.roomtemplate) throw new Error(`Room template ${key} already exists`)
    setup.roomtemplate[key] = this
  }

  static initialize() {
    // compute max room count for each building
    let total_tiles_in = 0
    let total_tiles_out = 0
    for (const template of Object.values(setup.roomtemplate)) {
      const building = template.getBuildingTemplate()
      if (building) {
        if (template == building.getMainRoomTemplate() && template == building.getSubRoomTemplate()) {
          template.max_room_count = building.getMaxLevel()
        } else if (template == building.getMainRoomTemplate()) {
          template.max_room_count = 1
        } else if (template == building.getSubRoomTemplate()) {
          template.max_room_count = building.getMaxLevel() - 1
        } else {
          template.max_room_count = 0
        }
      } else {
        template.max_room_count = 0
      }
      if (template.isOutdoors()) {
        total_tiles_out += template.getWidth() * template.getHeight() * template.max_room_count
      } else {
        total_tiles_in += template.getWidth() * template.getHeight() * template.max_room_count
      }
    }
    const width = setup.FORTGRID_WIDTH
    console.log(`Total tiles: ${total_tiles_in} in (${total_tiles_in / width} rows), ${total_tiles_out} out (${total_tiles_out / width} rows)`)

    setup.MAX_TILE_INSIDE = Math.round(setup.FORTGRID_EXTRA_TILE_MULTIPLIER * total_tiles_in)
    setup.MAX_TILE_OUTSIDE = Math.round(setup.FORTGRID_EXTRA_TILE_MULTIPLIER * total_tiles_out)

    // compute how many bonus granted per skill
    const skill_found = Array(setup.skill.length).fill(0)
    for (const template of Object.values(setup.roomtemplate)) {
      for (const sb of template.raw_skill_bonus) {
        if (sb.bonus_amount) continue
        skill_found[setup.skill[sb.skill_key].key] += 1
      }
    }

    // fill in the actual bonus values
    for (const template of Object.values(setup.roomtemplate)) {
      for (const sb of template.raw_skill_bonus) {
        if (!sb.bonus_amount) {
          let base = setup.ROOM_BONUS_SKILL_BONUS_DEFAULT / skill_found[setup.skill[sb.skill_key].key]
          if (sb.type == 'adjacent' || sb.type == 'near') {
            let neighbors = 0
            for (const room_template_key of sb.room_keys) {
              if (!(room_template_key in setup.roomtemplate)) {
                throw new Error(`Missing room template key ${room_template_key} in ${template.key}`)
              }
              const template_neighbor = setup.roomtemplate[room_template_key]
              neighbors += template_neighbor.max_room_count
            }
            base /= (neighbors * template.max_room_count)
          }
          sb.bonus_amount = base
        }
      }
    }

    // outgoing edges
    for (const template of Object.values(setup.roomtemplate)) {
      for (const sb of template.raw_skill_bonus) {
        if (sb.type == 'always') {
          template.skill_bonus.push({
            type: 'always',
            skill_key: sb.skill_key,
            bonus: sb.bonus_amount,
          })
        } else {
          for (const room_template_key of sb.room_keys) {
            const bonus = {
              type: sb.type,
              skill_key: sb.skill_key,
              bonus: sb.bonus_amount / 2,
              room_template_key: room_template_key,
            }
            if (room_template_key == template.key) {
              bonus.bonus *= 2
            }
            template.skill_bonus.push(bonus)
            if (room_template_key != template.key) {
              if (!(room_template_key in setup.roomtemplate)) {
                throw new Error(`Missing room template key ${room_template_key} in ${template.key}!`)
              }
              setup.roomtemplate[room_template_key].skill_bonus.push({
                type: bonus.type,
                skill_key: bonus.skill_key,
                bonus: bonus.bonus,
                room_template_key: template.key,
              })
            }
          }
        }
      }
    }
  }

  getTypeTag() {
    if (!this.cached_type_tag) {
      const type_tags = this.getTags().filter(tag => setup.TAG_ROOM[tag].type == 'type')
      if (!type_tags.length) throw new Error(`Room ${this.key} missing type tag!`)
      if (type_tags.length != 1) throw new Error(`Room ${this.key} has duplicated type tags!`)
      this.cached_type_tag = type_tags[0]
    }
    return this.cached_type_tag
  }

  /**
   * @returns {string}
   */
  repTags() {
    if (this.cached_rep_tag === null) {
      this.cached_rep_tag = setup.TagHelper.getTagsRep(
        'room', this.getTags()
      )
    }
    return this.cached_rep_tag
  }

  /**
   * @returns {string}
   */
  rep() {
    return setup.repMessage(this, 'roomtemplatecardkey')
  }

  /**
   * @returns {string}
   */
  repFull() {
    return this.repTags() + setup.repMessage(this, 'roomtemplatecardkey') + ` (${this.getWidth()} x ${this.getHeight()})`
  }

  /**
   * @returns {Array<ImageObject>}
   */
  getImageList() { return this.image_list }

  /**
   * @returns {setup.BuildingTemplate | null}
   */
  getBuildingTemplate() {
    if (!this.building_template_key) return null
    return setup.buildingtemplate[this.building_template_key]
  }

  getDoorColumn() {
    return this.door_column
  }

  /**
   * @returns {boolean}
   */
  isMainRoom() {
    const template = this.getBuildingTemplate()
    return template && template.getMainRoomTemplate() == this
  }

  /**
   * @returns {string}
   */
  getName() {
    if (!this.name && !this.getBuildingTemplate())
      throw new Error(`Unknown name for room ${this.key}`)
    return this.name || this.getBuildingTemplate().getName()
  }

  /**
   * @returns {string | null}
   */
  getDescriptionPassage() { return this.description_passage }

  /**
   * @returns {string[]}
   */
  getTags() {
    // combine my tags with my building tags, if any
    const tags = this.tags
    const building = this.getBuildingTemplate()
    if (building) {
      const all_tags = setup.TagHelper.getTagsMap('room')
      return tags.concat(building.getTags().filter(tag => tag in all_tags))
    }
    return tags
  }

  /**
   * @returns {number}
   */
  getWidth() { return this.width }

  /**
   * @returns {number}
   */
  getHeight() { return this.height }

  getSkillBonus() { return this.skill_bonus }

  /**
   * @param {setup.Skill} skill 
   * @returns {boolean}
   */
  isHasSkillBonusOn(skill) {
    return this.getSkillBonus().filter(bonus => bonus.skill_key == skill.keyword && bonus.bonus > 0).length > 0
  }

  /**
   * @returns {boolean}
   */
  isFixed() { return this.is_fixed }

  /**
   * @returns {boolean}
   */
  isPassable() { return this.is_passable }

  /**
   * @returns {boolean}
   */
  isHasDoor() { return this.is_door }

  /**
   * @returns {boolean}
   */
  isOptional() { return this.is_optional }

  /**
   * @returns {boolean}
   */
  isOutdoors() { return this.is_outdoors }

  /**
   * @returns {boolean}
   */
  isHideName() { return this.is_hide_name }

  /**
   * @returns {boolean}
   */
  isHideSkill() { return this.is_hide_skill }

  /**
   * @returns {boolean}
   */
  isPortal() {
    return setup.RoomTemplate.PORTAL_ROOM_TEMPLATE_KEYS.includes(this.key)
  }

  /**
   * @param {string[]} tags 
   * @returns {setup.RoomTemplate[]}
   */
  static getAllWithTags(tags) {
    return Object.values(setup.roomtemplate).filter(template => {
      const template_tags = template.getTags()
      return tags.every(tag => template_tags.includes(tag))
    })
  }

  static getCreditsByArtist() {
    const result = {}

    for (const template of Object.values(setup.roomtemplate)) {
      const images = template.getImageList()
      for (const image of images) {
        if (image.info) {
          if (!(image.info.artist in result)) {
            result[image.info.artist] = []
          }
          result[image.info.artist].push(image)
        }
      }
    }
    return result
  }
}
