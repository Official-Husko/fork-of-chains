/**
 * 
 * @param {setup.Trait | null} trait 
 * @param {setup.TraitGroup | null} [trait_group]
 * @param {boolean} [is_replace]
 */
setup.Unit.prototype.addTrait = function (trait, trait_group, is_replace) {
  // effectively, give trait to unit.
  // there are caveats. First, if trait is from a trait group with is_not_ordered = false,
  // then, will either increase or decrease the trait "value":
  // if trait is a positive trait, then will increase it. Otherwise, will decrease it.
  // otherwise, will replace trait.

  // trait_group can be null, which will default to trait.getTraitGroup()

  // trait can be null, but trait_group must be non null in this case.
  // e.g., if you want to neutralize muscle traitgroups

  // is_replace=True means that forces the replace behavior, even when is_not_ordered = true

  // return the newly added trait, if any.

  // first sanity check
  if (!trait && !trait_group) throw new Error(`Must have either non null trait or non null trait group`)

  if (trait) {
    if (trait_group) {
      if (trait.getTraitGroup() != trait_group) throw new Error(`Incorrect trait group for ${trait.key}`)
    } else {
      trait_group = trait.getTraitGroup()
    }
    if (!trait.isAttachable()) {
      throw new Error(`Cannot add trait ${trait.key} because it is not an attachable trait`)
    }
  }


  // get the trait
  let new_trait = trait
  if (trait_group && !is_replace && trait_group.isOrdered()) {
    new_trait = trait_group.computeResultingTrait(this, trait)
  }

  // check for blessing of virginity and curse of agape
  if (new_trait && (new_trait.getTags().includes('vagina') || new_trait.getTags().includes('anus'))) {
    // check that it actually tightens it
    const trait_group = new_trait.getTraitGroup()
    const original = this.getTraitFromTraitGroup(trait_group)
    const distance = trait_group._getTraitIndex(new_trait) - trait_group._getTraitIndex(original)
    if (distance < 0) {
      // tightening
      if (this.isHasTrait(setup.trait.curse_agape1)) {
        this.decreaseTrait(setup.trait.curse_agape8.getTraitGroup())
        let vagina
        if (new_trait.getTags().includes('vagina')) {
          vagina = 'vagina'
        } else {
          vagina = 'anus'
        }
        if (this.isYourCompany()) {
          setup.notify(`a|Reps Curse of Agape prevents a|their ${vagina} from being tightened`, { a: this })
        }
        return null
      }
    } else if (distance > 0) {
      // gaping
      // prevent with blessing of virginity, if the unit has it
      if (this.isHasTrait(`blessing_virginity${distance}`)) {
        for (let i = 0; i < distance; ++i) {
          this.decreaseTrait(setup.trait.blessing_virginity8.getTraitGroup())
        }
        let vagina
        if (new_trait.getTags().includes('vagina')) {
          vagina = 'vagina'
        } else {
          vagina = 'anus'
        }
        if (this.isYourCompany()) {
          setup.notify(`a|Reps Blessing of Virginity prevents a|their ${vagina} from being gaped`, { a: this })
        }
        return null
      }
    }
  }

  // check for blessing of wolf and curse of lamb
  {
    const sub = setup.trait.per_submissive
    const dom = setup.trait.per_dominant
    if (trait_group && [sub, dom].includes(trait_group.getTraits()[0])) {
      if (
        (new_trait == sub && !this.isHasTrait(sub)) ||
        (!new_trait && this.isHasTrait(dom))
      ) {
        // gaining sub or losing dom
        if (this.isHasTrait(setup.trait.blessing_wolf1)) {
          this.decreaseTrait(setup.trait.blessing_wolf8.getTraitGroup())
          if (this.isYourCompany()) {
            setup.notify(`a|Reps Blessing of Wolf prevents a|them from becoming more submissive`, { a: this })
          }
          return null
        }
      } else if (
        (new_trait == dom && !this.isHasTrait(dom)) ||
        (!new_trait && this.isHasTrait(sub))
      ) {
        // losing sub or gaining dom
        if (this.isHasTrait(setup.trait.curse_lamb1)) {
          this.decreaseTrait(setup.trait.curse_lamb8.getTraitGroup())
          if (this.isYourCompany()) {
            setup.notify(`a|Reps Curse of Lamb prevents a|them from becoming more dominant`, { a: this })
          }
          return null
        }
      }
    }
  }

  // remove conflicting traits
  if (trait_group) {
    let remove_traits = trait_group.getTraits()
    for (let i = 0; i < remove_traits.length; ++i) {
      let remove_trait = remove_traits[i]
      if (remove_trait && this.isHasRemovableTrait(remove_trait) && remove_trait != new_trait) {
        this.removeTraitExact(remove_trait)
        if (this.isYourCompany()) {
          setup.notify(`a|Rep <<dangertext 'a|lose'>> ${remove_trait.rep()}`, { a: this })
        }
      }
    }
  }

  // add trait
  let assigned_trait = null

  if (new_trait && !this.isHasRemovableTrait(new_trait)) {
    // if it's a new trait that has a limit, check if the limit is already reached
    let tag_limit_reached = false
    for (const tag of new_trait.getTags()) {
      if (tag in setup.TRAIT_MAX_HAVE) {
        const limit = setup.TRAIT_MAX_HAVE[tag]
        // @ts-ignore
        const current = this.getAllTraitsWithTag(tag).filter(trait => this.isHasRemovableTrait(trait))
        if (current.length >= limit) {
          tag_limit_reached = true
          if (this.isYourCompany() || State.variables.gDebug) {
            if (new_trait.getTags().includes('perk')) {
              setup.notify(`a|Rep <<dangertext 'a|fail'>> to gain ${new_trait.rep()} because a|they already a|have too many perks! You can reset a|their perks using the ${setup.item.potion_perk.rep()}.`,
                { a: this })
            } else {
              setup.notify(`a|Rep <<dangertext 'a|fail'>> to gain ${new_trait.rep()} because a|they already a|have too many traits of this same type`,
                { a: this })
            }
          }
          break
        }
      }
    }

    if (!tag_limit_reached) {
      // Do the actual getting new trait code
      this.trait_key_map[new_trait.key] = true
      assigned_trait = new_trait

      // Hide traits added to mindbroken units.
      const trait_visible = !this.isMindbroken() || removeMindbrokenTraits([new_trait]).length

      if ((trait_visible && this.isYourCompany()) || State.variables.gDebug) {
        setup.notify(`a|Rep <<successtext 'a|gain'>> ${new_trait.rep()}`, { a: this })
      }
    }
  }

  this.resetCache()

  return assigned_trait
}

