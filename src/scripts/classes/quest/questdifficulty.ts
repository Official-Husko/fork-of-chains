// @ts-nocheck

setup.MONEY_MULTIS = {
  'easiest': 0.8,
  'easier': 0.9,
  'easy': 0.95,
  'normal': 1.0,
  'hard': 1.06,
  'harder': 1.15,
  'hardest': 1.25,
  'extreme': 1.5,
  'hell': 2.0,
  'abyss': 2.5,
  'death': 3.0,
}

const BLESSING_OF_LUCK_REQUIRED = {
  'easiest': 1,
  'easier': 1,
  'easy': 1,
  'normal': 1,
  'hard': 1,
  'harder': 1,
  'hardest': 2,
  'extreme': 2,
  'hell': 3,
  'abyss': 3,
  'death': 4,
}

setup.QuestDifficulty = class QuestDifficulty extends setup.TwineClass {
  constructor(key, name, base_chances, offset_mods, diffname, level) {
    super()

    // Difficulty note:
    // This gets modified as follows: from traits, compute the modifiers to disaster/success/crit
    // first, disaster modifiers will eat up, increasing disaster chance. This CANT be avoided
    // next, failure modifier will eat up success and crit.
    // next, success modifier will push success chance eating up the failure chance.
    // finally, crit modifier will push crit chance eating up success and failure chances.
    // suppose base disaster is 0.1, base failure is 0.4, base success 0.3, base crit 0.2
    // suppose disasteroffset is 0.05, failureoffset is 0.1 successoffset is 0.2, critoffset is 0.1
    // 'the ...mods" will multiply the offsets. E.g.: if successmod is 2, then successoffset become 0.4
    // then: disaster first become 0.15 and failure become 0.35
    // then, failure become 0.15 while success become 0.5
    // then, success become 0.4 while crit becomes 0.3
    // overall, 0.15, 0.15, 0.4, 0.3

    // special case: if any of those are 0, then the outcome will NEVER happen.
    // e.g., [0, 0.2, 0.2] means the quest will never crit

    this.key = key
    this.name = name
    this.diffname = diffname
    this.level = level

    if (!('crit' in base_chances)) throw new Error(`Missing crit in ${key}`)
    if (!('success' in base_chances)) throw new Error(`Missing success in ${key}`)
    if (!('failure' in base_chances)) throw new Error(`Missing failure in ${key}`)

    let diffsum = 0
    for (let basekey in base_chances) {
      let diff = base_chances[basekey]
      diffsum += diff
    }

    if (diffsum > 1.00001) throw new Error(`Invalid difficulty sum ${key}`)
    if (diffsum < 0.00001) throw new Error(`Invalid difficulty sum ${key}`)

    base_chances.disaster = 1.0 - diffsum

    this.base_chances = base_chances

    if (!('crit' in offset_mods)) throw new Error(`Missing crit offset in ${key}`)
    if (!('success' in offset_mods)) throw new Error(`Missing success offset in ${key}`)
    if (!('failure' in offset_mods)) throw new Error(`Missing failure offset in ${key}`)
    if (!('disaster' in offset_mods)) throw new Error(`Missing disaster offset in ${key}`)

    this.offset_mods = offset_mods

    if (key in setup.qdiff) throw new Error(`Quest difficulty ${key} already exists`)
    setup.qdiff[key] = this
  }

  rep() {
    let difftext = ''
    let diffname = this.getDiffName()
    if (diffname == 'easiest') {
      difftext = setup.DOM.toString(setup.DOM.Text.success(diffname))
    } else if (['easier', 'easy'].includes(diffname)) {
      difftext = setup.DOM.toString(setup.DOM.Text.successlite(diffname))
    } else if (diffname == 'normal') {
      difftext = `${diffname}`
    } else if (['hard', 'harder'].includes(diffname)) {
      difftext = setup.DOM.toString(setup.DOM.Text.dangerlite(diffname))
    } else {
      difftext = setup.DOM.toString(setup.DOM.Text.danger(diffname))
    }
    return `Lv. ${this.getLevel()} ${difftext}`
  }


  get() {
    // get actual difficulty after taking veteran hall into account
    if (
      this.level < setup.LEVEL_VETERANHALL &&
      State.variables.fort.player.isHasBuilding(setup.buildingtemplate.veteranhall)) {
      let diffname = `${this.diffname}${setup.LEVEL_VETERANHALL}`
      return setup.qdiff[diffname]
    }
    return this
  }


  getName() { return this.name }
  getLevel() { return this.level }
  getDiffName() { return this.diffname }

  /**
   * @returns {number}
   */
  getBlessingOfLuckStacks() {
    return BLESSING_OF_LUCK_REQUIRED[this.getDiffName()]
  }

  static explainChance(chanceObj) {
    // chanceObj: {success: a, failure: b, crit: c, disaster: d}
    let crit = Math.round(100 * chanceObj.crit)
    let success = Math.round(100 * chanceObj.success)
    let failure = Math.round(100 * chanceObj.failure)
    let disaster = Math.round(100 * chanceObj.disaster)
    return `(${setup.DOM.toString(setup.DOM.Text.success(crit))} / ${setup.DOM.toString(setup.DOM.Text.successlite(success))} / ${setup.DOM.toString(setup.DOM.Text.dangerlite(failure))} / ${setup.DOM.toString(setup.DOM.Text.danger(disaster))})`
  }


  static computeSumScore(score_objs) {
    // given [{success: 0.5}, ...], compute their sum into a new obj.
    let outcomes = setup.QUEST_OUTCOMES
    let result = {}
    outcomes.forEach(outcome => {
      let sumscore = 0
      score_objs.forEach(obj => { sumscore += obj[outcome] })
      result[outcome] = sumscore
    })
    return result
  }

  /**
   * @param {object} success_modifiers 
   * @returns {object}
   */
  static convertSuccessModifierToChances(success_modifiers, difficulty) {
    // For success, failure, and disaster, the chances are multiplied by the offsets from difficulty
    const sucinc = success_modifiers.success * difficulty.offset_mods.success
    const faiinc = success_modifiers.failure * difficulty.offset_mods.failure
    const disinc = success_modifiers.disaster * difficulty.offset_mods.disaster

    // Critical is special though: they are computed using a table, then multiplied with the offset
    // the difficulty offset here acts as the HARD CAP on how much crit chance it can gives
    const critmulti = setup.DIFFICULTY_CRIT_CHANCE_TABLE[
      Math.min(setup.DIFFICULTY_CRIT_CHANCE_TABLE.length - 1, success_modifiers.crit)
    ]
    const criinc = critmulti * difficulty.offset_mods.crit
    return {
      crit: criinc,
      success: sucinc,
      failure: faiinc,
      disaster: disinc,
    }
  }

  /**
   * @param {setup.QuestDifficulty} difficulty 
   * @param {object} criterias 
   * @param {object} assignment 
   * @returns {{
   *   crit: number,
   *   success: number,
   *   failure: number,
   *   disaster: number
   * }}
   */
  static computeSuccessObj(difficulty, criterias, assignment) {
    // This is the base chances for the outcomes
    const result = setup.deepCopy(difficulty.base_chances)

    // Compute contributions from unit's skills and traits
    let score_objs = []
    for (let key in criterias) {
      let criteria = criterias[key].criteria
      let offsetmod = criterias[key].offsetmod || 1.0
      if (!(key in assignment)) throw new Error(`missing ${key} from assignment`)
      let unit = assignment[key]
      const raw_modifiers = criteria.computeSuccessModifiers(unit)
      const chances = setup.QuestDifficulty.convertSuccessModifierToChances(raw_modifiers, difficulty)

      // offset it
      for (const outcome of setup.QUEST_OUTCOMES) {
        chances[outcome] *= offsetmod
      }

      score_objs.push(chances)
    }

    // This is the main modifiers to the chances from the unit's skills/traits
    const offsets = setup.QuestDifficulty.computeSumScore(score_objs)

    let criinc = offsets.crit
    let sucinc = offsets.success
    let faiinc = offsets.failure
    let disinc = offsets.disaster

    /* ================== */
    /* Computation begins */
    /* ================== */

    // the BASE disaster chance can be mitigated by critical chance
    let mitigation = Math.min(result.disaster * setup.DIFFICULTY_BASE_DISASTER_ELIMINATION_FRACTION, criinc)
    mitigation = Math.max(mitigation, 0)
    criinc -= mitigation
    result.disaster -= mitigation

    // Next: apply unit effects
    result.disaster += disinc
    result.failure += faiinc
    result.success += sucinc
    result.crit += criinc

    if (result.success > 1.0) {
      // excess go to crit.
      result.crit += (result.success - 1.0) * setup.DIFFICULTY_SUCCESS_EXCESS_CRIT_CONVERSION
    }

    if (result.success < 0.0) {
      // undersuccess eats up critical, then go to disaster.
      let excess = (-result.success) * setup.DIFFICULTY_FAILURE_EXCESS_DISASTER_CONVERSION
      const critmitigation = Math.min(excess, result.crit)
      excess -= critmitigation
      result.crit -= critmitigation
      result.disaster += excess
    }

    // All the rest of this code do is handle overflows

    if (result.disaster >= 1.0) {
      // If disaster overflow, well, you're doomed
      result.disaster = 1.0
      result.failure = 0
      result.success = 0
      result.crit = 0
    } else {
      if (result.disaster < 0) {
        result.disaster = 0
      }

      // If critical + disaster overflows, they dominate the rest
      if (result.disaster + result.crit >= 1.0) {
        result.crit = 1.0 - result.disaster
        result.failure = 0
        result.success = 0
      } else {
        if (result.crit < 0) {
          result.crit = 0
        }

        // If critical + disaster + success overflows, they dominate the rest
        if (result.success + result.disaster + result.crit >= 1.0) {
          result.success = 1.0 - result.disaster - result.crit
          result.failure = 0
        }

        if (result.success < 0) {
          result.success = 0
        }

        // leftover is given to failure
        result.failure = 1.0 - result.success - result.disaster - result.crit
      }
    }

    return result
  }

  static rollOutcome(scoreobj) {
    let eles = []
    for (let key in scoreobj) {
      eles.push([key, scoreobj[key]])
    }
    return setup.rng.sampleArray(eles)
  }


  static generate() {
    /*
    Quest difficulties are auto generated into the following:
    then they are prefixed with xx, from 1 to 99.
    E.g., easiest1 through easiest99
    the number is the suggested level for the slaver.
    */
    // note that these are in percentage

    // note: critm (crit multiplier) is special, as it represents the HARD CAP of critical boost.
    // In general, don't expect half of it from most of the units.

    /**
     * crit: base critical chance
     * disaster: base disaster chance
     * success: expected success chance when the units are of the right level
     * dism: disaster multiplier per disaster triat
     * critm: half of this is the expected critical given by this quest BY THIS UNIT ONLY.
     */
    const diffs = {
      easiest: {
        crit: 10,
        disaster: 0,
        success: 80,
        dism: 2,
        critm: 75,
      },
      easier: {
        crit: 10,
        disaster: 0,
        success: 75,
        dism: 6,
        critm: 65,
      },
      easy: {
        crit: 7,
        disaster: 2,
        success: 70,
        dism: 10,
        critm: 55,
      },
      normal: {
        crit: 5,
        disaster: 4,
        success: 65,
        dism: 13,
        critm: 45,
      },
      hard: {
        crit: 5,
        disaster: 6,
        success: 57,
        dism: 16,
        critm: 40,
      },
      harder: {
        crit: 5,
        disaster: 8,
        success: 50,
        dism: 19,
        critm: 35,
      },
      hardest: {
        crit: 5,
        disaster: 10,
        success: 42,
        dism: 22,
        critm: 31,
      },
      extreme: {
        crit: 0,
        disaster: 20,
        success: 37,
        dism: 25,
        critm: 27,
      },
      hell: {
        crit: 0,
        disaster: 30,
        success: 32,
        dism: 28,
        critm: 23,
      },
      abyss: {
        crit: 0,
        disaster: 50,
        success: 27,
        dism: 32,
        critm: 21,
      },
      death: {
        crit: 0,
        disaster: 70,
        success: 20,
        dism: 36,
        critm: 18,
      },
    }

    const basestatsumperlevel = setup.DIFFICULTY_BASE_STAT_SUM_PER_LEVEL
    const nunits = 3
    const lv0stat = setup.DIFFICULTY_LV0_STAT

    for (let diffkey in diffs) {
      let diffobj = diffs[diffkey]
      for (let i = 1; i <= setup.DIFFICULTY_MAX_LEVEL; ++i) {
        let gap = 20

        let lowlevel = Math.min(i - gap, i / 3)
        let multi = (diffobj.success / 100.0 / nunits / (i - lowlevel) / basestatsumperlevel)
        let statbase = -multi * nunits * (lv0stat + basestatsumperlevel * lowlevel)

        let lv0success = statbase
        let lv0fail = 1.0 - lv0success - diffobj.crit / 100.0 - diffobj.disaster / 100.0
        let base = {
          crit: diffobj.crit / 100.0,
          success: lv0success,
          failure: lv0fail,
        }
        let multis = {
          crit: diffobj.critm / 100.0,
          disaster: diffobj.dism / 100.0,
          success: multi,
          failure: multi,
        }
        new setup.QuestDifficulty(
          `${diffkey}${i}`,
          `Lv ${i} ${diffkey}`,
          base,
          multis,
          diffkey,
          i,
        )
      }
    }
  }


  // setup.MONEY_QUEST_BASE = 200
  // setup.MONEY_QUEST_BASE = 100
  // setup.MONEY_QUEST_MULTI_ADD = 0.25

  doGetMoney() {
    if (!this.diffname) throw new Error(`No diffname for this difficulty ${this.key}`)
    if (!this.level) throw new Error(`No level for this difficulty ${this.key}`)

    let diff_name = this.diffname
    let level = this.level

    if (!(diff_name in setup.MONEY_MULTIS)) throw new Error(`Unknown difficulty: ${diff_name}`)

    if (level <= 0 || level > 1000) throw new Error(`Level out of range: ${level}`)

    // first get the base amount of money.
    let basemoney = 3 * setup.MONEY_PER_SLAVER_WEEK + 1.0 / setup.QUEST_WEEKS_PER_SCOUT * 3 * setup.MONEY_PER_SLAVER_WEEK

    // multiply with the easy/normal/hard multiplier
    let diffadjusted = basemoney * setup.MONEY_MULTIS[diff_name]

    // adjust money based on level
    if (level < setup.LEVEL_PLATEAU) {
      let multiplier = setup.MONEY_LEVEL_ONE_MULTI + (1.0 - setup.MONEY_LEVEL_ONE_MULTI) * (level / setup.LEVEL_PLATEAU)
      diffadjusted *= multiplier
    }

    // nudge it a little
    /*  Bug: doing this cause quest cost to fluctuate.
    let nudge = Math.random() * setup.MONEY_NUDGE
    if (Math.random() < 0.5) nudge *= -1
    diffadjusted *= (1.0 + nudge)
    */

    return Math.round(diffadjusted)
  }

  getMoney() {
    return this.get().doGetMoney()
  }

  // give exp to all participating slavers.
  doGetExp() {
    const EXP_MULTIS = {
      'easiest': 0.8,
      'easier': 0.9,
      'easy': 0.95,
      'normal': 1.0,
      'hard': 1.05,
      'harder': 1.1,
      'hardest': 1.2,
      'extreme': 1.4,
      'hell': 1.8,
      'abyss': 2.2,
      'death': 3.0,
    }

    if (!this.diffname) throw new Error(`No diffname for this difficulty ${this.key}`)
    if (!this.level) throw new Error(`No level for this difficulty ${this.key}`)

    let diff_name = this.diffname
    let level = this.level

    if (!(diff_name in EXP_MULTIS)) throw new Error(`Unknown difficulty: ${diff_name}`)
    if (level <= 0 || level > 1000) throw new Error(`Level out of range: ${level}`)

    // get base exp
    let exp_base = setup.EXP_LEVEL_PLATEAU / setup.EXP_LOW_LEVEL_LEVEL_UP_FREQUENCY
    if (level < setup.LEVEL_PLATEAU) {
      const baseponent = Math.pow(setup.EXP_LEVEL_PLATEAU / setup.EXP_LEVEL_1, 1.0 / setup.LEVEL_PLATEAU)
      exp_base = setup.EXP_LEVEL_1 * Math.pow(baseponent, level - 1)
      exp_base /= setup.EXP_LOW_LEVEL_LEVEL_UP_FREQUENCY
    }

    // multiply by difficulty modifier
    exp_base *= EXP_MULTIS[diff_name]

    // nudge it a little
    let nudge = Math.random() * setup.EXP_NUDGE
    if (Math.random() < 0.5) nudge *= -1
    exp_base *= (1.0 + nudge)

    return Math.round(exp_base)
  }

  getExp() {
    return this.get().doGetExp()
  }
}
