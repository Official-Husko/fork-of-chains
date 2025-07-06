// @ts-nocheck

/**
 * Min / max values for friendships
 */
setup.FRIENDSHIP_MAX_FRIENDSHIP = 1000
setup.FRIENDSHIP_MIN_FRIENDSHIP = -1000

/**
 * Thresholds for friendship decays. If above / lower than this for friendship/rivalry,
 * it will no longer decay
 */
setup.FRIENDSHIP_MAX_DECAY = setup.FRIENDSHIP_MAX_FRIENDSHIP / 2
setup.FRIENDSHIP_MIN_DECAY = setup.FRIENDSHIP_MIN_FRIENDSHIP / 2

/**
 * Amount of friendship decay each week, unless it exceeds the threshold above
 */
setup.FRIENDSHIP_DECAY = 1

/**
 * Minimum friendship in order to become lovers
 */
setup.LOVERS_HOOKUP_FRIENDSHIP = 750

/**
 * Chance of hookup randomly happening in banter
 */
setup.LOVERS_HOOKUP_BANTER_CHANCE = 0.5

/**
 * When friendship drops below this, lovers will break up
 */
setup.LOVERS_BREAKUP_FRIENDSHIP = 250

/**
 * How much friendship is LOST after a breakup?
 */
setup.LOVERS_BREAKUP_FRIENDSHIP_PENALTY = 1000

/**
 * How many weeks before lovers break up automatically when their partner is gone?
 */
setup.LOVERS_LOST_BREAKUP_WEEKS = 10

/**
 * Special traits where slavers with these traits will tend to care for their slaves.
 */
setup.FRIENDSHIP_TRAIT_SLAVE_CARE = [
  'bg_slave',
  'bg_healer',
  'bg_priest',
  'per_kind',
  'per_honorable',
  'per_humble',
  'per_dominant',
  'magic_light',
  'magic_light_master',
]

/**
 * Special traits where slavers with these traits will tend to abuse their slaves.
 */
setup.FRIENDSHIP_TRAIT_SLAVE_ABUSE = [
  'bg_slaver',
  'bg_raider',
  'bg_mist',
  'per_cruel',
  'per_submissive',
  'per_proud',
  'per_evil',
  'magic_dark',
  'magic_dark_master',
]

