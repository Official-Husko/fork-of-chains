setup.SexPaceClass = {}
setup.sexpace = class {}

/**
 * A unit's preferences for sex. Each unit will have one.
 */
setup.SexPace = class SexPace extends setup.TwineClassCustom {
  /**
   * @param {string} key 
   * @param {string[]} tags
   * @param {string} title 
   * @param {string} description 
   * @param {number} base_chance
   * @param {Object<string, number>} trait_preference
   */
  constructor(key, tags, title, description, base_chance, trait_preference) {
    super()
    this.key = key
    this.tags = tags
    this.title = title
    this.description = description
    this.base_chance = base_chance
    this.trait_preference = trait_preference
  }

  /**
   * @returns {string}
   */
  getContainer() { return `setup.SexPaceClass` }

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
  rep() { return this.getTitle() }

  /**
   * @returns {string}
   */
  getDescription() { return this.description }

  isMindbroken() { return this.key == 'MINDBROKEN' }

  /**
   * @param {setup.Unit} unit 
   */
  computeScore(unit) {
    const traits = unit.getTraits()
    let score = this.base_chance
    for (const trait of traits) {
      score += this.trait_preference[trait.key] || 0
    }
    return score
  }

  /* =========================
      TEXT
  ========================= */

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Sex} sex 
   * @returns {string | string[]}
   */
  rawRepStart(unit, sex) {
    return ``
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  repStart(unit, sex) {
    return setup.SexUtil.convert(this.rawRepStart(unit, sex), {a: unit}, sex)
  }

  /**
   * Get a random adverb suitable for this pace. E.g., gently, violently, etc.
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   */
  repAdverb(unit, sex) {
    return ``
  }

  /* =========================
      STATIC
  ========================= */

  /**
   * Get unit's default pace.
   * @param {setup.Unit} unit 
   * @returns {setup.SexPace}
   */
  static getStartingPace(unit) {
    const pace_chances = this.getPaceChances(unit)
    return setup.rng.sampleArray(pace_chances)
  }

  /**
   * Returns pace chances of this unit
   * @param {setup.Unit} unit 
   * @return {Array[]}  // [[pace, chance], ...]
   */
  static getPaceChances(unit) {
    if (unit.isMindbroken()) return [[setup.sexpace.mindbroken, 1.0], ]

    if (unit.isSlave()) {
      if (unit.isObedient() || (unit.isCompliant() && unit.isSubmissive())) {
        return [[setup.sexpace.sub, 1.0], ]
      } else if (unit.isCompliant()) {
        return [[setup.sexpace.forced, 1.0], ]
      } else {
        return [[setup.sexpace.resist, 1.0], ]
      }
    }

    const pace_chances = []
    let has_nonzero = false
    for (const pace of setup.SexPace.getAllPaces()) {
      const score = pace.computeScore(unit)
      if (score > 0) {
        has_nonzero = true
        pace_chances.push([pace, score])
      }
    }

    if (!has_nonzero) {
      return [[setup.sexpace.normal, 1.0]]
    }
    setup.rng.normalizeChanceArray(pace_chances)
    return pace_chances
  }

  /**
   * @returns {setup.SexPace[]}
   */
  static getAllPaces() {
    return Object.values(setup.sexpace)
  }
}
