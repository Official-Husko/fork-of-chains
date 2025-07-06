// @ts-nocheck

/**
 * @type {Registry<typeof setup.Living>}
 */
setup.living = {}

/**
 * What a slaver do after they retire
 */
setup.Living = class Living extends setup.TwineClass {
  /**
   * 
   * @param {{
   * key: string,
   * name: string,
   * tags: string[],
   * unit_restrictions: setup.Restriction[],
   * default_preference: number,
   * trait_preferences: Object<string, number>,
   * business: string[],
   * location: string,
   * }} param0 
   */
  constructor({
    key,
    name,
    tags,
    unit_restrictions,
    default_preference,
    trait_preferences,
    business,
    location,
  }) {
    super()

    if (!key) throw new Error(`null key for living`)
    this.key = key

    if (!name) throw new Error(`null name for living ${key}`)
    this.name = name

    if (!Array.isArray(tags)) throw new Error(`tags must be array for living ${key}`)
    this.tags = tags

    if (!Array.isArray(unit_restrictions))
      throw new Error(`unit restrictions must be array for living ${key}`)
    this.unit_restrictions = unit_restrictions

    this.default_preference = default_preference

    this.trait_preferences = trait_preferences
    for (const trait_key in this.trait_preferences) {
      if (!(trait_key in setup.trait)) {
        throw new Error(`Unknown trait ${trait_key} for living ${key}`)
      }
      if (!this.trait_preferences[trait_key]) {
        throw new Error(`Missing value for ${trait_key} in Living ${key}`)
      }
    }

    if (!Array.isArray(business))
      throw new Error(`business must be array for living ${key}`)
    this.business = business

    if (!location) {
      throw new Error(`Missing locatin for living ${key}`)
    }
    this.location = location

    if (key in setup.living) throw new Error(`Living with key ${key} duplicated`)
    setup.living[key] = this

    if (!Story.has(this.getDescriptionPassage())) {
      throw new Error(`Passage ${this.getDescriptionPassage()} not found for living ${key}!`)
    }
  }

  getDefaultPreference() { return this.default_preference }

  getUnitRestrictions() { return this.unit_restrictions }

  getTraitPreferences() { return this.trait_preferences }

  /**
   * @returns {string}
   */
  getLocation() { return this.location }

  /**
   * @returns {string}
   */
  getName() { return this.name }

  /**
   * @returns {string}
   */
  getDescriptionPassage() {
    return `LIVING_${this.key}`
  }

  /**
   * @returns {string[]}
   */
  getTags() { return this.tags }

  /**
   * @returns {string[]}
   */
  getBusiness() { return this.business }

  /**
   * Example: "relaxing at home", "brewing alcohol", ...
   * @param {setup.Unit} unit 
   * @returns {string}
   */
  repBusiness(unit) { return setup.Text.replaceUnitMacros(this.getBusiness(), { a: unit }) }

  /**
   * @param {setup.Unit} unit 
   * @returns {number}
   */
  computePreference(unit) {
    const restrictions = this.getUnitRestrictions()
    if (!setup.RestrictionLib.isUnitSatisfy(unit, restrictions)) {
      // unit cannot get this no matter what
      return 0
    }

    let base = this.getDefaultPreference()
    const trait_preferences = this.getTraitPreferences()
    for (const trait_key in trait_preferences) {
      if (unit.isHasTrait(trait_key)) {
        base += trait_preferences[trait_key]
      }
    }

    return Math.max(0, base)
  }

  /**
   * @returns {string}
   */
  rep() {
    return this.getName()
  }

  /**
   * Choose a living for this unit
   * @param {setup.Unit} unit 
   * @returns {setup.Living}
   */
  static getLiving(unit) {
    /**
     * @type {Array<[Living, number]>}
     */
    const candidates = []
    for (const living of Object.values(setup.living)) {
      const preference = living.computePreference(unit)
      if (preference) {
        candidates.push([living, preference])
      }
    }
    if (!candidates.length) throw new Error(`Empty living candidates for unit ${unit.getName()}`)
    const chosen = setup.rng.sampleArray(candidates, /* normalize = */ true)
    return chosen
  }

  /**
   * @param {setup.Restriction[]} restrictions 
   * @returns {boolean}
   */
  static isRestrictionsAllowRetired(restrictions) {
    for (const restriction of restrictions) {
      if (restriction instanceof setup.qresImpl.Job && restriction.job_key == setup.job.retired.key) {
        return true
      }
      if (restriction instanceof setup.qresImpl.Living) {
        return true
      }
    }
    return false
  }

}
