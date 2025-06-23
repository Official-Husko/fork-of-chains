
setup.Text.Unit.Trait.adjectiveGoodRandom = function (unit) {
  let rawtraits = unit.getTraits()
  let possible = rawtraits.filter(trait => (trait.text() && trait.text().adjgood))
  if (!possible.length) {
    let goodneutral = [
      'impartial',
      'unbiased',
      'fair',
    ]
    return setup.rng.choice(goodneutral)
  } else {
    let chosen = setup.rng.choice(possible)
    return setup.rng.choice(chosen.text().adjgood)
  }
}

setup.Text.Unit.Trait.adjectiveBadRandom = function (unit) {
  let rawtraits = unit.getTraits()
  let possible = rawtraits.filter(trait => (trait.text() && trait.text().adjbad))
  if (!possible.length) {
    let badneutral = [
      'weak-willed',
      'suicidal',
    ]
    return setup.rng.choice(badneutral)
  } else {
    let chosen = setup.rng.choice(possible)
    return setup.rng.choice(chosen.text().adjbad)
  }
}

setup.Text.Unit.Trait.adjectiveRandom = function (unit, tag) {
  let rawtraits = []
  if (tag) {
    rawtraits = unit.getAllTraitsWithTag(tag)
  } else {
    rawtraits = unit.getTraits()
  }

  let possible = []
  for (let i = 0; i < rawtraits.length; ++i) {
    let trait = rawtraits[i]
    const adjective = trait.repAdjective()
    if (adjective) possible.push(adjective)
  }

  if (!possible.length) return ''
  return setup.rng.choice(possible)
}

/**
 * @param {setup.Unit} unit 
 * @param {setup.Trait} trait 
 * @returns {string}
 */
setup.Text.Unit.Trait.noun = function (unit, trait) {
  return trait.text()?.noun || ''
}

/**
 * @param {setup.Unit} unit 
 * @param {setup.Trait} trait 
 * @returns {string}
 */
setup.Text.Unit.Trait.description = function (unit, trait) {
  const text = trait.text()
  if (!text) return ''
  let res
  if ('descriptionslave' in text && unit.isSlave()) {
    res = text.descriptionslave
  } else if ('descriptionslaver' in text && unit.isSlaver()) {
    res = text.descriptionslaver
  } else {
    res = trait.text().description
  }
  if (!res) return ''
  return setup.Text.replaceUnitMacros(res, { a: unit })
}

/**
 * @param {setup.Unit} unit 
 * @param {string} tag 
 */
setup.Text.Unit.Trait.flavor = function (unit, tag) {
  /**
   * @type {setup.Trait}
   */
  const trait = unit.getTraitWithTag(tag)
  if (!trait) {
    return ''
  }
  const text = trait.getTexts()
  let res
  if ('flavorslave' in text && unit.isSlave()) {
    res = text.flavorslave
  } else if ('flavorslaver' in text && unit.isSlaver()) {
    res = text.flavorslaver
  } else {
    res = trait.getTexts().flavor
  }
  if (!res) return ''
  return setup.Text.replaceUnitMacros(res, { a: unit })
}

setup.Text.Unit.Trait.skinAdjective = function (unit, skin_tag) {
  let skin_trait = unit.getTraitWithTag(skin_tag)
  if (skin_trait) return skin_trait.repSizeAdjective()

  // if (skin_tag == 'eyes') return 'normal'
  // if (skin_tag == 'ears') return 'normal'
  // if (skin_tag == 'mouth') return 'normal'
  if (skin_tag == 'legs') return 'humanoid'
  if (skin_tag == 'arms') return 'humanoid'
  // if (skin_tag == 'body') return 'human'
  // if (skin_tag == 'dickshape') return 'human-like'
  return ''
}

setup.Text.Unit.Trait.muscular = function (unit) {
  let muscle_trait = unit.getTraitWithTag('muscle')
  if (muscle_trait) return muscle_trait.repSizeAdjective()
  return ''
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.race = function (unit) {
  return unit.getSubrace().text().noun
}

/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.Trait.homeland = function (unit) {
  return unit.getHomeland()
}

