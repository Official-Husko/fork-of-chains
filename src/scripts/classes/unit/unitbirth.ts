// @ts-nocheck

// Static method collection for handling childbirth
setup.UnitBirth = class Unitbirth {

  /**
   * Note that the parents does not have to be biologically male/female
   * @param {setup.Unit} father 
   * @param {setup.Unit} mother 
   * @param {object} preference 
   * @returns {setup.Unit}
   */
  static generateChild(father, mother, preference) {
    if (!preference) throw new Error(`preference must be set for generateChild`)

    // keep attempting to find the target unit
    let tries = 1
    if (preference) tries = preference.retries + 1

    let unit = null
    for (let i = 0; i < tries; ++i) {
      /**
       * @type {setup.Unit}
       */
      const candidate = doGenerateChild(father, mother)
      if (i < tries - 1 && preference && !candidate.isHasTraitExact(setup.trait[preference.trait_key])) {
        candidate.delete()
      } else {
        unit = candidate
        break
      }
    }

    // set family
    State.variables.family.setParent(mother, unit)
    State.variables.family.setParent(father, unit)

    return unit
  }
}

/**
 * Note that the parents does not have to be biologically male/female
 * @param {setup.Unit} father 
 * @param {setup.Unit} mother 
 * @returns {setup.Unit}
 */
function doGenerateChild(father, mother) {
  const subrace = setup.rng.choice([
    father.getSubrace(), mother.getSubrace(),
  ])
  const pool = setup.UnitPool.getUnitPool(subrace)
  /**
   * @target {setup.Unit}
   */
  const base_unit = pool.generateUnit()

  // first, inherit background if lucky
  if (Math.random() < setup.CHILD_TRAIT_BACKGROUND_INHERIT_CHANCE) {
    const father_backgrounds = father.getAllTraitsWithTag('bg').filter(
      trait => father.isHasRemovableTrait(trait))
    const mother_backgrounds = mother.getAllTraitsWithTag('bg').filter(
      trait => mother.isHasRemovableTrait(trait))
    const backgrounds = father_backgrounds.concat(mother_backgrounds)
    if (backgrounds.length) {
      const chosen = setup.rng.choice(backgrounds)
      setup.qc.BgTraitReset('unit', chosen).apply(setup.costUnitHelper(base_unit))
    }
  }

  // inherit traits
  const traits = father.getInheritableTraits().concat(
    mother.getInheritableTraits()).concat(
      base_unit.getInheritableTraits())

  setup.qc.RemoveTraitsWithTag('unit', 'per').apply(setup.costUnitHelper(base_unit))
  setup.qc.RemoveTraitsWithTag('unit', 'skill').apply(setup.costUnitHelper(base_unit))

  setup.rng.shuffleArray(traits)

  for (const trait of traits) {
    if (!base_unit.isTraitCompatible(trait)) continue
    const tags = trait.getTags()

    // breast is an exception
    if (tags.includes('breast') && base_unit.isMale()) continue

    if (Math.random() < setup.CHILD_TRAIT_NON_BACKGROUND_INHERIT_CHANCE) {
      // inherit
      setup.qc.TraitReplace('unit', trait).apply(setup.costUnitHelper(base_unit))
    }
  }

  base_unit.resetInnateTraits()

  return base_unit
}



