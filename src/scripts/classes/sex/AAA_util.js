setup.SexUtil = {}

/**
 * @param {string | string[]} options 
 * @param {Object<string, setup.Unit>} unit_map 
 * @param {setup.SexInstance} sex  // optional, to replace some extra commands
 * @returns {string}
 */
setup.SexUtil.convert = function(options, unit_map, sex) {
  let chosen
  if (Array.isArray(options)) {
    chosen = setup.rng.choice(options)
  } else {
    chosen = options
  }

  // replace sex macros
  if (sex) {
    const macro_map = {
      a_moan: (unit) => { return setup.Article(setup.SexText.moan(unit, sex)) },
      A_moan: (unit) => { return setup.Article(setup.SexText.moan(unit, sex), true) },
      moans: (unit) => { return `${setup.SexText.moan(unit, sex)}s`},
      // moan: (unit) => {},
      // moaning: (unit) => {},
      // Moaning: (unit) => {},

      a_sob: (unit) => { return setup.Article(setup.SexText.sob(unit, sex)) },
      A_sob: (unit) => { return setup.Article(setup.SexText.sob(unit, sex), true) },
      sobs: (unit) => { return `${setup.SexText.sob(unit, sex)}s`},
      // sob: (unit) => {}
      // sobbing: (unit) => {},
      // Sobbing: (unit) => {},

      eagerly: (unit) => { return sex.getPace(unit).repAdverb(unit, sex) },
      Eagerly: (unit) => { return setup.capitalize(sex.getPace(unit).repAdverb(unit, sex)) },
    }

    chosen = chosen.replace(/(\w+)\|([\w_]+)/g,
      (match, unitname, unitverb) => {
        if (unitverb in macro_map) {
          const unit = unit_map[unitname]
          if (unit) {
            return macro_map[unitverb](unit)
          }
        }
        return `${unitname}|${unitverb}`
      }
    )
  }

  return setup.Text.replaceUnitMacros(
    chosen,
    unit_map,
  )
}

/**
 * @param {number} value 
 * @returns {string}
 */
setup.SexUtil.repArousal = function(value) {
  const r = Math.round((1000 - value) / 1000 * 255)
  return `<span
  style="color:rgb(${r}, 255, ${r})"
  data-tooltip="Arousal: How close this unit is to climax">
    ${(value / 10).toFixed(1)} ${setup.repImgIcon(setup.Sex.AROUSAL_ICON)}
  </span>`
}

/**
 * @param {number} value 
 * @returns {string}
 */
setup.SexUtil.repDiscomfort = function(value) {
  const r = Math.round((1000 - value) / 1000 * 255)
  return `<span
  style="color:rgb(255, 255, ${r})"
  data-tooltip="Discomfort: Amount of discomfort this unit is having from this intercourse">
    ${(value / 10).toFixed(1)} ${setup.repImgIcon(setup.Sex.DISCOMFORT_ICON)}
  </span>`
}

/**
 * @param {number} value 
 * @returns {string}
 */
setup.SexUtil.repEnergy = function(value) {
  const r = Math.round((1000 - value) / 1000 * 255)
  return `<span
  style="color:rgb(${r}, ${r}, 255)"
  data-tooltip="Energy: How much energy left in this unit for sex action">
    ${(value / 10).toFixed(1)} ${setup.repImgIcon(setup.Sex.ENERGY_ICON)}
  </span>`
}


/**
 * @param {setup.Unit} unit 
 * @param {Object<string, number>} trait_effects 
 * @returns {number}
 */
setup.SexUtil.sumTraitMultipliers = function(unit, trait_effects) {
  // sanity check
  for (const trait_key in trait_effects) {
    if (trait_key != 'default' && !(trait_key in setup.trait)) {
      throw new Error(`Unknown trait in calculateTraitMultiplier: ${trait_key}`)
    }
  }

  let found = false
  let multiplier = 0
  for (const trait_key in trait_effects) {
    if (trait_key == 'default') continue
    if (!(trait_key in setup.trait)) throw new Error(`unknown trait: ${trait_key}`)
    if (unit.isHasTraitExact(trait_key)) {
      found = true
      multiplier += trait_effects[trait_key]
    }
  }

  if (!found && 'default' in trait_effects) multiplier += trait_effects.default

  return multiplier
}


/**
 * @param {setup.Unit} unit 
 * @param {Object<string, number>} trait_effects 
 * @returns {number}
 */
setup.SexUtil.calculateTraitMultiplier = function(unit, trait_effects) {
  const multiplier = setup.SexUtil.sumTraitMultipliers(unit, trait_effects) + 1.0
  return Math.max(multiplier, 0)
}


/**
 * Gets a trait-based option from the list.
 * @param {setup.Unit} unit 
 * @param {Object<string, any>} trait_choices   (e.g., {tough_nimble: ['run', 'dash', ], tough_tough: ['walk', 'trudge'], default: ['a']})
 */
setup.SexUtil.traitSelect = function(unit, trait_choices) {
  let chosen = trait_choices.default

  for (const trait_key in trait_choices) {
    if (trait_key != 'default' && unit.isHasTraitExact(trait_key)) {
      return trait_choices[trait_key]
    }
  }

  if (!chosen) throw new Error(`Missing "default" in trait_choices!`)
  return chosen
}


/**
 * TraitSelect but returns a random element out of the options.
 * @param {setup.Unit} unit 
 * @param {Object<string, any[]>} trait_choices   (e.g., {tough_nimble: ['run', 'dash', ], tough_tough: ['walk', 'trudge'], default: ['a']})
 */
setup.SexUtil.traitSelectArray = function(unit, trait_choices) {
  const chosen = setup.SexUtil.traitSelect(unit, trait_choices)
  if (!chosen.length) throw new Error(`No selection for traitselectarray for unit ${unit.key}`)
  return setup.rng.choice(chosen)
}

