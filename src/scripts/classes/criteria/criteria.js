export const IMPORTABLE = true

setup.UnitCriteria = class UnitCriteria extends setup.TwineClass {
  /**
   * 
   * @param {string} key 
   * @param {string} name 
   * @param {Array.<setup.Trait>} crit_traits 
   * @param {Array.<setup.Trait>} disaster_traits 
   * @param {Array.<setup.Restriction>} restrictions 
   * @param {Array | object} skill_multis 
   */
  constructor(
    key,
    name,
    crit_traits,
    disaster_traits,
    restrictions,
    skill_multis
  ) {
    super()

    // skill_multis: a skill where each skill is associated a multiplier, indicating
    // how important it is for this quest.

    // criteria can be keyless, i.e., for the dynamically generated ones.
    // e.g., one time use criterias or the ones used to generate slave order.
    this.key = key
    this.name = name

    // translate trait effects to keys
    // crit_traits and disaster_traits are arrays (which may contain duplicates)
    // indicating the traits that are crit or disaster for this.
    crit_traits.sort(setup.Trait_Cmp)
    this.crit_trait_map = {}
    for (let i = 0; i < crit_traits.length; ++i) {
      if (!crit_traits[i]) throw new Error(`Missing a crit trait for ${key} criteria`)
      if (!crit_traits[i].key) throw new Error(`No key in ${crit_traits[i]} in unit criteria for ${key}`)
      this.crit_trait_map[crit_traits[i].key] = true
    }

    disaster_traits.sort(setup.Trait_Cmp)
    this.disaster_trait_map = {}
    for (let i = 0; i < disaster_traits.length; ++i) {
      if (!disaster_traits[i]) throw new Error(`Missing a disaster trait for ${key} criteria`)
      if (!disaster_traits[i].key) throw new Error(`No key in ${disaster_traits[i]} in unit disastereria for ${key}`)
      this.disaster_trait_map[disaster_traits[i].key] = true
    }

    this.restrictions = restrictions
    this.skill_multis = setup.Skill.translate(skill_multis)

    if (key) {
      if (key in setup.qu) throw new Error(`Quest Criteria ${key} already exists`)
      setup.qu[key] = this
    }
  }

  /**
   * @returns {string | null}
   */
  validate() {
    const skills = this.getSkillMultis().reduce((a, b) => a + b, 0)
    if (this.getJob() != setup.job.slaver) {
      if (skills) {
        return "Non-slaver criteria cannot have any skill! Please add a slaver restriction to this role."
      }
    }
    if (skills && Math.abs(skills - 3.0) > 0.00001) {
      return `Sum of skills must be exactly 3.0, but found ${skills} instead!`
    }
    return null
  }

  /**
   * @returns {string}
   */
  getName() { return this.name }

  /**
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return this.restrictions
  }

  /**
   * @param {setup.Unit} unit 
   * @returns {boolean}
   */
  isCanAssign(unit) {
    // checks if unit does not violate any requirement
    let restrictions = this.getRestrictions()
    if (!setup.RestrictionLib.isUnitSatisfyIncludeDefiancy(unit, restrictions)) return false
    return true
  }

  /**
   * @returns Array.<number>
   */
  getSkillMultis() {
    return this.skill_multis
  }

  /**
   * @returns Array.<setup.Trait>
   */
  getCritTraits() {
    // return list of crit traits
    return Object.keys(this.crit_trait_map).map(key => setup.trait[key])
  }

  /**
   * @returns Array.<setup.Trait>
   */
  getDisasterTraits() {
    // return list of disaster traits
    return Object.keys(this.disaster_trait_map).map(key => setup.trait[key])
  }

  /**
   * @param {setup.Unit} unit 
   * @param {boolean} [ignore_extra_traits]  // whether to ignore extra traits or not.
   * @returns {{crit: setup.Trait[], disaster: setup.Trait[]}}
   */
  getMatchingTraits(unit, ignore_extra_traits) {
    // return number of crit / disaster traits that matches.
    let unit_traits
    if (ignore_extra_traits) {
      unit_traits = unit.getTraits()
    } else {
      unit_traits = unit.getAllTraits()
    }

    // remove disaster traits if unit has any relevant perks
    /**
     * @type {setup.Perk[]}
     */
    const perks = unit.getAllTraitsWithTag('perk')
    const disabled = []
    for (const perk of perks) {
      disabled.push(...perk.getPerkNullTraits())
    }

    const unit_traits_for_disaster = unit_traits.filter(trait => !disabled.includes(trait))

    const crits = []
    for (const trait of unit_traits) {
      if (trait.key in this.crit_trait_map) {
        crits.push(trait)
      }
    }

    const disasters = []
    for (const trait of unit_traits_for_disaster) {
      if (trait.key in this.disaster_trait_map) {
        disasters.push(trait)
      }
    }

    return {
      crit: crits,
      disaster: disasters,
    }
  }

  /**
   * @param {setup.Unit} unit 
   * @param {boolean} [ignore_extra_traits]  // whether to ignore extra traits or not.
   * @returns {{
   * crit: number,
   * success: number,
   * failure: number,
   * disaster: number
   * }}
   */
  computeSuccessModifiers(unit, ignore_extra_traits) {
    // compute success modifiers if this unit fills in this criteria.
    // returns {'crit': x, 'success': y, 'failure': z, 'disaster': xyz}

    // idea: correct skill give success. Crit trait give crit, disaster trait give disaster.

    const matches = this.getMatchingTraits(unit, ignore_extra_traits)
    const crits = matches.crit.length
    const disasters = matches.disaster.length

    let stat_mod_plus = 0
    let stat_mod_neg = 0
    let unit_skills = unit.getSkills()
    for (let i = 0; i < this.skill_multis.length; ++i) {
      if (this.skill_multis[i] > 0) stat_mod_plus += this.skill_multis[i] * unit_skills[i]
      if (this.skill_multis[i] < 0) stat_mod_neg -= this.skill_multis[i] * unit_skills[i]
    }

    return {
      crit: crits,
      success: stat_mod_plus,
      failure: stat_mod_neg,
      disaster: disasters
    }
  }

  /**
   * 
   * @param {setup.Unit} unit 
   * @param {setup.QuestDifficulty} difficulty 
   * @param {Object.<string, number>} multipliers 
   */
  _computeScore(unit, difficulty, multipliers) {
    const obj = this.computeSuccessModifiers(unit)
    const multis = setup.QuestDifficulty.convertSuccessModifierToChances(obj, difficulty)
    let score = 0
    for (const key in multipliers) {
      score += multis[key] * multipliers[key]
    }
    return score
  }


  /**
   * Compute a rough score of having this unit in this role
   * The score is roughly proportionate to the amount of reward
   * @param {setup.Unit} unit 
   * @param {setup.QuestDifficulty} difficulty 
   */
  computeScore(unit, difficulty) {
    return this._computeScore(unit, difficulty, {
      crit: 2,
      success: 1,
      disaster: -2,
    })
  }

  /**
   * Computes score based on crit chance only, ignoring all else
   * @param {setup.Unit} unit 
   * @param {setup.QuestDifficulty} difficulty 
   */
  computeScoreCrit(unit, difficulty) {
    return this._computeScore(unit, difficulty, {
      crit: 10000,
      success: 0.0001,
      disaster: -1,
    })
  }

  /**
   * Computes score based on success+crit chance only, ignoring all else
   * @param {setup.Unit} unit 
   * @param {setup.QuestDifficulty} difficulty 
   */
  computeScoreSuccess(unit, difficulty) {
    return this._computeScore(unit, difficulty, {
      crit: 1,
      success: 1,
      disaster: -0.0001,
    })
  }

  /**
   * Computes score based on success+crit+failure chance only, ignoring all else
   * @param {setup.Unit} unit 
   * @param {setup.QuestDifficulty} difficulty 
   */
  computeScoreFailure(unit, difficulty) {
    return this._computeScore(unit, difficulty, {
      crit: 1,
      success: 1,
      disaster: -10000,
    })
  }

  /**
   * @param {setup.QuestInstance=} quest 
   * @returns {setup.Unit[]}
   */
  getEligibleUnits(quest) {
    return State.variables.company.player.getUnits({}).filter(
      unit => unit.isAvailable() && this.isCanAssign(unit)
    )
  }

  getEligibleUnitsSorted(difficulty) {
    const can = this.getEligibleUnits()
    can.sort((a, b) => this.computeScore(b, difficulty) - this.computeScore(a, difficulty))
    return can
  }

  /**
   * get job restriction, if any
   * @returns {setup.Job | null}
   */
  getJob() {
    const restrictions = this.getRestrictions()
    for (const restriction of restrictions) {
      if (restriction instanceof setup.qresImpl.Job) {
        return setup.job[restriction.job_key]
      }
      if (restriction instanceof setup.qresImpl.You) {
        return setup.job.slaver
      }
    }
    return null
  }

  /**
   * Gives a representation of this actor, together with which matching traits/skills it have.
   * @param {setup.Unit} unit 
   * @returns {string}
   */
  repActor(unit, difficulty) {
    const skills = unit.getSkills()

    let text = ''

    const skillmultis = this.getSkillMultis()
    const skilltexts = []
    for (const skill of setup.skill) {
      let skillval = skillmultis[skill.key]
      if (skillval) {
        if (skillval != 1) {
          let skilltext = skillval.toFixed(0)
          if (skillval % 1) skilltext = skillval.toFixed(1)
          skilltexts.push(`${skilltext} x ${skills[skill.key]} ${skill.rep()}`)
        } else {
          skilltexts.push(`${skills[skill.key]} ${skill.rep()}`)
        }
      }
    }
    if (skilltexts.length) {
      text += `[${skilltexts.join(' + ')}]`
    }

    const matches = this.getMatchingTraits(unit)

    for (const crit_trait of this.getCritTraits()) {
      if (matches.crit.includes(crit_trait)) {
        text += crit_trait.rep()
      }
    }

    for (const disaster_trait of this.getDisasterTraits()) {
      if (matches.disaster.includes(disaster_trait)) {
        text += disaster_trait.repNegative()
      }
    }

    if (difficulty) {
      const score = 100 * this.computeScore(unit, difficulty)
      text += ` (Score: ${score.toFixed(1)})`
    }

    return text
  }
}