/**
 * @param {setup.TraitGroup} trait_group 
 */
setup.Unit.prototype.decreaseTrait = function (trait_group) {
  if (!trait_group) throw new Error(`Missing trait group in decreaseTrait`)
  return this.addTrait(/* trait = */ null, trait_group)
}

/**
 * Innate traits are skin traits that the unit will get purified back to
 * @returns {Array.<setup.Trait>}
 */
setup.Unit.prototype.getInnateTraits = function () {
  return Object.keys(this.innate_trait_key_map).map(key => setup.trait[key])
}

/**
 * Does this unit has this trait as its innate trait?
 * @param {setup.Trait} trait 
 */
setup.Unit.prototype.isHasInnateTrait = function (trait) {
  return trait.key in this.innate_trait_key_map
}

/**
 * Set a trait as an innate trait, replacing all conflicting ones
 * @param {setup.Trait | null} trait
 * @param {setup.TraitGroup} [trait_group]
 */
setup.Unit.prototype.makeInnateTrait = function (trait, trait_group) {
  if (!trait.getTags().includes('skin')) throw new Error(`Can only make innate traits from skin traits`)
  trait_group = trait_group || trait.getTraitGroup()

  // remove conflicting traits
  for (const innate of this.getInnateTraits()) {
    if (innate.getTraitGroup() == trait_group) {
      delete this.innate_trait_key_map[innate.key]
    }
  }

  // set the innate trait
  this.innate_trait_key_map[trait.key] = true
}

