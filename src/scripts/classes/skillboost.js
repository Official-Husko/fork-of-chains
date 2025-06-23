/**
 * Extra permanent skill boost that units can get. Soft-capped.
 * Stores at $skillboost
 */
setup.SkillBoost = class SkillBoost extends setup.TwineClass {
  constructor() {
    super()

    /**
     * @type {Object<string | number, Array<number>>}
     */
    this.unit_key_to_skill_boosts = {}
  }

  /**
   * Deletes unit completely from the records
   * @param {setup.Unit} unit 
   */
  deleteUnit(unit) {
    delete this.unit_key_to_skill_boosts[unit.key]
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {Array<number> | null}
   */
  _getUnitBoosts(unit) {
    if (!(unit.key in this.unit_key_to_skill_boosts)) {
      return null
    }
    return this.unit_key_to_skill_boosts[unit.key]
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Skill} skill
   * @returns {boolean}
   */
  isHasBoost(unit, skill) {
    const raw_boosts = this._getUnitBoosts(unit)
    return !!raw_boosts && !!raw_boosts[skill.key]
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isHasAnyBoost(unit) {
    return !!this._getUnitBoosts(unit)
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Skill} skill 
   * @returns {number}
   */
  getBoost(unit, skill) {
    const raw_boosts = this._getUnitBoosts(unit)
    if (raw_boosts) {
      return raw_boosts[skill.key]
    } else {
      return 0
    }
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {Array<number>}
   */
  getBoosts(unit) {
    const raw_boosts = this._getUnitBoosts(unit)
    if (raw_boosts) {
      return raw_boosts
    }
    return Array(setup.skill.length).fill(0)
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Skill} skill 
   * @param {number} amount 
   */
  _adjustBoost(unit, skill, amount) {
    if (!(unit.key in this.unit_key_to_skill_boosts)) {
      this.unit_key_to_skill_boosts[unit.key] = Array(setup.skill.length).fill(0)
    }

    this.unit_key_to_skill_boosts[unit.key][skill.key] += amount
    unit.resetCache()
  }

  /**
   * Return the decayed skills, if any
   * @param {setup.Unit} unit 
   * @returns {setup.Skill[]}
   */
  _decaySkills(unit) {
    const decayed = []
    for (const skill of setup.skill) {
      const unit_skill = this.getBoost(unit, skill)
      const chance = unit_skill * setup.SKILL_BOOST_DECAY_RATE
      if (Math.random() < chance) {
        // decay it
        this._adjustBoost(unit, skill, -1)
        decayed.push(skill)
      }
    }
    return decayed
  }

  /**
   * @param {setup.Unit} unit 
   * @param {setup.Skill} [skill]
   */
  addBoost(unit, skill) {
    // first decay existing boosts
    const decayed = this._decaySkills(unit)

    if (unit.isYourCompany() && decayed.length) {
      setup.notify(
        `Due to having too many boosts, some of ${unit.isYou() ? 'your' : `${unit.rep()}'s`}
         skill boosts have decayed: ${decayed.map(skill => skill.rep())}
         <<include 'SkillBoostHelpText'>>
        `,
        { a: unit }
      )
    }

    // then boost it
    this._adjustBoost(unit, skill, 1)
    if (unit.isYourCompany()) {
      setup.notify(
        `a|Reps ${skill.rep()} has been permanently boosted
         <<include 'SkillBoostHelpText'>>
         by 1`,
        { a: unit }
      )
    }
  }

}
