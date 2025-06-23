setup.SexGoalClass = {}
setup.sexgoal = class {}

/**
 * Determines how a unit chooses its next action for SexAI
 */
setup.SexGoal = class SexGoal extends setup.TwineClassCustom {
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
   * @param {setup.Unit} unit 
   * @param {setup.SexInstance} sex 
   * @returns {setup.SexPlanner}
   */
  getPlanner(unit, sex) { return null }

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
  getDescription() { return this.description }


  /**
   * @returns {string}
   */
  getContainer() { return `setup.SexGoalClass` }

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

  /**
   * Get unit's goal.
   * @param {setup.Unit} unit 
   * @returns {setup.SexGoal}
   */
  static getStartingGoal(unit) {
    const goal_chances = this.getGoalChances(unit)
    return setup.rng.sampleArray(goal_chances)
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {Array[]}   [[goal, chance], ...]
   */
  static getGoalChances(unit) {
    // mindbroken unit's goal isn't used
    if (unit.isMindbroken()) return [[setup.sexgoal.resist, 1.0], ]

    if (unit.isSlave()) {
      if (unit.isObedient() && unit.isDominantSlave()) {
        return [[setup.sexgoal.orgasmall, 1.0], ]
      } else if (unit.isCompliant()) {
        return [[setup.sexgoal.orgasmthem, 1.0], ]
      } else {
        return [[setup.sexgoal.resist, 1.0], ]
      }
    }

    const goal_chances = []
    let has_nonzero = false
    for (const goal of setup.SexGoal.getAllGoals()) {
      const score = goal.computeScore(unit)
      if (score > 0) {
        has_nonzero = true
        goal_chances.push([goal, score])
      }
    }

    if (!has_nonzero) {
      return [[setup.sexgoal.orgasmall, 1.0], ]
    }

    setup.rng.normalizeChanceArray(goal_chances)
    return goal_chances
  }

  /**
   * @returns {setup.SexGoal[]}
   */
  static getAllGoals() {
    return Object.values(setup.sexgoal)
  }
}
