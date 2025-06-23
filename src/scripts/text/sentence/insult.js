
setup.Text.Insult = {}

// gets a random full insult before a rape. E.g., "You stupid bitch, I'm gonna rape you!."
setup.Text.Insult.prerape = function (unit, target) {
  let insults = []
  if (target.isSlave()) {
    if (target.isHasDick() && !target.isHasTrait(setup.trait.dick_small)) {
      insults.push("You useless little bitch. Your pathetic cock is so small, no wonder you're a slave.")
    } else if (target.isHasDick()) {
      insults.push("You big sad bitch. You've got a nice cock, haven't you? Too bad you're only good for taking dick now.")
    }
    if (target.isHasTrait('training_vagina_advanced')) {
      insults.push("You poor sorry slut. You think you're pretty good in bed, don't you? You have no fucking idea.")
    }
    if (target.isHasTraitExact('vagina_gape') || target.isHasTraitExact('anus_gape')) {
      insults.push("You poor gaping slut. You think you know what it's like to take a pounding, don't you? You have no fucking idea.")
    }
    if (target.isHasTrait('muscle_strong')) {
      insults.push("You poor big bitch. You think all these muscles can save you? You're gonna get raped.")
    }
    if (target.isHasTrait('per_smart')) {
      insults.push("You book-smart slut. You think any of the classes you passed is going to save you from getting raped?")
    } else {
      insults.push("You stupid slut. Too bad you never went to school, maybe you could have learned something and not ended up as a fuck slave.")
    }
  }
  if (insults.length < 2) {
    let adjbad = setup.Text.Unit.Trait.adjectiveBadRandom(target)
    insults.push(`You ${adjbad} slut.`)
  }
  return setup.rng.choice(insults)
}


/* Return a insultable-able noun. E.g., foolishness, stupidity, etc. */
/**
 * @param {setup.Unit} unit 
 * @returns {string}
 */
setup.Text.Insult.noun = function (unit) {
  const traits = unit.getTraits()
  const gender = unit.getGender()
  let candidates = []
  for (const trait of traits) {
    const text = trait.getTexts()
    if (text) {
      candidates = candidates.concat(text.nounbad || [])
      if (gender == setup.trait.gender_male) {
        candidates = candidates.concat(text.nounbadmale || [])
      } else {
        candidates = candidates.concat(text.nounbadfemale || [])
      }
    }
  }

  if (!candidates.length) return `lifelessness`

  return setup.rng.choice(candidates)
}