/**
 * Reset a unit's innate traits
 * @param {Array.<setup.Trait>} traits 
 */
setup.Unit.prototype.setInnateTraits = function (traits) {
  this.innate_trait_key_map = {}
  for (const trait of traits) {
    this.innate_trait_key_map[trait.key] = true
  }
}

/**
 * Reset a unit's innate traits to their current set of traits
 */
setup.Unit.prototype.resetInnateTraits = function () {
  this.setInnateTraits(this.getAllTraitsWithTag('skin'))
}

setup.Unit.prototype.getMissingInnateTraits = function () {
  const traits = this.getInnateTraits()
  const result = []
  for (const trait of traits) {
    if (!this.isHasRemovableTrait(trait)) result.push(trait)
  }
  return result
}

setup.Unit.prototype.getNonInnateSkinTraits = function () {
  const skins = this.getAllTraitsWithTag('skin')
  const result = []
  for (const trait of skins) {
    if (!this.isHasInnateTrait(trait)) result.push(trait)
  }
  return result
}

/**
 * Remove traits that are incompatible with mindbroken state
 * @param {setup.Trait[]} traits 
 */
export function removeMindbrokenTraits(traits) {
  const disabled_traits_base = ['per', 'skill', 'perk']
  return traits.filter(trait => !trait.getTags().includesAny(disabled_traits_base)).filter(
    trait => trait != setup.trait.will_defiant).filter(
      trait => (trait == setup.trait.training_mindbreak || !trait.getTags().includes('training'))
    )
}


/**
 * Return all unit's base traits. These set of traits are usually static, and is innate to the unit.
 * Includes all in getTraits, and also: computed traits from equipments, join time, slave value, trauma, job
 * 
 * @returns {Array.<setup.Trait>}
 */
setup.Unit.prototype.getBaseTraits = function () {
  return Object.keys(this.getBaseTraitMapCache()).map(trait_key => setup.trait[trait_key])
}


/**
 * Return all unit's traits and computed traits, EXCEPT for extra traits
 * These traits can change as the unit wear/unequip their equipments.
 * Includes: base traits, corruption, training, primary race
 * 
 * @returns {Array.<setup.Trait>}
 */
setup.Unit.prototype.getTraits = function () {
  return Object.keys(this.getTraitMapCache()).map(trait_key => setup.trait[trait_key])
}


/**
 * Return all unit's traits
 * Includes: all traits returned by getTraits and getExtraTraits
 * 
 * @returns {Array.<setup.Trait>}
 */
setup.Unit.prototype.getAllTraits = function () {
  const base = this.getTraits().concat(this.getExtraTraits())
  base.sort(setup.Trait_Cmp)
  return base
}


/**
 * Return all unit's extra traits as a list.
 * Includes ONLY: non-computed traits from equipments
 * 
 * @returns {Array.<setup.Trait>}
 */
setup.Unit.prototype.getExtraTraits = function () {
  return Object.keys(this.getExtraTraitMapCache()).map(trait_key => setup.trait[trait_key])
}


/**
 * @returns {setup.Trait[]}
 */
setup.Unit.prototype.getRemovableTraits = function () {
  return this.getBaseTraits().filter(trait => trait.isAttachable())
}


/**
 * Return a trait from this trait group that this unit have
 * 
 * @param {setup.TraitGroup} trait_group 
 * @returns {setup.Trait}
 */
setup.Unit.prototype.getTraitFromTraitGroup = function (trait_group) {
  if (!trait_group) throw new Error(`missing trait group`)

  const traits = trait_group.getTraits()
  for (const trait of traits) {
    if (trait && this.isHasTraitExact(trait)) return trait
  }
  return null
}

