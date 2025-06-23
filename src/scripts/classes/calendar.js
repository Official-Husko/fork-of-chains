import { ContentTemplate } from "./content/ContentTemplate"

// special variable $calendar set to this.
setup.Calendar = class Calendar extends setup.TwineClass {
  constructor() {
    super()

    this.week = 1
    this.last_week_of = {}

    // cooldowns['quest']['quest_key'] = xxx  means this quest is on cooldown and cannot be generated.
    this.cooldowns = {}
  }

  getWeek() { return this.week }

  advanceWeek() {
    this.week += 1
    if (this.seed) delete this.seed

    for (const cdtype in this.cooldowns) {
      for (const cdkey in this.cooldowns[cdtype]) {
        this.cooldowns[cdtype][cdkey] -= 1
        if (this.cooldowns[cdtype][cdkey] <= 0) {
          delete this.cooldowns[cdtype][cdkey]
        }
      }
    }
  }

  /**
   * Prevent this quest/opportunity from being respawnd in the next duration weeks.
   * @param {ContentTemplate} obj 
   * @param {number} duration 
   */
  setCooldown(obj, duration) {
    if (!this.cooldowns[obj.TYPE]) {
      this.cooldowns[obj.TYPE] = {}
    }
    this.cooldowns[obj.TYPE][obj.key] = duration
    if (duration <= 0) delete this.cooldowns[obj.TYPE][obj.key]
    if (State.variables.gDebug) {
      setup.notify(`DEBUG: ${obj.TYPE} ${obj.key} is on cooldown for ${duration} weeks.`)
    }
  }

  /**
   * Prevent this quest/opportunity from being respawnd in the next duration weeks.
   * @param {ContentTemplate} obj 
   * @returns {number}
   */
  getCooldown(obj) {
    if (this.cooldowns[obj.TYPE]) {
      return this.cooldowns[obj.TYPE][obj.key] || 0
    } else {
      return 0
    }
  }

  /**
   * @param {ContentTemplate} obj 
   * @returns {boolean}
   */
  isOnCooldown(obj) {
    return !!this.getCooldown(obj)
  }

  /**
   * @param {any} obj 
   */
  record(obj) {
    let type = obj.TYPE
    if (!type) throw new Error(`object must have type to be recorded: ${obj}`)
    if (!(type in this.last_week_of)) {
      this.last_week_of[type] = {}
    }
    this.last_week_of[type][obj.key] = this.getWeek()
  }

  getLastWeekOf(obj) {
    let type = obj.TYPE
    if (!type) throw new Error(`object must have type to be get last week of'd: ${obj}`)
    if (!(type in this.last_week_of)) return -setup.INFINITY
    if (!(obj.key in this.last_week_of[type])) return -setup.INFINITY
    return this.last_week_of[type][obj.key]
  }

  getSeed() {
    if (this.seed) return this.seed
    this.seed = 1 + Math.floor(Math.random() * 999999997)
    return this.seed
  }

}
