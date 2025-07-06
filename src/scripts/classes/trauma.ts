// @ts-nocheck
// special. Will be assigned to State.variables.trauma
setup.Trauma = class Trauma extends setup.TwineClass {
  constructor() {
    super()
    // {'unitkey': {trauma_key: 3}} unit is traumatized with trauma key for 3 more weeks.
    this.unit_traumas = {}
  }

  deleteUnit(unit) {
    let unitkey = unit.key
    if (!(unitkey in this.unit_traumas)) return   // nothing to do when unit is not traumatized
    delete this.unit_traumas[unitkey]
  }

  // adjust a unit trauma. If duration is negative will be substracted. If positive will be added.
  /**
   * @param {setup.Unit} unit 
   * @param {setup.Trait} trait 
   * @param {number} duration 
   */
  adjustTrauma(unit, trait, duration) {
    if (!trait.getTags().includes('temporary')) throw new Error(`Can only adjust temporary traits, ${trait.key} not a temporary trait`)

    if (duration > 0 && trait.isHasTag('trauma')) {
      // if unit has curse of madness, use it
      let added = 0
      while (
        added + setup.CURSE_TRAUMA_WEEKS <= (setup.CURSE_TRAUMA_MULTIPLIER - 1) * duration &&
        unit.isHasTrait(setup.trait.curse_madness1)
      ) {
        added += setup.CURSE_TRAUMA_WEEKS
        unit.decreaseTrait(setup.trait.curse_madness1.getTraitGroup())
      }
      duration += added
      if (added && unit.isYourCompany()) {
        setup.notify(`a|Reps Curse of Madness adds ${added} extra weeks of trauma`, { a: unit })
      }

      // if unit has blessing of sanity, use it
      let prevented = 0
      while (duration > 0 && unit.isHasTrait(setup.trait.blessing_sanity1)) {
        let new_prevention = Math.min(duration, setup.BLESSING_TRAUMA_WEEKS)
        prevented += new_prevention
        duration -= new_prevention
        unit.decreaseTrait(setup.trait.blessing_sanity1.getTraitGroup())
      }

      if (prevented && unit.isYourCompany()) {
        setup.notify(`a|Reps Blessing of Sanity prevents ${prevented} weeks of trauma`, { a: unit })
      }
    }

    if (!duration) return

    if (unit.isSlaver()) {
      if (duration > 0) {
        if (trait.getTags().includes('trauma')) {
          State.variables.statistics.add('trauma_count', 1)
          State.variables.statistics.add('trauma_week_sum', duration)
        } else if (trait.getTags().includes('boon')) {
          State.variables.statistics.add('boon_count', 1)
          State.variables.statistics.add('boon_week_sum', duration)
        }
      }
    }

    let unitkey = unit.key
    if (!(unitkey in this.unit_traumas)) {
      this.unit_traumas[unitkey] = {}
    }

    let traumas = this.unit_traumas[unitkey]

    let traitkey = trait.key
    if (!(traitkey in traumas)) {
      if (duration > 0 && unit.isYourCompany()) {
        const base = setup.Text.replaceUnitMacros(`a|Rep temporarily a|gain `, { a: unit })
        setup.notify(`${base} ${trait.rep()}`)
      }
      traumas[traitkey] = 0
    }

    traumas[traitkey] += duration
    if (unit.isSlaver()) {
      if (trait.getTags().includes('trauma')) {
        State.variables.statistics.setMax('trauma_week_max', traumas[traitkey])
      } else if (trait.getTags().includes('boon')) {
        State.variables.statistics.setMax('boon_week_max', traumas[traitkey])
      }
    }

    if (traumas[traitkey] <= 0) {
      if (unit.isYourCompany()) {
        const base = setup.Text.replaceUnitMacros(`a|Rep a|lose`, { a: unit })
        setup.notify(`${base} ${trait.rep()}`)
      }
      delete traumas[traitkey]
    }

    unit.resetCache()
  }

  /**
   * return a random skill, weighted by unit's base skills.
   * 
   * @param {setup.Unit} unit 
   * @returns {setup.Skill}
   */
  _unitSkillSampleWeighted(unit) {
    const skills = unit.getSkills(/* is base only = */ true)
    /**
     * @type {Array<[setup.Skill, number]>}
     */
    const weighted = []
    for (let i = 0; i < skills.length; ++i) {
      weighted.push([setup.skill[i], skills[i]])
    }
    return setup.rng.sampleArray(weighted, /* normalize = */ true)
  }

  // randomly traumatize unit
  traumatize(unit, duration) {
    let sampled = this._unitSkillSampleWeighted(unit)
    let traitkey = `trauma_${sampled.keyword}`
    let trait = setup.trait[traitkey]
    this.adjustTrauma(unit, trait, duration)
  }

  // randomly give unit a boon
  /**
   * @param {setup.Unit} unit 
   * @param {number} duration 
   */
  boonize(unit, duration) {
    let sampled = this._unitSkillSampleWeighted(unit)
    let traitkey = `boon_${sampled.keyword}`
    let trait = setup.trait[traitkey]

    // amplify duration with mythic
    if (unit.isYourCompany() && duration >= 1) {
      const mystic = State.variables.dutylist.getDuty(setup.dutytemplate.mystic)
      if (mystic) {
        const proc = mystic.getProc()
        if (proc == 'proc' || proc == 'crit') {
          let amplify_factor = setup.MYSTIC_BOON_MULTI
          let limit = setup.MYSTIC_MAX_BOON
          if (proc == 'crit') {
            amplify_factor = setup.MYSTIC_BOON_MULTI_CRIT
            limit = setup.MYSTIC_MAX_BOON_CRIT
          }

          const amplification = Math.min(Math.round(duration * amplify_factor), limit)

          if (amplification) {
            setup.notify(`${setup.capitalize(mystic.repYourDutyRep())} adds ${amplification} extra weeks of boon`,)
            duration += amplification
          }
        }
      }
    }

    this.adjustTrauma(unit, trait, duration)
  }

  // randomly heal weeks amount of traumas from the unit
  healTrauma(unit, weeks) {
    for (let i = 0; i < weeks; ++i) {
      let traits = this.getTraits(unit)
      let traumas = traits.filter(a => a.getTags().includes('trauma'))
      if (!traumas.length) return // nothing to cure
      let tocure = setup.rng.choice(traumas)
      this.adjustTrauma(unit, tocure, -1)
    }
  }

  advanceWeek() {
    for (let unitkey in this.unit_traumas) {
      let unit = State.variables.unit[unitkey]
      let traitkeys = Object.keys(this.unit_traumas[unitkey])
      for (let i = 0; i < traitkeys.length; ++i) {
        this.adjustTrauma(unit, setup.trait[traitkeys[i]], /* duration = */ -1)
      }
    }
  }

  getTraitsWithDurations(unit) {
    let unitkey = unit.key
    if (!(unitkey in this.unit_traumas)) return []
    let result = []
    for (let traitkey in this.unit_traumas[unitkey]) result.push(
      [setup.trait[traitkey], this.unit_traumas[unitkey][traitkey]]
    )
    return result
  }

  getTraits(unit) {
    let unitkey = unit.key
    if (!(unitkey in this.unit_traumas)) return []
    let result = []
    for (let traitkey in this.unit_traumas[unitkey]) result.push(setup.trait[traitkey])
    return result
  }

  /**
   * Gets a multiplier for trauma duration from relationship change, e.g, losing unit, breakup
   * @param {setup.Unit} unit 
   * @returns {number}
   */
  static _getRelationshipTraumaAdjustmentRaw(unit) {
    let adjustment = 0.0
    for (const trait_key in setup.TRAUMA_TRAIT_ADJUST) {
      if (unit.isHasTraitExact(setup.trait[trait_key])) {
        adjustment += setup.TRAUMA_TRAIT_ADJUST[trait_key]
      }
    }
    return adjustment
  }


  /**
   * Gets a multiplier for trauma duration from relationship change, e.g, losing unit, breakup
   * @param {setup.Unit} unit 
   * @returns {number}
   */
  static getRelationshipTraumaAdjustment(unit) {
    let adjustment = 1.0 + setup.Trauma._getRelationshipTraumaAdjustmentRaw(unit)
    adjustment = Math.max(adjustment, 0.0)
    return adjustment
  }


  /**
   * Gets a multiplier for relationship damage from break up
   * @param {setup.Unit} unit1
   * @param {setup.Unit} unit2
   * @returns {number}
   */
  static getBreakupAdjustment(unit1, unit2) {
    const adjustment1 = setup.Trauma._getRelationshipTraumaAdjustmentRaw(unit1)
    const adjustment2 = setup.Trauma._getRelationshipTraumaAdjustmentRaw(unit2)
    let adjustment = 1.0 - adjustment1 - adjustment2
    adjustment = Math.max(adjustment, 0.0)
    return adjustment
  }
}