/**
 * Does this unit has any of these traits?
 * @param {Array<setup.Trait | string>} traits 
 */
setup.Unit.prototype.isHasAnyTraitExact = function (traits, ...remainder) {
  if (Array.isArray(traits)) {
    for (const trait of traits) {
      if (this.isHasTraitExact(trait)) return true
    }
  } else {
    for (const trait of [traits].concat(remainder)) {
      if (this.isHasTraitExact(trait)) return true
    }
  }
  return false
}

/**
 * @param {setup.Trait[]} traits 
 * @returns {boolean}
 */
setup.Unit.prototype.isHasTraitsExact = function (traits) {
  for (const trait of traits) {
    if (!this.isHasTraitExact(trait)) return false
  }
  return true
}


/**
 * @param {setup.Trait} trait 
 * @returns {boolean}
 */
setup.Unit.prototype.isHasTraitIncludeExtra = function (trait) {
  for (const trait_covered of trait.getTraitCover()) {
    if (this.isHasTraitIncludeExtraExact(trait_covered)) return true
  }
  return false
}


/**
 * @param {setup.Trait} trait 
 * @returns {boolean}
 */
setup.Unit.prototype.isHasTraitIncludeExtraExact = function (trait) {
  return this.isHasTraitExact(trait) || trait.key in this.getExtraTraitMapCache()
}


/**
 * Does this unit have this trait? Inexact.
 * @param {setup.Trait | string | null} trait_raw
 * @param {setup.TraitGroup} [trait_group]
 * @param {boolean} [ignore_cover]
 */
setup.Unit.prototype.isHasTrait = function (trait_raw, trait_group, ignore_cover) {
  /**
   * @type {setup.Trait}
   */
  const trait = setup.selfOrObject(trait_raw, setup.trait)
  if (trait && !(trait instanceof setup.Trait)) {
    throw new Error(`isHasTrait expects either a string or a trait, e.g., isHasTrait("per_kind") or isHasTrait(setup.trait.per.kind), but found a ${typeof trait_raw}: ${trait_raw} instead.`)
  }

  let traitgroup = trait_group

  if (!traitgroup) {
    if (!trait) throw new Error(`Missing trait: ${trait_raw}`)
    traitgroup = trait.getTraitGroup()
  }

  if (traitgroup && !ignore_cover) {
    if (trait) {
      return this.isHasAnyTraitExact(traitgroup.getTraitCover(trait))
    } else {
      const opposite = traitgroup.getTraitCover(trait, true)
      return !this.isHasAnyTraitExact(opposite)
    }
  } else {
    return this.isHasAnyTraitExact([trait])
  }
}


/**
 * Remove all traits with this tag
 * @param {string} trait_tag
 */
setup.Unit.prototype.removeTraitsWithTag = function (trait_tag) {
  const to_remove = []
  const traits = this.getTraits()

  for (const trait of traits) {
    if (trait.getTags().includes(trait_tag)) {
      to_remove.push(trait)
    }
  }

  for (const trait of to_remove) {
    this.removeTraitExact(trait)
  }
}


/**
 * Removes a trait
 * @param {setup.Trait} trait 
 * @returns {boolean}  whether it's actually removed.
 */
setup.Unit.prototype.removeTraitExact = function (trait) {
  if (!trait.isAttachable()) {
    // cannot be removed
    return
  }
  if (trait.key in this.trait_key_map) {
    delete this.trait_key_map[trait.key]
    this.resetCache()
    return true
  }
  return false
}


/**
 * @param {setup.Trait | string} trait_raw
 */
setup.Unit.prototype.isHasTraitExact = function (trait_raw) {
  /**
   * @type {setup.Trait}
   */
  let trait = setup.selfOrObject(trait_raw, setup.trait)
  if (!trait) throw new Error(`Missing trait in is has trait exact: ${trait_raw}`)

  return trait.key in this.getTraitMapCache()
}


