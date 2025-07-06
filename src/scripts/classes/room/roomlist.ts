// @ts-nocheck

/**
 * list of rooms. Actually not storing anything for now, but a collection of convenience methods
 * Actual list of rooms is stored in $roominstance
 * this is $roomlist
 */
setup.RoomList = class RoomList extends setup.TwineClass {
  constructor() {
    super()
    /**
     * @type {number[] | null}
     */
    this.cached_skill_bonuses = Array(setup.skill.length).fill(0)
    this.cached_unplaced_room_keys = null
    /**
     * @type {Object<string, {placed: number, unplaced: number}>}
     */
    this.cached_room_count = null
    /**
     * @type {Object<string, number[]>}
     */
    this.cached_template_key_to_room_key = null
  }

  resetCache() {
    this.cached_unplaced_room_keys = null
    this.cached_skill_bonuses = null
    this.cached_room_count = null
    this.cached_template_key_to_room_key = null
  }


  resetCacheAll() {
    this.resetCache()
    for (const room of this.getRoomInstances()) {
      room.resetCache()
    }
  }

  /**
   * @param {setup.RoomTemplate} template
   * @returns {{
   * placed: number, unplaced: number
   * }}
   */
  getRoomCount(template) {
    if (!this.cached_room_count) this.recomputeRoomCountsAndInstance()
    if (template.key in this.cached_room_count) {
      return this.cached_room_count[template.key]
    } else {
      return {
        unplaced: 0,
        placed: 0,
      }
    }
  }

  recomputeRoomCountsAndInstance() {
    const all_rooms = State.variables.roomlist.getRoomInstances()

    this.cached_room_count = {}
    this.cached_template_key_to_room_key = {}

    for (const room of all_rooms) {
      const key = room.getTemplate().key
      if (!(key in this.cached_room_count)) {
        this.cached_room_count[key] = {
          placed: 0,
          unplaced: 0,
        }
        this.cached_template_key_to_room_key[key] = []
      }

      this.cached_template_key_to_room_key[key].push(room.key)

      if (room.isPlaced()) {
        this.cached_room_count[key].placed += 1
      } else {
        this.cached_room_count[key].unplaced += 1
      }
    }
  }

  /**
   * @typedef {{
   *   template?: setup.RoomTemplate,
   * }} GetRoomInstancesArgs
   * 
   * @param {GetRoomInstancesArgs} args
   * @returns {setup.RoomInstance[]}
   */
  _doGetRoomInstances({
    template
  }) {
    if (template) {
      if (!this.cached_template_key_to_room_key) {
        this.recomputeRoomCountsAndInstance()
      }
      if (template.key in this.cached_template_key_to_room_key) {
        return this.cached_template_key_to_room_key[template.key].map(key => State.variables.roominstance[key])
      } else {
        return []
      }
    } else {
      return Object.values(State.variables.roominstance)
    }
  }

  /**
   * @param {GetRoomInstancesArgs} [args]
   * @returns {setup.RoomInstance[]}
   */
  getRoomInstances(args) {
    return this._doGetRoomInstances(args || {})
  }

  getUnplacedRooms() {
    if (!this.cached_unplaced_room_keys) {
      this.cached_unplaced_room_keys = this.getRoomInstances().filter(
        room => !room.isPlaced()
      ).map(room => room.key)
    }
    return this.cached_unplaced_room_keys.map(key => State.variables.roominstance[key])
  }

  /**
   * @return {number[]}
   */
  getTotalSkillBonuses() {
    if (!this.cached_skill_bonuses) {
      this.recomputeTotalSkillBonuses()
    }
    return this.cached_skill_bonuses
  }

  recomputeTotalSkillBonuses() {
    const rooms = this.getRoomInstances()
    const skill_bonuses = Array(setup.skill.length).fill(0)
    for (const room of rooms) {
      const bonus = room.getSkillBonuses()
      for (let i = 0; i < setup.skill.length; ++i) {
        skill_bonuses[i] += bonus[i]
      }
    }

    // cap it
    for (let i = 0; i < setup.skill.length; ++i) {
      skill_bonuses[i] = Math.round(Math.min(skill_bonuses[i], setup.ROOM_MAX_SKILL_BOOST))
    }

    this.cached_skill_bonuses = skill_bonuses

    // reset cache on all units
    for (const unit of State.variables.company.player.getUnits({})) {
      unit.resetCache()
    }
  }
}
