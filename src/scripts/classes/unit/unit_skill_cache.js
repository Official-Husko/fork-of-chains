/**
 * Get unit's cached trait value. Set it first if it was unset.
 * @param {setup.Unit} unit
 * @param {string} varkey 
 * @param {Function} callback 
 */
function getOrCreateCachedValue(unit, varkey, callback) {
  if (!State.variables.cache.has(varkey, unit.key)) {
    const value = callback()
    State.variables.cache.set(varkey, unit.key, value)
  }
  return State.variables.cache.get(varkey, unit.key)
}


setup.Unit.prototype.resetSkillCache = function () {
  State.variables.cache.clear('unitskillmodifiers', this.key)
  State.variables.cache.clear('unitskillmodifiersbaseonly', this.key)
  State.variables.cache.clear('unitskillsbase', this.key)
  State.variables.cache.clear('unitskillsbaseignoreskillboost', this.key)
  State.variables.cache.clear('unitskilladditives', this.key)
  State.variables.cache.clear('unitskilladditivesbaseonly', this.key)
  State.variables.cache.clear('unitskilladds', this.key)
  State.variables.cache.clear('unitskilladdsbaseonly', this.key)
  State.variables.cache.clear('unitskills', this.key)
  State.variables.cache.clear('unitskillsbaseonly', this.key)
}


/**
 * @param {setup.Unit} unit 
 * @param {boolean} is_base_only 
 * @returns {Skills}
 */
export function computeSkillModifiers(unit, is_base_only) {
  const breakdown = unit.getSkillModifiersBreakdown(is_base_only)
  const traitmodsum = setup.Skill.makeEmptySkills()
  for (let i = 0; i < traitmodsum.length; ++i) {
    traitmodsum[i] = breakdown[i].reduce((a, b) => a + b.value, 0.0)
    if (traitmodsum[i] < setup.SKILL_MODIFIER_MIN_MULT) {
      traitmodsum[i] = setup.SKILL_MODIFIER_MIN_MULT
    }
  }
  return traitmodsum
}

/**
 * @param {setup.Unit} unit 
 * @param {boolean} ignore_skill_boost
 * @returns {Skills}
 */
export function computeSkillsBase(unit, ignore_skill_boost) {
  const breakdown = unit.getSkillsBaseBreakdown(ignore_skill_boost)
  const traitmodsum = setup.Skill.makeEmptySkills()
  for (let i = 0; i < traitmodsum.length; ++i) {
    traitmodsum[i] = breakdown[i].reduce((a, b) => a + b.value, 0)
  }
  return traitmodsum
}

/**
 * @param {setup.Unit} unit 
 * @param {boolean} is_base_only
 * @returns {Skills}
 */
export function computeSkillAdditives(unit, is_base_only) {
  const breakdown = unit.getSkillAdditivesBreakdown(is_base_only)
  const traitmodsum = setup.Skill.makeEmptySkills()
  for (let i = 0; i < traitmodsum.length; ++i) {
    traitmodsum[i] = breakdown[i].reduce((a, b) => a + b.value, 0)
  }
  return traitmodsum
}

/**
 * @param {setup.Unit} unit 
 * @param {boolean} is_base_only
 * @returns {Skills}
 */
export function computeSkillsAdd(unit, is_base_only) {
  const nskills = setup.skill.length
  const multipliers = unit.getSkillModifiers(is_base_only)
  const additives = unit.getSkillAdditives(is_base_only)
  const result = unit.getSkillsBase()
  const final = setup.Skill.makeEmptySkills()

  for (let i = 0; i < nskills; ++i) {
    final[i] = Math.floor(result[i] * multipliers[i]) + additives[i]
  }

  return final
}

/**
 * @param {setup.Unit} unit 
 * @param {boolean} is_base_only
 * @returns {Skills}
 */
export function computeSkills(unit, is_base_only) {
  const nskills = setup.skill.length
  const result = unit.getSkillsBase()
  const final = setup.Skill.makeEmptySkills()

  const adds = unit.getSkillsAdd(is_base_only)
  for (let i = 0; i < nskills; ++i) {
    final[i] = result[i] + adds[i]
  }

  return final
}


setup.Unit.prototype.getSkills = function (is_base_only) {
  return getOrCreateCachedValue(
    this,
    is_base_only ? 'unitskillsbaseonly' : 'unitskills',
    () => computeSkills(this, is_base_only),
  )
}


setup.Unit.prototype.getSkillsAdd = function (is_base_only) {
  return getOrCreateCachedValue(
    this,
    is_base_only ? 'unitskilladdsbaseonly' : 'unitskilladds',
    () => computeSkillsAdd(this, is_base_only),
  )
}

setup.Unit.prototype.getSkillModifiers = function (is_base_only) {
  return getOrCreateCachedValue(
    this,
    is_base_only ? 'unitskillmodifiersbaseonly' : 'unitskillmodifiers',
    () => computeSkillModifiers(this, is_base_only),
  )
}

setup.Unit.prototype.getSkillsBase = function (ignore_skill_boost) {
  return getOrCreateCachedValue(
    this,
    ignore_skill_boost ? 'unitskillsbaseignoreskillboost' : 'unitskillsbase',
    () => computeSkillsBase(this, ignore_skill_boost),
  )
}

setup.Unit.prototype.getSkillAdditives = function (is_base_only) {
  return getOrCreateCachedValue(
    this,
    is_base_only ? 'unitskilladditivesbaseonly' : 'unitskilladditives',
    () => computeSkillAdditives(this, is_base_only),
  )
}