// special. Will be assigned to State.variables.friendship
// while it's bidirectional, the bidirectionality isn't being used right now as friendship is
// considered symmteric as of now.
setup.Friendship = class Friendship extends setup.TwineClass {
  constructor() {
    super()

    /**
     * {unit_key: {unit_key: value}}
     * @type {Object<number | string, Object<number | string, number>>}
     */
    this.friendship_map = {}

    /**
     * Unit key of unit's lover, best friend, or best rival.
     * Can only have one.
     * {unit_key: unit_key}
     * @type {Object<number | string, number | string>}
     */
    this.best_friend = {}

    /**
     * Whether this unit is the lovers of its best friend unit
     * {unit_key: boolean}
     * @type {Object<number | string, boolean>}
     */
    this.is_lovers = {}

    /**
     * Breakup timer for when their lover is gone.
     * {unit_key: integer}
     * @type {Object<number | string, number>}
     */
    this.lover_timer = {}
  }

  /**
   * Deletes unit completely from the records
   * @param {setup.Unit} unit 
   */
  deleteUnit(unit) {
    let unitkey = unit.key
    delete this.friendship_map[unitkey]
    delete this.best_friend[unitkey]
    delete this.is_lovers[unitkey]
    delete this.lover_timer[unitkey]

    for (let otherkey in this.friendship_map) {
      delete this.friendship_map[otherkey][unitkey]
    }

    for (let otherkey in this.best_friend) {
      if (this.best_friend[otherkey] == unitkey) {
        // Recompute best friend.
        this.best_friend[otherkey] = null
        this.is_lovers[otherkey] = false
        delete this.lover_timer[otherkey]
        this._recomputeBestFriend(State.variables.unit[otherkey])
      }
    }
  }

  /**
   * Recomputes a unit's best friend.
   * If unit has a lover, then do nothing, since lover take priority
   * 
   * @param {setup.Unit} unit 
   * @param {setup.Unit} [preference_unit]  unit to win the tiebreak, if any
   * @param {boolean} [set_as_lover]  whether to force set unit and preference unit to be lovers
   */
  _recomputeBestFriend(unit, preference_unit, set_as_lover) {
    if (!(unit.key in this.friendship_map)) {
      if (set_as_lover) {
        // initialize friendship map
        this._doAdjustFriendship(unit, preference_unit, 0)
        this._doAdjustFriendship(preference_unit, unit, 0)
      } else {
        return
      }
    }
    if (set_as_lover) {
      if (!preference_unit) throw new Error(`No preference unit for setting lover for ${unit.key}!`)
    }

    let maxfrenkey = null
    let maxfrenvalue = null

    if (set_as_lover) {
      maxfrenkey = preference_unit.key
    } else {
      for (let targetkey in this.friendship_map[unit.key]) {
        if (State.variables.unit[targetkey].getJob() == setup.job.slave) continue   // cannot befriend slave
        let targetvalue = Math.abs(this.friendship_map[unit.key][targetkey])
        if (!maxfrenvalue || targetvalue > maxfrenvalue) {
          maxfrenvalue = targetvalue
          maxfrenkey = targetkey
        }
      }
      if (preference_unit && preference_unit.isSlaver()) {
        let val = Math.abs(this.getFriendship(unit, preference_unit))
        if (val && (!maxfrenvalue || val > maxfrenvalue)) {
          maxfrenvalue = val
          maxfrenkey = preference_unit.key
        }
      }
    }

    if (!maxfrenkey) {
      // no fren
      if (set_as_lover) throw new Error(`set as lover failed for ${unit.key} and ${preference_unit.key}!`)

      if (unit.key in this.best_friend) {
        delete this.best_friend[unit.key]
      }
    } else {
      if (!(unit.key in this.best_friend)) {
        this.best_friend[unit.key] = null
        this.is_lovers[unit.key] = null
        delete this.lover_timer[unit.key]
      }
      this.best_friend[unit.key] = maxfrenkey
      this.is_lovers[unit.key] = !!set_as_lover
    }
    unit.resetCache()
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {setup.Unit | null}
   */
  getBestFriend(unit) {
    if (unit.key in this.best_friend) return State.variables.unit[this.best_friend[unit.key]]
    return null
  }

  /**
   * Get unit's lover, if any
   * @param {setup.Unit} unit 
   */
  getLover(unit) {
    if (!this.isLoversWithBestFriend(unit)) return null
    return this.getBestFriend(unit)
  }

  /**
   * Is unit lovers with its best friend?
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isLoversWithBestFriend(unit) {
    return !!this.is_lovers[unit.key]
  }

  /**
   * Deletes friendship and lovers between two units.
   * @param {setup.Unit} unit 
   * @param {setup.Unit} target 
   */
  deleteFriendship(unit, target) {
    if (!(unit.key in this.friendship_map)) return
    if (!(target.key in this.friendship_map[unit.key])) return

    if (unit.getLover() == target) {
      delete this.is_lovers[unit.key]
      delete this.is_lovers[target.key]
      delete this.lover_timer[unit.key]
      delete this.lover_timer[target.key]
    }

    delete this.friendship_map[unit.key][target.key]
    delete this.friendship_map[target.key][unit.key]

    this._recomputeBestFriend(unit, this.getBestFriend(unit), this.isLoversWithBestFriend(unit))
    this._recomputeBestFriend(target, this.getBestFriend(target), this.isLoversWithBestFriend(target))
  }

  /**
   * Adjusts the unit's friendship with target by +amount value
   * Returns the amount of friendship adjusted.
   * @param {setup.Unit} unit 
   * @param {setup.Unit} target 
   * @param {number} amount 
   * 
   * @returns {number}
   */
  adjustFriendship(unit, target, amount) {
    const adjusted = this._doAdjustFriendship(unit, target, amount)
    this._doAdjustFriendship(target, unit, amount)

    this._recomputeBestFriend(unit, this.getBestFriend(unit), this.isLoversWithBestFriend(unit))
    this._recomputeBestFriend(target, this.getBestFriend(target), this.isLoversWithBestFriend(target))
    return adjusted
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Unit} target 
   * @param {number} amount 
   * 
   * @returns {number}
   */
  _doAdjustFriendship(unit, target, amount) {
    if (!(unit.key in this.friendship_map)) {
      this.friendship_map[unit.key] = {}
    }
    if (!(target.key in this.friendship_map[unit.key])) {
      this.friendship_map[unit.key][target.key] = 0
    }
    const old_friendship = this.friendship_map[unit.key][target.key]
    this.friendship_map[unit.key][target.key] = Math.max(
      Math.min(
        old_friendship + amount,
        setup.FRIENDSHIP_MAX_FRIENDSHIP),
      setup.FRIENDSHIP_MIN_FRIENDSHIP)

    const new_friendship = this.friendship_map[unit.key][target.key]
    if (new_friendship == 0) {
      delete this.friendship_map[unit.key][target.key]
    }

    unit.resetCache()
    target.resetCache()

    return new_friendship - old_friendship
  }

  /**
   * Get unit's friendship with another
   * @param {setup.Unit} unit 
   * @param {setup.Unit} target 
   * @returns {number}
   */
  getFriendship(unit, target) {
    if (!(unit.key in this.friendship_map)) return 0
    if (!(target.key in this.friendship_map[unit.key])) return 0
    return this.friendship_map[unit.key][target.key]
  }

  /**
   * Gets unit's compatibility with another.
   * Returns (x, y), where x is number of matching traits while y is opposite traits
   * @param {setup.Unit} unit 
   * @param {setup.Unit} target 
   * @returns {number[]}
   */
  getCompatibility(unit, target) {
    let same = 0
    let opposite = 0

    // same race bonus
    if (unit.getSubrace() == target.getSubrace()) same += 1

    // different job penalty
    if (unit.getJob() != target.getJob()) opposite += 1

    // special traits that affect disposition towards abusing slave and caring for slave
    if (target.getJob() == setup.job.slave) {
      for (let i = 0; i < setup.FRIENDSHIP_TRAIT_SLAVE_ABUSE.length; ++i) {
        if (unit.isHasTraitExact(setup.trait[setup.FRIENDSHIP_TRAIT_SLAVE_ABUSE[i]])) ++opposite
      }
      for (let i = 0; i < setup.FRIENDSHIP_TRAIT_SLAVE_CARE.length; ++i) {
        if (unit.isHasTraitExact(setup.trait[setup.FRIENDSHIP_TRAIT_SLAVE_CARE[i]])) ++same
      }
    }

    // opposing personality traits
    const enemy_traits = setup.Unit.getConflictingPerTraits(unit, target)
    opposite += enemy_traits.length

    // same personality traits
    const similar_trait = setup.Unit.getSamePerTraits(unit, target)
    same += similar_trait.length

    // If they are master-slave in a bedchamber, add effects from bedchamber rules
    let bedchamber = target.getBedchamber()
    if (bedchamber && bedchamber.getSlaver() == unit) {
      same += bedchamber.getKindness()
      opposite += bedchamber.getCruelty()
    }

    return [same, opposite]
  }

  /**
   * @returns {Array<Array>}
   */
  getFriendships(unit) {
    if (!(unit.key in this.friendship_map)) return []
    let tmap = this.friendship_map[unit.key]
    let result = []
    for (let targetkey in tmap) result.push([State.variables.unit[targetkey], tmap[targetkey]])
    // setup.rng.shuffleArray(result)
    result.sort((a, b) => - Math.abs(a[1]) + Math.abs(b[1]))
    return result
  }

  /**
   * Whether it is allowed currently for this unit to break up / become lovers
   * @param {setup.Unit} unit 
   */
  isCanChangeLoversStatus(unit) {
    if (!unit.isYourCompany()) return true
    return unit.isHome()
  }

  /**
   * End of week maintenance
   */
  advanceWeek() {
    // First decay friendships that can decay
    for (let unitkey in this.friendship_map) {
      let tmap = this.friendship_map[unitkey]
      let tkeys = Object.keys(tmap)
      for (let i = 0; i < tkeys.length; ++i) {
        let tkey = tkeys[i]
        let cval = tmap[tkey]
        if (cval > setup.FRIENDSHIP_MAX_DECAY || cval < setup.FRIENDSHIP_MIN_DECAY) continue
        let decay = Math.min(setup.FRIENDSHIP_DECAY, Math.abs(cval))
        if (cval > 0) decay *= -1
        this.adjustFriendship(State.variables.unit[unitkey], State.variables.unit[tkey], decay)
      }
    }

    // Next, lovers under the thresholds are broken up
    for (let unitkey in this.friendship_map) {
      const unit = State.variables.unit[unitkey]
      const lover = this.getLover(unit)
      if (lover &&
        !unit.isYou() &&
        !lover.isYou() &&
        this.getFriendship(unit, lover) < setup.LOVERS_BREAKUP_FRIENDSHIP &&
        this.isCanChangeLoversStatus(unit) &&
        this.isCanChangeLoversStatus(lover)) {
        // break up
        this.breakup(unit, lover)
      }
    }

    // Finally, missing lovers are broken up
    for (let unitkey of Object.keys(this.friendship_map)) {
      const unit = State.variables.unit[unitkey]
      const lover = this.getLover(unit)
      if (!lover) {
        delete this.is_lovers[unitkey]
        delete this.lover_timer[unitkey]
      } else {
        if (lover.isSlaver()) {
          delete this.lover_timer[unitkey]
        } else {
          // lover is missing, increment lover time
          if (!(unitkey in this.lover_timer)) {
            this.lover_timer[unitkey] = 0
          }
          this.lover_timer[unitkey] += 1
          if (lover.isSlave() || this.lover_timer[unitkey] >= setup.LOVERS_LOST_BREAKUP_WEEKS) {
            // either has been gone long enough, or is a slave, so time to break them up
            this.breakup(unit, lover)
            delete this.lover_timer[unitkey]
          }
        }
      }
    }
  }

  /**
   * Breaks up two lovers
   * @param {setup.Unit} unit 
   * @param {setup.Unit} lover 
   */
  breakup(unit, lover) {
    if (this.getLover(unit)) {
      if (unit.isYourCompany() || lover.isYourCompany()) {
        setup.notify(`a|rep and b|rep and <<dangertextlite 'broke up'>>...`, { a: unit, b: lover })
      }

      // Traumatize both
      for (const to_trauma of [unit, lover]) {
        let duration = setup.LOVERS_BREAKUP_TRAUMA_DURATION
        const adjustment = setup.Trauma.getRelationshipTraumaAdjustment(to_trauma)
        duration = Math.round(duration * adjustment)
        if (duration > 0) {
          setup.qc.TraumatizeRandom('unit', duration).apply(setup.costUnitHelper(to_trauma))
        }
      }

      // penalize their friendship
      const relationship_damage = setup.LOVERS_BREAKUP_FRIENDSHIP_PENALTY * setup.Trauma.getBreakupAdjustment(unit, lover)
      this.adjustFriendship(unit, lover, -relationship_damage)
    }
    delete this.is_lovers[unit.key]
    delete this.is_lovers[lover.key]
    delete this.lover_timer[unit.key]
    delete this.lover_timer[lover.key]

    unit.resetCache()
    lover.resetCache()
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Unit} lover 
   */
  hookup(unit, lover) {
    // If already lovers, do nothing
    if (this.getLover(unit) == lover) return

    if (this.is_lovers[unit.key]) throw new Error(`Unit ${unit.key} is already lovers with another!`)
    if (this.is_lovers[lover.key]) throw new Error(`Unit ${lover.key} is already lovers with another!`)

    this._recomputeBestFriend(unit, lover, /* set as lovers = */ true)
    this._recomputeBestFriend(lover, unit, /* set as lovers = */ true)

    if (this.getLover(unit)) {
      if (unit.isYourCompany() || lover.isYourCompany()) {
        setup.notify(`a|rep and b|rep become <<successtextlite 'lovers'>>...`, { a: unit, b: lover })
      }
    }

    unit.resetCache()
    lover.resetCache()
  }

  /**
   * Whether these units can become lovers now
   * @param {setup.Unit} unit 
   * @param {setup.Unit} lover 
   */
  isCanBecomeLovers(unit, lover) {
    // already has lover
    if (unit.getLover() || lover.getLover()) return false

    // can only form between slavers
    if (!unit.isSlaver() || !lover.isSlaver()) return false

    // cannot change during quests
    if (!this.isCanChangeLoversStatus(unit) || !this.isCanChangeLoversStatus(lover)) return false

    // not enough friendship
    if (this.getFriendship(unit, lover) < setup.LOVERS_HOOKUP_FRIENDSHIP) return false

    // check sexual preference
    if (!State.variables.settings.isCanBecomeLovers(unit.getGender(), lover.getGender())) {
      return false
    }

    // don't form between family members
    if (State.variables.family.getRelation(unit, lover)) {
      return false
    }

    // everything looks ok
    return true
  }

  // class method
  static rep(friend_obj) {
    let unit = friend_obj[0]
    let value = friend_obj[1]
    return `${unit.rep()}: <<friendship ${value}>>`
  }

  static loversIcon() {
    return setup.repImgIcon(setup.Unit.LOVERS_IMAGE_URL, 'Lovers')
  }
}