/**
 * @param {setup.Trait | string} trait
 * @param {boolean} [include_cover]
 * @returns {boolean}
 */
setup.Unit.prototype.isHasRemovableTrait = function (trait, include_cover) {
  /**
   * @type {setup.Trait}
   */
  const trait_parsed = setup.selfOrObject(trait, setup.trait)
  if (!trait_parsed.isAttachable()) return false
  return this.isHasTrait(trait_parsed, null, !include_cover)
}


setup.Unit.prototype.isMale = function () {
  return this.isHasTraitExact(setup.trait.gender_male)
}

setup.Unit.prototype.isFemale = function () {
  return this.isHasTraitExact(setup.trait.gender_female) || this.isSissy()
}

setup.Unit.prototype.isSissy = function () {
  return (this.isHasTraitExact(setup.trait.training_sissy_advanced) ||
    this.isHasTraitExact(setup.trait.training_sissy_master))
}

setup.Unit.prototype.isHasBalls = function () {
  return this.isHasTrait(setup.trait.balls_tiny)
}

setup.Unit.prototype.isHasVagina = function () {
  return this.isHasTrait(setup.trait.vagina_tight)
}

setup.Unit.prototype.getWings = function () {
  return this.getTraitWithTag('wings')
}

setup.Unit.prototype.getTail = function () {
  return this.getTraitWithTag('tail')
}

/**
 * @returns {setup.Equipment | null}
 */
setup.Unit.prototype.getTailPlug = function () {
  const plug = this.getEquipmentAt(setup.equipmentslot.rear)
  if (plug && plug.getTags().includes('tailplug')) {
    return plug
  }
  return null
}

/**
 * @param {boolean} [includes_tailplug]
 * @returns {boolean}
 */
setup.Unit.prototype.isHasTail = function (includes_tailplug) {
  if (this.getTail()) return true
  if (includes_tailplug && this.getTailPlug()) return true
  return false
}

/**
 * @param {string} tag 
 * @returns {setup.Trait | null}
 */
setup.Unit.prototype.getTraitWithTag = function (tag) {
  let traits = this.getTraits()
  for (let i = 0; i < traits.length; ++i) {
    if (traits[i] && traits[i].getTags().includes(tag)) return traits[i]
  }
  return null
}

setup.Unit.prototype.getAllTraitsWithTag = function (tag) {
  return this.getTraits().filter(a => a.getTags().includes(tag))
}

/**
 * @returns {setup.Trait}
 */
setup.Unit.prototype.getSubrace = function () {
  // Don't use getTraitWithTag, because this is part of a unit's base traits
  const traits = Object.keys(this.trait_key_map).map(trait_key => setup.trait[trait_key]).filter(
    trait => trait.getTags().includes('subrace')
  )
  if (traits.length > 1) {
    throw `Incorrect subrace for unit ${this.key}. Unit has ${traits.length} subraces.`
  } else if (!traits.length) {
    // this is possible, when in the middle of transition between a trait being removed and then later added.
    return setup.trait.subrace_humankingdom
  }
  return traits[0]
}

/**
 * @returns {setup.Trait}
 */
setup.Unit.prototype.getRace = function () {
  // don't use getTraitWithTag because this is used too often in computeTrait

  const subrace = this.getSubrace()
  const main_races = subrace.getTags().map(key => setup.trait[key]).filter(
    trait => trait && trait.getTags().includes('race'))
  if (main_races.length != 1) throw new Error(`Unknown main race for ${subrace}!`)
  return main_races[0]
}

/**
 * @returns {setup.Trait}
 */
setup.Unit.prototype.getGender = function () {
  return this.getTraitWithTag('gender')
}


/**
 * Returns the traits that should have been (first case), or traits that should be removed (second)
 * Returns: [ [trait, traitgroup], [null, traitgroup], ... ]
 * @param {string} trait_tag 
 * @returns {Array.<Array>}
 */
