
setup.BuildingTemplate = class BuildingTemplate extends setup.TwineClass {
  /**
   * @param {{
   * key: string,
   * name: string,
   * tags: string[],
   * description_passage: string,
   * main_room_template_key: string,
   * costs: Array<Array<setup.Cost>>,
   * restrictions: Array<Array<setup.Restriction>>,
   * on_build?: Array<Array<setup.Cost>>,
   * sub_room_template_key?: string,
   * }} args
   */
  constructor({
    key,
    name,
    tags,
    description_passage,
    costs,
    restrictions,
    on_build,
    main_room_template_key,
    sub_room_template_key,
  }) {
    super()

    // costs = [buildcost, upgrade to lv2cost, upgrade to lv3cost, ...]
    // prerequisites = [buildprerqe, upgrade to lv2prereq, upgrade to lv3prereq, ...]
    // on_build: optional, these are run right after building is built. E.g., add duty slot, etc.
    this.key = key
    this.name = name
    this.tags = tags
    if (!Array.isArray(tags)) throw new Error(`${key} building tags must be array`)
    for (let i = 0; i < tags.length; ++i) {
      if (!(tags[i] in setup.BUILDING_TAGS)) throw new Error(`Building ${key} tag ${tags[i]} not recognized`)
    }

    // check exactly one type tag
    const type_tags = tags.filter(tag => setup.BUILDING_TAGS[tag].type == 'type')
    if (type_tags.length != 1) {
      throw new Error(`Building ${key} must have exactly one type tag`)
    }

    this.tags.sort()
    this.description_passage = description_passage
    this.costs = costs
    this.prerequisites = restrictions
    if (costs.length != restrictions.length) throw new Error(`Cost and prereq of ${key} differs in length`)

    if (on_build) {
      this.on_build = on_build
    } else {
      this.on_build = []
    }

    this.main_room_template_key = main_room_template_key
    /*
    if (!main_room_template_key) {
      throw new Error(`Buidling template ${key} missing its main room!`)
    }
    */

    this.sub_room_template_key = sub_room_template_key
    /*
    if (this.getMaxLevel() > 1 && !this.sub_room_template_key) {
      throw new Error(`Building template ${key} needs a sub room!`)
    } else if (this.getMaxLevel() == 1 && this.sub_room_template_key) {
      throw new Error(`Building template ${key} should not have a sub room!`)
    }
    */

    for (const room_key of [main_room_template_key, sub_room_template_key]) {
      if (room_key) {
        const room = setup.roomtemplate[room_key]
        if (!room) throw new Error(`Not found room with key ${room}!`)
        room.building_template_key = this.key
      }
    }

    if (key in setup.buildingtemplate) throw new Error(`Company ${key} already exists`)
    setup.buildingtemplate[key] = this
  }

  /**
   * @returns {setup.RoomTemplate}
   */
  getMainRoomTemplate() { return setup.roomtemplate[this.main_room_template_key] }

  /**
   * @returns {setup.RoomTemplate | null}
   */
  getSubRoomTemplate() {
    if (!this.sub_room_template_key) return null
    return setup.roomtemplate[this.sub_room_template_key]
  }

  getDescriptionPassage() { return this.description_passage }

  getTags() { return this.tags }

  getOnBuildForLevel(level) {
    if (this.on_build && this.on_build.length > level) {
      return this.on_build[level]
    } else {
      return []
    }
  }


  getOnBuild() { return this.on_build }


  getMaxLevel() { return this.costs.length }


  getName() { return this.name }


  getCost(current_level) {
    if (current_level) return this.costs[current_level]
    return this.costs[0]
  }

  getPrerequisite(current_level) {
    if (current_level) return this.prerequisites[current_level]
    return this.prerequisites[0]
  }

  rep() {
    // return setup.repMessage(this, 'buildingtemplatecardkey', this.getImageRep())
    return setup.repMessage(this, 'buildingtemplatecardkey')
  }

  isBuildable(current_level) {
    if (!current_level) {
      current_level = 0
    }
    if (!current_level && State.variables.fort.player.countBuildings(this) >= 1) return false
    if (current_level < 0 || current_level >= this.costs.length) throw new Error(`weird current level`)

    // check both costs and prerequisites
    let to_check = this.getCost(current_level).concat(this.getPrerequisite(current_level))
    for (let i = 0; i < to_check.length; ++i) {
      if (!to_check[i].isOk()) return false
    }

    return true
  }


  payCosts(current_level) {
    if (current_level < 0 || current_level >= this.costs.length) throw new Error(`weird level`)
    let to_pay = this.getCost(current_level)
    setup.RestrictionLib.applyAll(to_pay)
  }

  // Whether this building's existence should be hidden from the player
  isHidden() {
    // if already built, hide it
    if (State.variables.fort.player.isHasBuilding(this)) return true

    // great hall is always shown
    if (this.key == setup.buildingtemplate.greathall.key) return false

    // veteran hall is always shown after great hall is built
    if (this.key == setup.buildingtemplate.veteranhall.key &&
      State.variables.fort.player.isHasBuilding('greathall')) return false

    const restrictions = this.getPrerequisite(0)
    for (const restriction of restrictions) {
      if (restriction instanceof setup.qresImpl.Building && !restriction.isOk()) {
        // Building prerequisite is not satisfied
        return true
      }
      if (restriction instanceof setup.qresImpl.HasItem && !restriction.isOk()) {
        // Technology prerequisite is not satisfied
        return true
      }
    }

    // show otherwise
    return false
  }


  /**
   * @returns {setup.Cost[][]}
   */
  static getLodgingsCost(init_price) {
    const base = [
      [setup.qc.Money(-init_price)],
      [setup.qc.Money(-300)],
      [setup.qc.Money(-400)],
      [setup.qc.Money(-500)],
      [setup.qc.Money(-800)],

      /* 10 people */

      [setup.qc.Money(-1000)],
      [setup.qc.Money(-2000)],
      [setup.qc.Money(-5000)],
      [setup.qc.Money(-10000)],

      /* 18 people */

      [setup.qc.Money(-50000)],

      /* 20 people, softcap starts */

      [setup.qc.Money(-500000)],
      [setup.qc.Money(-5000000)],
      [setup.qc.Money(-20000000)],
      [setup.qc.Money(-50000000)],
      [setup.qc.Money(-120000000)],
    ]

    if (init_price == 0) {
      base[0] = []
      base[1] = []
      base[2] = []
    }

    return base
  }

  /**
   * @returns {setup.Restriction[][]}
   */
  static getLodgingsRestrictions() {
    return [
      [],
      [],
      [],
      /* 10 people */
      [setup.qres.Building('greathall')],
      [],

      [],
      [],
      /* 18 people */
      [setup.qres.Building('veteranhall')],
      [],
      [],

      [],
      [],
      [],

      /* 30 people */
      [],
      [],
    ]
  }

  /**
   * @returns {setup.Cost[][]}
   */
  static getDecorationCosts(init_price) {
    return [
      [setup.qc.Money(-500)],
      [setup.qc.Money(-1000)],
      [setup.qc.Money(-2000)],
      [setup.qc.Money(-4000)],
      [setup.qc.Money(-8000)],

      [setup.qc.Money(-16000)],
      [setup.qc.Money(-32000)],
      [setup.qc.Money(-64000)],
      [setup.qc.Money(-128000)],
      [setup.qc.Money(-256000)],
    ]
  }

  /**
   * @returns {setup.Restriction[][]}
   */
  static getDecorationRestrictions(init_price) {
    return [
      [
        setup.qres.Building('landscapingoffice'),
      ],
      [],
      [],
      [],
      [],

      [],
      [],
      [],
      [],
      [],
    ]
  }
}
