
setup.Fort = class Fort extends setup.TwineClass {
  constructor(key, name, base_max_buildings) {
    super()

    this.key = key
    this.name = name
    this.base_max_buildings = base_max_buildings
    this.building_keys = []
    this.template_key_to_building_key = {}
    this.ignored_building_template_key = {}

    // also count towards building space.
    this.upgrades = 0

    if (key in State.variables.fort) throw new Error(`Fort ${key} already exists`)
    State.variables.fort[key] = this
  }

  /**
   * @param {setup.BuildingTemplate} template 
   */
  isTemplateIgnored(template) {
    return template.key in this.ignored_building_template_key
  }

  /**
   * @param {setup.BuildingTemplate} template 
   */
  ignoreTemplate(template) {
    this.ignored_building_template_key[template.key] = true
  }

  /**
   * @param {setup.BuildingTemplate} template 
   */
  unignoreTemplate(template) {
    delete this.ignored_building_template_key[template.key]
  }

  rep() {
    return this.getName()
  }


  getUpgrades() {
    return this.upgrades
  }


  addUpgrade() {
    this.upgrades += 1
  }

  removeUpgrade() {
    this.upgrades -= 1
  }

  /**
   * @param {setup.Unit} unit 
   */
  isTrainingUnlocked(unit) {
    let candidates = []
    if (unit.getJob() == setup.job.slaver) {
      candidates = [
        'deepritualchamber',
        'surgery',
        'temple',
        'treatmentroom',
      ]
    } else if (unit.getJob() == setup.job.slave) {
      candidates = [
        'trainingchamber',
        'ritualchamber',
        'biolab',
        'temple',
        'treatmentroom',
      ]
    }
    for (const building of candidates) {
      if (this.isHasBuilding(setup.buildingtemplate[building])) return true
    }
    return false
  }

  /**
   * @param {setup.BuildingTemplate} template 
   */
  getBuilding(template) {
    if (!template) throw new Error(`Missing building in getBuilding`)
    if (!(template.key in this.template_key_to_building_key)) return null
    return State.variables.buildinginstance[this.template_key_to_building_key[template.key]]
  }

  getName() {
    return this.name
  }

  getMaxUnitOfJob(job) {
    // max number of unit with job this fort can support.
    if (job == setup.job.slaver) {
      // if (this.isHasBuilding(setup.buildingtemplate.lodgings)) result += 3
      let rooms = 0
      if (this.isHasBuilding(setup.buildingtemplate.lodgings)) {
        rooms = this.getBuilding(setup.buildingtemplate.lodgings).getLevel()
      } else {
        rooms = 3
      }

      return rooms * setup.FORT_SLAVER_CAPACITY_PER_LODGING
    } else if (job == setup.job.slave) {
      let result = 0
      if (this.isHasBuilding(setup.buildingtemplate.dungeons)) {
        result += setup.FORT_SLAVE_CAPACITY_PER_CELL
        let cells = this.getBuilding(setup.buildingtemplate.dungeons).getLevel() - 1
        result += cells * setup.FORT_SLAVE_CAPACITY_PER_CELL
      }
      return result
    } else {
      throw new Error(`weird job ${job.key}`)
    }
  }

  /**
   * @param {setup.BuildingTemplate} template 
   */
  countBuildings(template) {
    if (this.isHasBuilding(template)) {
      return 1
    } else {
      return 0
    }
  }


  /**
   * @param {setup.BuildingTemplate | string} template 
   * @param {number} [level]  // if given, building must be at least this level to return true
   * @returns {boolean}
   */
  isHasBuilding(template, level) {
    /**
     * @type {setup.BuildingTemplate}
     */
    const building_template = setup.selfOrObject(template, setup.buildingtemplate)
    const building = this.getBuilding(building_template)
    if (!building) return false
    if (!level) return true
    return building.getLevel() >= level
  }

  getBuildingsCount() {
    return this.building_keys.length
  }

  getBuildings(filter_dict) {
    let result = []

    let tag = null
    if (filter_dict && 'tag' in filter_dict) {
      tag = filter_dict.tag
    }

    for (let i = 0; i < this.building_keys.length; ++i) {
      let building = State.variables.buildinginstance[this.building_keys[i]]
      if (
        filter_dict &&
        ('template' in filter_dict) &&
        building.getTemplate() != filter_dict.template
      ) {
        continue
      }
      if (tag && !building.getTemplate().getTags().includes(tag)) continue
      result.push(building)
    }
    return result
  }

  /**
   * @param {setup.BuildingTemplate} template 
   * @returns {setup.RoomInstance | null}
   */
  getBuildRoom(template) {
    const room_template = template.getMainRoomTemplate()
    if (room_template) {
      return new setup.RoomInstance({ template: room_template })
    } else {
      return null
    }
  }

  /**
   * @param {setup.BuildingTemplate} template 
   * @param {setup.RoomInstance} [room]
   * @returns {setup.RoomInstance | null}
   */
  build(template, room) {
    if (!room) room = this.getBuildRoom(template)

    State.variables.statistics.add('buildings_built', 1)
    if (template.key in this.template_key_to_building_key) throw new Error(`Building ${template.key} already built?`)

    let building = new setup.BuildingInstance(template)
    this.building_keys.push(building.key)
    if (building.fort_key) throw new Error(`Building already has a fort?`)

    building.fort_key = this.key

    this.template_key_to_building_key[template.key] = building.key
    setup.notify(`<<successtext 'New improvement'>>: ${building.rep()}`)

    return room
  }

  /**
   * This is only used for backwards compatibility.
   * 
   * @param {setup.BuildingInstance} building 
   */
  remove(building) {
    delete this.template_key_to_building_key[building.template_key]
    this.building_keys = this.building_keys.filter(key => key != building.key)
  }
}