setup.Unit.prototype._getPurifiable = function (trait_tag) {
  const candidates = setup.TraitHelper.getAllTraitsOfTags(['skin'])

  const purifiable = []

  const has_dick = this.isHasTrait(setup.trait.dick_tiny)

  for (const trait of candidates) {
    // wrong tag = continue
    if (trait_tag && !trait.getTags().includes(trait_tag)) continue

    // dicks only for units with dicks
    if (trait.getTags().includes('dickshape') && !has_dick) continue

    if (this.isHasInnateTrait(trait) && !this.isHasRemovableTrait(trait)) {
      // missing innate trait
      purifiable.push([trait, trait.getTraitGroup()])
    } else if (!this.isHasInnateTrait(trait) && this.isHasRemovableTrait(trait)) {
      // non-innate trait that should be removed
      purifiable.push([null, trait.getTraitGroup()])
    }
  }
  return purifiable
}

setup.Unit.prototype.isCanPurify = function (trait_tag) {
  return this._getPurifiable(trait_tag).length > 0
}

setup.Unit.prototype.purify = function (trait_tag) {
  if (this.isSlaver()) {
    State.variables.statistics.add('purifications_slaver', 1)
  } else if (this.isSlave()) {
    State.variables.statistics.add('purifications_slave', 1)
  }

  if (this.getRace() == setup.trait.race_demon) {
    // demons cannot be purified.
    if (this.isYourCompany()) {
      setup.notify(`a|Rep a|attempt to be purified but demons cannot be purified, no matter what`,
        { a: this })
    }
    return null
  }
  let candidates = this._getPurifiable(trait_tag)
  if (!candidates.length) {
    if (this.isYourCompany()) {
      setup.notify(`a|Rep a|attempt to be purified but nothing happened`, { a: this })
    }
    return null
  }
  let target = setup.rng.choice(candidates)
  this.addTrait(target[0], target[1])
}


/**
 * @param {{
 *   unit: setup.Unit,
 *   trait_tag?: string,
 *   is_return_anyways?: boolean,
 *   is_ignore_blessing?: boolean,
 * }} args
 * 
 * @returns {setup.Trait | null}
 */
function doCorrupt({
  unit, trait_tag, is_return_anyways, is_ignore_blessing,
}) {
  {
    // if unit has blessing of purity, use it
    if (!is_ignore_blessing && unit.isHasTrait(setup.trait.blessing_purity1)) {
      unit.decreaseTrait(setup.trait.blessing_purity1.getTraitGroup())
      if (unit.isYourCompany()) {
        setup.notify(`a|Reps Blessing of Purity prevents an impending corruption`, { a: unit })
      }
      return null
    }
  }

  if (unit.isSlaver()) {
    State.variables.statistics.add('corruptions_slaver', 1)
  } else if (unit.isSlave()) {
    State.variables.statistics.add('corruptions_slave', 1)
  }

  let rng = Math.random()
  let targets = []
  let tags = ['skin']
  if (trait_tag) tags.push(trait_tag)
  let rare_chance = setup.CORRUPTION_MISFIRE_RARE_CHANCE
  let medium_chance = setup.CORRUPTION_MISFIRE_MEDIUM_CHANCE
  if (is_return_anyways) {
    rare_chance *= setup.CORRUPTION_PERMANENT_MISFIRE_CHANCE_MULTIPLIER
    medium_chance *= setup.CORRUPTION_PERMANENT_MISFIRE_CHANCE_MULTIPLIER
  }

  if (rng < rare_chance) {
    targets = setup.TraitHelper.getAllTraitsOfTags(tags.concat(['rare']))
  } else if (rng < medium_chance) {
    targets = setup.TraitHelper.getAllTraitsOfTags(tags.concat(['medium']))
  }

  if (!targets.length) {
    targets = setup.TraitHelper.getAllTraitsOfTags(tags.concat(['common']))
  }

  targets = targets.filter(trait => unit.isTraitCompatible(trait))

  if (!targets.length) {
    return null
  }

  let result = setup.rng.choice(targets)
  let failed = false

  if (unit.isHasRemovableTrait(result)) {
    failed = true
  }

  if (failed) {
    if (unit.isYourCompany()) {
      setup.notify(`a|Rep a|is supposed to be corrupted but nothing happened.`, { a: unit })
    }
    if (is_return_anyways) {
      return result
    } else {
      return null
    }
  } else {
    return unit.addTrait(result)
  }
}


