import { removeMindbrokenTraits } from "./unit_traits"


/**
 * Resets unit's cached trait map
 */
setup.Unit.prototype.resetTraitMapCache = function () {
  State.variables.cache.clear('unitbasetrait', this.key)
  State.variables.cache.clear('unittrait', this.key)
  State.variables.cache.clear('unitextratrait', this.key)
}


/**
 * Get unit's cached trait value. Set it first if it was unset.
 * @param {setup.Unit} unit
 * @param {string} varkey 
 * @param {Function} callback 
 */
function getTraitMapCacheBackend(unit, varkey, callback) {
  let map = State.variables.cache.get(varkey, unit.key)

  if (!map) {
    const trait_list = callback()
    map = {}
    for (const trait of trait_list) map[trait.key] = true
    State.variables.cache.set(varkey, unit.key, map)
  }

  return map
}



/**
 * Get unit's cached trait value. Set it first if it was unset.
 */
setup.Unit.prototype.getTraitMapCache = function () {
  return getTraitMapCacheBackend(this, 'unittrait', () => this._computeAllTraits())
}


/**
 * Get unit's cached trait value. Set it first if it was unset.
 */
setup.Unit.prototype.getExtraTraitMapCache = function () {
  return getTraitMapCacheBackend(this, 'unitextratrait', () => this._computeAllExtraTraits())
}


/**
 * Get unit's cached trait value. Set it first if it was unset.
 */
setup.Unit.prototype.getBaseTraitMapCache = function () {
  return getTraitMapCacheBackend(this, 'unitbasetrait', () => this._computeAllBaseTraits())
}


/**
 * Compute units extra traits. Also cached for performance.
 */
setup.Unit.prototype._computeAllExtraTraits = function () {
  const trait_map = {}
  /**
   * Extra traits from equipment sets:
   */
  const equipment_set = this.getEquipmentSet()
  if (equipment_set) {
    const trait_obj = equipment_set.getTraitsObj()
    for (const trait_key in trait_obj) {
      const trait = setup.trait[trait_key]
      if (trait.isAttachable()) {
        // only attachable traits become extra traits. Computed traits go with "standard" traits.
        trait_map[trait.key] = true
      }
    }
  }

  /**
   * Extra traits form perks:
   */
  for (const perk_raw of this.getAllTraitsWithTag('perk')) {
    /**
     * @type {setup.Perk}
     */
    const perk = perk_raw
    for (const extra of perk.getPerkExtraTraits()) {
      trait_map[extra.key] = true
    }
  }

  let traits = Object.keys(trait_map).map(key => setup.trait[key]).filter(
    trait => !this.isHasTrait(trait)
  )

  // Remove mindbroken traits
  // Can do this since mindbroken code is special
  const mindbroken = this.isMindbroken()
  if (mindbroken) traits = removeMindbrokenTraits(traits)

  traits.sort(setup.Trait_Cmp)

  return traits
}


/**
 * Compute all unit's base traits and return them as a list. Used internally once then cached.
 */
setup.Unit.prototype._computeAllBaseTraits = function () {
  let traits = Object.keys(this.trait_key_map).map(trait_key => setup.trait[trait_key])
  if (this.isMindbroken()) {
    traits = removeMindbrokenTraits(traits)
  }

  /**
   * Computed (base) traits: corruption and training
   */
  let corruptions = 0
  let trainings = 0

  for (const trait of traits) {
    if (trait.getTags().includes('wings')) {
      traits.push(setup.trait.skill_flight)
    }
    if (trait.isCorruption() && !trait.isNeedGenital()) {
      corruptions += 1
    }
    if (trait.getTags().includes('training')) {
      trainings += 1
    }
  }

  // use this check to also check if unit is in market
  if (trainings == 0 && this.isSlaveOrInSlaveMarket()) {
    traits.push(setup.trait.training_none)
  }

  if (corruptions >= 7) {
    traits.push(setup.trait.corruptedfull)
  } else if (corruptions >= 2) {
    traits.push(setup.trait.corrupted)
  }

  /**
   * Computed traits: primary race
   */
  traits.push(this.getRace())

  /**
   * END
   */
  traits.sort(setup.Trait_Cmp)
  return traits
}


/**
 * Compute all unit's traits and return them as a list. Used internally once then cached.
 */
setup.Unit.prototype._computeAllTraits = function () {
  let traits = this.getBaseTraits()
  const base_trait_map = this.getBaseTraitMapCache()

  /**
   * Trait from equipment set
   */
  const equipment_set = this.getEquipmentSet()
  if (equipment_set) {
    let trait_obj = equipment_set.getTraitsObj()
    for (let trait_key in trait_obj) {
      const trait = setup.trait[trait_key]
      if (!(trait.key in base_trait_map)) {
        if (trait.isAttachable()) {
          // attachable trait from equipments will be included in unit.getExtraTraits() instead.
        } else {
          traits.push(trait)
        }
      }
    }
  }

  /**
   * Computed (base) traits: join time
   */
  if (this.isYourCompany()) {
    let weeks = this.getWeeksWithCompany()
    if (weeks < setup.TRAIT_JUNIOR_THRESHOLD) {
      traits.push(setup.trait.join_junior)
    } else if (weeks >= setup.TRAIT_SENIOR_THRESHOLD) {
      traits.push(setup.trait.join_senior)
    }
  }

  /**
   * Computed (base) traits: unit value
   */
  let value = this.getSlaveValue()
  if (value < setup.TRAIT_VALUE_LOW_THRESHOLD) {
    traits.push(setup.trait.value_low)
  } else {
    for (let i = setup.TRAIT_VALUE_HIGH_THRESHOLDS.length - 1; i >= 0; --i) {
      if (value >= setup.TRAIT_VALUE_HIGH_THRESHOLDS[i]) {
        traits.push(setup.trait[`value_high${i + 1}`])
        break
      }
    }
  }

  /**
   * Temporary traits: trauma and boon
   */
  traits = traits.concat(State.variables.trauma.getTraits(this))

  /**
   * Computed traits: job
   */
  traits.push(this.getJob().getTrait())

  /**
   * END
   */
  traits.sort(setup.Trait_Cmp)
  return traits
}

