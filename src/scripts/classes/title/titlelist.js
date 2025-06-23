
setup.TITLE_MAX_ASSIGNED = 2

// special. Will be assigned to State.variables.titlelist

setup.TitleList = class TitleList extends setup.TwineClass {
  // arglist
  constructor() {
    super()

    // ALL titles:
    // unit: {title1key: true, title2key: true}
    this.titles = {}

    // ASSIGNED titles: (only these have gameplay effects)
    // unit: [title1assigned, title2assigned]
    this.assigned = {}

    // last obtained positive title, if any.
    this.last_obtained = {}

    // last obtained negative title, if any
    this.last_obtained_negative = {}
  }

  /**
   * @param {setup.Unit} unit 
   */
  deleteUnit(unit) {
    const unitkey = unit.key
    delete this.titles[unitkey]
    delete this.assigned[unitkey]
    delete this.last_obtained[unitkey]
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Title} title 
   */
  addTitle(unit, title) {
    if (!title.key) throw new Error(`Missing title for addTitle ${title}`)

    const unitkey = unit.key
    if (!(unitkey in this.titles)) this.titles[unitkey] = {}

    this.titles[unitkey][title.key] = true

    let container
    if (title.isNegative()) {
      container = this.last_obtained_negative
    } else {
      container = this.last_obtained
    }
    if (!(unitkey in container)) container[unitkey] = {}
    container[unitkey] = title.key

    /* if has space, add it */
    if (this.isCanAssignTitle(unit, title)) {
      this.assignTitle(unit, title)
    }

    unit.resetCache()
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {setup.Title | null}
   */
  getLastTitlePositive(unit) {
    if (!(unit.key in this.last_obtained)) return null
    const titlekey = this.last_obtained[unit.key]
    if (!titlekey) return null
    return setup.title[titlekey]
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {setup.Title | null}
   */
  getLastTitleNegative(unit) {
    if (!(unit.key in this.last_obtained_negative)) return null
    const titlekey = this.last_obtained_negative[unit.key]
    if (!titlekey) return null
    return setup.title[titlekey]
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Title} title 
   */
  removeTitle(unit, title) {
    const unitkey = unit.key
    if (!(unitkey in this.titles)) return
    if (!(title.key in this.titles[unitkey])) return
    delete this.titles[unitkey][title.key]

    if (title == this.getLastTitlePositive(unit)) {
      delete this.last_obtained[unit.key]
    }
    if (title == this.getLastTitleNegative(unit)) {
      delete this.last_obtained_negative[unit.key]
    }

    this.unassignTitle(unit, title, /* should_replace = */ true)

    unit.resetCache()
  }

  /**
   * @param {setup.Unit} unit 
   */
  _setAssigned(unit) {
    if (!(unit.key in this.assigned)) {
      this.assigned[unit.key] = []
    }
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Title} title 
   * @returns 
   */
  isCanAssignTitle(unit, title) {
    if (title.isNegative()) return false

    const assigned = this.getAssignedTitles(unit, /* is base only = */ true)

    if (assigned.length >= setup.TITLE_MAX_ASSIGNED) return false
    if (assigned.includes(title)) return false

    return true
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Title} title 
   */
  assignTitle(unit, title) {
    if (!this.isHasTitle(unit, title)) throw new Error(`unit ${unit.key} missing title ${title.key}`)
    this._setAssigned(unit)
    let assigned = this.assigned[unit.key]
    if (assigned.length >= setup.TITLE_MAX_ASSIGNED) throw new Error(`unit already has too many titles`)
    if (assigned.includes(title.key)) throw new Error(`unit already have title ${title.key}`)
    assigned.push(title.key)

    unit.resetCache()
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {setup.Title[]}
   */
  getAssignableTitles(unit) {
    return this.getAllTitles(unit).filter(title => !title.isNegative() && !this.assigned[unit.key].includes(title.key))
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Title} title 
   * @param {boolean} [should_replace]
   */
  unassignTitle(unit, title, should_replace) {
    this._setAssigned(unit)
    if (this.assigned[unit.key].includes(title.key)) {
      this.assigned[unit.key] = this.assigned[unit.key].filter(a => a != title.key)

      if (should_replace) {
        // find replacement
        const candidates = this.getAssignableTitles(unit)
        if (candidates.length) {
          const replacement = setup.rng.choice(candidates)
          this.assignTitle(unit, replacement)
        }
      }
    }

    unit.resetCache()
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {setup.Title[]}
   */
  getAllTitles(unit) {
    if (!(unit.key in this.titles)) return []
    return Object.keys(this.titles[unit.key]).map(titlekey => setup.title[titlekey])
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Title | string} title 
   */
  isHasTitle(unit, title) {
    if (!(unit.key in this.titles)) return false
    const actual_title = setup.selfOrObject(title, setup.title)
    return actual_title.key in this.titles[unit.key]
  }

  /**
   * @param {setup.Unit} unit 
   * @param {boolean} [is_base_only]
   * @returns {setup.Title[]}
   */
  getAssignedTitles(unit, is_base_only) {
    let assigned = []
    if (unit.key in this.assigned) {
      assigned = this.assigned[unit.key].map(titlekey => setup.title[titlekey])
    }

    if (!is_base_only) {
      // last obtained titles are always included
      const lasts = [
        this.getLastTitlePositive(unit),
        this.getLastTitleNegative(unit),
      ]
      for (const last_title of lasts) {
        if (last_title && !assigned.includes(last_title)) {
          assigned.push(last_title)
        }
      }
    }
    return assigned
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {number[]}
   */
  computeSkillAddsNegative(unit) {
    // compute max of negative titles
    const min_negatives = Array(setup.skill.length).fill(0)

    for (const title of this.getAllTitles(unit).filter(title => title.isNegative())) {
      const skills = title.getSkillAdds()
      for (let i = 0; i < skills.length; ++i) {
        min_negatives[i] = Math.min(min_negatives[i], skills[i])
      }
    }

    return min_negatives
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {number[]}
   */
  computeSkillAddsPositive(unit) {
    const boosts = Array(setup.skill.length).fill(0)

    // first, compute sum of assigned titles
    const assigned = this.getAssignedTitles(unit).filter(title => !title.isNegative())
    for (const title of assigned) {
      const skills = title.getSkillAdds()
      for (let i = 0; i < boosts.length; ++i) {
        boosts[i] += skills[i]
      }
    }

    return boosts
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {number[]}
   */
  computeSkillAdds(unit) {
    const boosts = Array(setup.skill.length)
    const positive = this.computeSkillAddsPositive(unit)
    const negative = this.computeSkillAddsNegative(unit)
    for (let i = 0; i < positive.length; ++i) {
      boosts[i] = positive[i] + negative[i]
    }
    return boosts
  }
}