/**
 * @param {string} [trait_tag]
 * @param {boolean} [is_return_anyways]  // whether this function will always return a trait, even though it does not corrupt
 * @returns {setup.Trait | null}
 */
setup.Unit.prototype.corrupt = function (trait_tag, is_return_anyways) {
  if (!is_return_anyways && !trait_tag) {
    // activate curse of vice
    if (this.isHasTrait(setup.trait.curse_vice1)) {
      this.decreaseTrait(setup.trait.curse_vice1.getTraitGroup())
      if (this.isYourCompany()) {
        setup.notify(`a|Reps Curse of Vice amplifies the corruption...`, { a: this })
      }
      if (Math.random() < setup.CURSE_VICE_PERMANENT_CORRUPTION_CHANCE) {
        this.corruptPermanently()
      } else {
        doCorrupt({ unit: this })
      }
    }
  }

  return doCorrupt({ unit: this, trait_tag: trait_tag, is_return_anyways: is_return_anyways })
}

/**
 * @returns {setup.Trait | null}
 */
setup.Unit.prototype.corruptPermanently = function () {
  const result = doCorrupt({
    unit: this, is_ignore_blessing: true,
  })

  if (result) {
    this.makeInnateTrait(result)
    return result
  } else {
    return null
  }
}

setup.Unit.prototype.getSpeech = function () {
  if (this.is_speech_reset) {
    this.recomputeSpeech()
  }
  return setup.speech[this.speech_key]
}

setup.Unit.prototype.getSpeechChances = function () {
  // {speechkey: score}
  let chances = {}
  for (let speechkey in setup.speech) {
    let speech = setup.speech[speechkey]
    chances[speechkey] = speech.computeScore(this)
  }
  return chances
}

// recompute a unit's speech.
setup.Unit.prototype.resetSpeech = function () {
  this.is_speech_reset = true
}

setup.Unit.prototype.recomputeSpeech = function () {
  let scores = this.getSpeechChances()
  let arr = Object.values(scores)
  let maxscore = Math.max(...arr)
  if (this.speech_key && scores[this.speech_key] == maxscore) {
    // keep
    return
  }
  this.speech_key = null
  let keys = Object.keys(scores)
  setup.rng.shuffleArray(keys)
  for (let i = 0; i < keys.length; ++i) {
    let key = keys[i]
    if (scores[key] == maxscore) {
      this.speech_key = key
      break
    }
  }
  if (!this.speech_key) throw new Error(`??????`)
  this.is_speech_reset = false
}

setup.Unit.prototype.isAllowedTalk = function () {
  let bedchamber = this.getBedchamber()
  if (this.isSlave() && bedchamber && bedchamber.getOption('speech') != 'full') return false
  return true
}

setup.Unit.prototype.isCanTalk = function () {
  return this.isAllowedTalk() && this.isCanPhysicallyTalk()
}

setup.Unit.prototype.isAllowedWalk = function () {
  let bedchamber = this.getBedchamber()
  if (this.isSlave() && bedchamber && bedchamber.getOption('walk') != 'walk') return false
  return true
}

setup.Unit.prototype.isCanWalk = function () {
  return this.isAllowedWalk() && this.isCanPhysicallyWalk()
}

