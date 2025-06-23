import { generateUnitName } from "../../../names/namegen"

setup.UnitPool = class UnitPool extends setup.TwineClass {
  /**
   * @param {string} key 
   * @param {string} name 
   * @param {Object} trait_alloc 
   * @param {Object | Array} base_stat_ranges 
   * @param {setup.Cost[]} [post_process]
   */
  constructor(key, name, trait_alloc, base_stat_ranges, post_process) {
    super()
    // base stat ranges: either [[1, 2], [2, 4], ..., ]
    // or {combat: [1, 2], brawn: [3, 4], ...}

    this.key = key
    this.name = name
    this.trait_alloc = trait_alloc

    this.base_stat_ranges = setup.Skill.translate(base_stat_ranges)

    this.post_process = post_process || []

    // verify trait alloc
    for (let traitallockey in trait_alloc) {
      let tob = trait_alloc[traitallockey]
      if (!('chances' in tob)) throw new Error(`UnitPool ${key}'s ${traitallockey} missing chances`)
      if (!('min' in tob)) throw new Error(`UnitPool ${key}'s ${traitallockey} missing min`)
      if (!('max' in tob)) throw new Error(`UnitPool ${key}'s ${traitallockey} missing max`)
      let ch = tob.chances
      for (let traitkey in ch) {
        if (!(traitkey in setup.trait)) throw new Error(`Unknown trait ${traitkey} in unitpool ${key}'s ${traitallockey}`)
        if (ch[traitkey] === NaN) throw new Error(`NaN for ${traitkey} in unitpool ${key}'s ${traitallockey}`)
        if (!setup.trait[traitkey].getTags().includes(traitallockey)) {
          throw new Error(`Trait ${traitkey} in ${key} does not include ${traitallockey}`)
        }
      }
    }

    if (key in setup.unitpool) throw new Error(`Unitpool ${this.key} duplicated`)
    setup.unitpool[key] = this
  }

  getName() { return this.name }

  rep() {
    return setup.repMessage(this, 'unitpoolcardkey')
  }

  static getChanceArray(chance_obj, is_must_succeed, forbiddens) {
    let base_array = []
    let sum_chance = 0.0
    for (let key in chance_obj) {
      if (forbiddens && forbiddens.includes(key)) continue
      let chance = chance_obj[key]
      if (chance > 0) {
        base_array.push([key, chance])
        sum_chance += chance
      }
    }
    if (sum_chance <= 0 && is_must_succeed) throw new Error(`Failed chance array`)
    if (sum_chance > 1 || is_must_succeed) {
      setup.rng.normalizeChanceArray(base_array)
    }
    return base_array
  }

  _generateSkills() {
    let skills = []
    for (let i = 0; i < setup.skill.length; ++i) {
      let lower = this.base_stat_ranges[i][0]
      let upper = this.base_stat_ranges[i][1]
      skills.push(lower + Math.floor(Math.random() * (upper - lower + 1)))
    }
    return skills
  }

  /**
   * @returns {{mean: number, min: number, max: number}}
   */
  computeStatistics() {
    let sumval = 0
    let min = setup.INFINITY
    let max = 0
    for (let i = 0; i < setup.COMPUTE_APPROXIMATE_VALUE_REPS; ++i) {
      const unit = this.generateUnit()
      sumval += unit.getSlaveValue()
      min = Math.min(min, unit.getSlaveValue())
      max = Math.max(max, unit.getSlaveValue())
      unit.delete()
    }
    State.variables.notification.popAll()
    const mean = Math.round(sumval / setup.COMPUTE_APPROXIMATE_VALUE_REPS * setup.COMPUTE_APPROXIMATE_VALUE_MULTIPLIER)
    return {
      min: min,
      max: max,
      mean: mean,
    }
  }

  // classmethod
  static generateTraitsFromObj(chances, traitmin, traitmax) {
    // chances = {bg_race: 0.5}
    // return the KEYS of the traits as a list
    let obtained_trait_keys = []
    if (traitmax < traitmin) throw new Error(`Weird, max is smaller than min`)

    let tentative = []
    for (let chance_key in chances) {
      let chance = chances[chance_key]
      if (Math.random() < chance) {
        tentative.push(chance_key)
      }
    }
    setup.rng.shuffleArray(tentative)

    // try to push from tentative one by one
    for (let i = 0; i < tentative.length; ++i) {
      if (obtained_trait_keys.length >= traitmax) continue
      let trait = setup.trait[tentative[i]]
      if (obtained_trait_keys.includes(tentative[i])) continue
      let traitgroup = trait.getTraitGroup()
      if (traitgroup) {
        let conflict = false
        for (let j = 0; j < obtained_trait_keys.length; ++j) {
          let cmptrait = setup.trait[obtained_trait_keys[j]]
          if (cmptrait.getTraitGroup() == traitgroup) {
            conflict = true
            break
          }
        }
        if (conflict) continue
      }
      obtained_trait_keys.push(trait.key)
    }

    while (obtained_trait_keys.length < traitmin) {
      let must_succeed = true

      // generate the "still possible" tags
      let banlist = {}
      for (let i = 0; i < obtained_trait_keys.length; ++i) {
        let trait = setup.trait[obtained_trait_keys[i]]
        let traitgroup = trait.getTraitGroup()
        if (traitgroup) {
          let bantraits = traitgroup.getTraits()
          for (let j = 0; j < bantraits.length; ++j) {
            if (bantraits[j]) {
              banlist[bantraits[j].key] = true
            }
          }
        }
      }

      let still_possible = {}
      for (let chance_key in chances) {
        if (chance_key in banlist) continue
        still_possible[chance_key] = chances[chance_key]
      }

      let chance_array = setup.UnitPool.getChanceArray(still_possible, must_succeed, obtained_trait_keys)

      let sample = setup.rng.sampleArray(chance_array)
      if (sample) {
        obtained_trait_keys.push(sample)
      } else {
        if (must_succeed) throw new Error(`Something weird happens.`)
        break
      }
    }
    return obtained_trait_keys
  }

  _generateTraits() {
    let trait_alloc = this.trait_alloc
    let trait_keys = []

    for (let traitgroup in trait_alloc) {
      let base_obj = trait_alloc[traitgroup]
      let chances = base_obj.chances
      let traitmin = base_obj.min
      let traitmax = base_obj.max
      let obtained_trait_keys = setup.UnitPool.generateTraitsFromObj(chances, traitmin, traitmax)
      Array.prototype.push.apply(trait_keys, obtained_trait_keys)
    }

    let traits = []
    for (let i = 0; i < trait_keys.length; ++i) {
      let key = trait_keys[i]
      if (!(key in setup.trait)) `Trait ${key} not found`
      traits.push(setup.trait[key])
    }
    return traits
  }

  generateUnit() {
    // preference is from settings.GENDER_PREFERENCE
    let traits = this._generateTraits()
    let skills = this._generateSkills()
    let namearray = generateUnitName(traits)
    let unit = new setup.Unit(namearray, traits, skills)

    // post-process it
    setup.RestrictionLib.applyAll(this.post_process, setup.costUnitHelper(unit))

    return unit
  }

  /**
   * Returns unit pool for this race/gender combination.
   * @param {setup.Trait=} subrace 
   * @param {setup.Trait=} gender 
   */
  static getUnitPool(subrace, gender) {
    let unitpools = Object.values(setup.unitpool)

    if (subrace) {
      unitpools = unitpools.filter(unitpool => unitpool.key.startsWith(subrace.key))
    }
    if (gender == setup.trait.gender_male) {
      unitpools = unitpools.filter(unitpool => unitpool.key.endsWith('male'))
    } else if (gender == setup.trait.gender_female) {
      unitpools = unitpools.filter(unitpool => unitpool.key.endsWith('female'))
    }

    return setup.rng.choice(unitpools)
  }
}
