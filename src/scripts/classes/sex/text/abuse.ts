// @ts-nocheck

/**
 * Synonyms for abuse
 * @param {setup.Unit} abuser 
 * @param {setup.Unit} abused
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
setup.SexText.abuse = function(abuser, abused, sex) {
  return setup.rng.choice([
    `abuse`,
    `rough treatment`,
    `maltreatment`,
    `molestation`,
    `punishment`,
  ])
}

/**
 * Gives abused impression after being abused by abuser
 * @param {setup.Unit} abuser 
 * @param {setup.Unit} abused
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
setup.SexText.abuseImpression = function(abuser, abused, sex) {
  let choice
  const abuse = setup.SexText.abuse(abuser, abused, sex)
  const moan = setup.SexText.moan(abused, sex)
  if (abused.isMasochistic()) {
    choice = [
      `b|Rep can't help but reeled in a masochistic ecstacy at the ${abuse}.`,
      `b|Reps masochistic tendencies are delighted at the ${abuse}.`,
      `b|Rep let out an approving ${moan} at the ${abuse}.`,
      `b|Rep b|is in a masochistic bliss from the ${abuse}.`,
      `b|Reps body and mind internally battled for control in b|their masochistic mind.`,
    ]
  } else if (sex.getPace(abused) == setup.sexpace.resist) {
    choice = [
      `b|Rep b|continue to sob at the ${abuse}.`,
      `b|Rep b|sob in pain from the ${abuse}.`,
      `b|Rep b|beg for the ${abuse} to stop.`,
      `b|Rep grimaces at the ${abuse}, begging it to stop.`,
      `b|Rep let out b|a_sob for being the subject of a|reps ${abuse}.`,
      `b|Rep b|is visibly discomforted by the ${abuse}.`,
    ]
  } else if (sex.getPace(abused) == setup.sexpace.forced) {
    choice = [
      `b|Rep b|resign to b|their fate of being a sexual plaything and subject for ${abuse}.`,
      `The ${abuse} continues to remind b|rep of b|their lot in life.`,
      `The ${abuse} serves as a reminder for b|rep about their place in life.`,
      `b|Rep b|adv b|accept the ${abuse} out of fear for worse punishment.`,
      `Despite accepting b|their position as a slave, b|rep b|have not get used to the ${abuse}.`,
    ]
  } else if (sex.getPace(abused) == setup.sexpace.dom) {
    choice = [
      `b|Rep swore to get back to a|rep for the ${abuse} later.`,
      `b|Rep took the ${abuse} while maintaining b|their dominant posture.`,
      `b|Rep growled back at a|rep for the ${abuse}.`,
      `b|Rep swore to make sure to pay a|rep back for the ${abuse}.`,
      `b|Rep b|adv growled throughout the ${abuse}.`,
    ]
  } else if (sex.getPace(abused) == setup.sexpace.normal) {
    choice = [
      `b|Rep b|adv b|take the ${abuse}.`,
      `b|Rep b|steel b|themself for the ${abuse}.`,
      `b|Rep b|is even starting to enjoy ${abuse}.`,
      `The ${abuse} mixes both pain and pleasure for b|rep.`,
      `b|Reps mind battled between the pain and pleasure from the ${abuse}.`,
    ]
  } else if (sex.getPace(abused) == setup.sexpace.sub) {
    choice = [
      `b|Rep submissively b|take the ${abuse}.`,
      `b|Rep b|accept the ${abuse} as what b|they b|deserve.`,
      `b|Rep b|is secretly enjoying the ${abuse}.`,
      `b|Rep can't help but reel in submissive pleasure from being the subject of such ${abuse}.`,
      `b|Rep can't help but reel in submissive pleasure from being dominated so thoroughly.`,
    ]
  } else if (sex.getPace(abused) == setup.sexpace.mindbroken) {
    choice = [
      `Outside of some automatic body reactions, b|rep b|show indifference to the ${abuse}.`,
      `Being a mindbroken slave, b|rep b|give minimal reactions to the ${abuse}.`,
      `The ${abuse} b|have no effect on the mindbroken slave.`,
      `The mindbroken slave is unresponsive to the ${abuse}.`,
      `The ${abuse} b|leave no effect on the fully mindbroken slave.`,
    ]
  }
  return setup.SexUtil.convert(choice, {a: abuser, b: abused}, sex)
}