setup.Unit.prototype.isAllowedOrgasm = function () {
  let bedchamber = this.getBedchamber()
  if (this.isSlave() && bedchamber && bedchamber.getOption('orgasm') != 'yes') return false
  return true
}

setup.Unit.prototype.isCanOrgasm = function () {
  if (!this.isAllowedOrgasm()) return false
  if (this.isHasTrait(setup.trait.eq_chastity)) return false
  if (this.isHasDick() && !this.isCanPhysicallyCum()) return false
  return true
}

setup.Unit.prototype.isCanPhysicallyTalk = function () {
  return !this.isHasTrait(setup.trait.eq_gagged)
}

setup.Unit.prototype.isCanPhysicallyWalk = function () {
  return !this.isHasTrait(setup.trait.eq_restrained)
}

setup.Unit.prototype.isCanPhysicallyOrgasm = function () {
  return !this.isHasTrait(setup.trait.eq_chastity)
}

setup.Unit.prototype.isCanPhysicallyCum = function () {
  return (
    this.isHasDick() && this.isCanPhysicallyOrgasm()
  )
}

setup.Unit.prototype.isCanSee = function () {
  return this.isHasTrait(setup.trait.eq_blind)
}

setup.Unit.prototype.isDietCum = function () {
  let bedchamber = this.getBedchamber()
  return (this.isSlave() && bedchamber && bedchamber.getOption('food') == 'cum')
}

setup.Unit.prototype.isDietMilk = function () {
  let bedchamber = this.getBedchamber()
  return (this.isSlave() && bedchamber && bedchamber.getOption('food') == 'milk')
}

setup.Unit.prototype.getDefaultWeapon = function () {
  const weapons = [
    setup.equipment.weapon_sword,
    setup.equipment.weapon_spear,
    setup.equipment.weapon_axe,
    setup.equipment.weapon_dagger,
    setup.equipment.weapon_staff,
  ]
  return weapons[this.Seed('defaultweapon') % 5]
}

/**
 * Is this trait compatible with this unit gender, race, etc? Will also return false if it's a computed trait.
 * @param {setup.Trait} trait 
 * @returns {boolean}
 */
setup.Unit.prototype.isTraitCompatible = function (trait) {
  if (!trait.isAttachableTo(this)) return false
  if (trait instanceof setup.Perk) {
    // perk has a special check if the unit has it as a prereq.
    if (!this.getPerkChoices().includes(trait)) return false
  }
  return true
}

/**
 * Get the inheritable traits from this unit.
 * @returns {Array<setup.Trait>}
 */
setup.Unit.prototype.getInheritableTraits = function () {
  const base_traits = this.getRemovableTraits().filter(
    trait => {
      const tags = trait.getTags()
      return tags.includes('physical') || tags.includes('per') || tags.includes('skill')
    }
  )

  const skin_traits = this.getInnateTraits()
  return base_traits.concat(skin_traits)
}

/**
 * @returns {string}
 */
setup.Unit.prototype.getHomeland = function () {
  return setup.Text.Race.region(this.getSubrace())
}

/**
 * @returns {setup.Company}
 */
setup.Unit.prototype.getHomeCompany = function () {
  // special case for outlaws
  if (this.isHasAnyTraitExact([
    `bg_boss`, `bg_raider`, `bg_slaver`, `bg_thief`, `bg_thug`,
  ])) {
    return State.variables.company.outlaws
  } else {
    /**
     * @type {setup.Trait}
     */
    const subrace = this.getSubrace()
    const company_key = subrace.getTexts().company_key
    if (!(company_key in State.variables.company)) {
      throw new Error(`Missing company key ${company_key} for race ${subrace.getName()}`)
    }

    const company = State.variables.company[company_key]
    return company
  }
}

/**
 * @returns {boolean}
 */
setup.Unit.prototype.isFurryBody = function () {
  /**
   * @type {setup.Trait}
   */
  const body = this.getTraitWithTag('body')
  return body && body.getTags().includes('furry')
}
