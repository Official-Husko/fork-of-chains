/**
 * E.g., "With a cruel smirk", "With a sadistic grin", "Grinning in delight", "Carefully", etc.
 * @param {setup.Unit} unit 
 * @param {setup.SexInstance} sex 
 * @return {string}
 */
setup.SexText.preThought = function(unit, sex) {
  const pace = sex.getPace(unit)
  let choice = []
  if (pace == setup.sexpace.mindbroken) {
    choice = [
      `Without displaying any emotions`,
      `Without any emotions`,
      `Mechanically`,
    ]
  } else if (pace == setup.sexpace.sub) {
    choice = [
      `Submissively`,
      `With a submissive look`,
      `Eager to serve`,
      `Looking forward to serve`,
    ]
  } else if (pace == setup.sexpace.resist) {
    /* Not actually possible for resisting unit to initiate, but just in case */
    choice = [
      `While crying`,
    ]
  } else if (pace == setup.sexpace.forced) {
    choice = [
      `With a resigned sigh`,
      `Fearing punishment`,
      `Trying not to think about what a|unit a|is about to do`,
    ]
  } else {
    choice = [
      `With a a|adjper smirk`,
      `Grinning a|adv`,
    ]
  }
  return setup.SexUtil.convert(choice, {a: unit}, sex)
}


/**
 * moan, groan, muffled moan, etc.
 * @param {setup.Unit} unit 
 * @param {setup.SexInstance} sex 
 * @return {string}
 */
setup.SexText.moan = function(unit, sex) {
  let choices
  if (!sex.isCanUse(unit, setup.sexbodypart.mouth)) {
    choices = [
      `muffled moan`,
      `muffled groan`,
      `gagged moan`,
      `gagged groan`,
    ]
  } else {
    choices = [
      `audible moan`,
      `moan`,
      `groan`,
      `audible groan`,
    ]
  }
  return setup.rng.choice(choices)
}


/**
 * sobs etc
 * @param {setup.Unit} unit 
 * @param {setup.SexInstance} sex 
 * @return {string}
 */
setup.SexText.sob = function(unit, sex) {
  let choices
  if (!sex.isCanUse(unit, setup.sexbodypart.mouth)) {
    choices = [
      `muffled sob`,
      `muffled whine`,
      `gagged sob`,
      `gagged whine`,
    ]
  } else {
    choices = [
      `audible sob`,
      `sob`,
      `whine`,
      `audible whine`,
    ]
  }
  return setup.rng.choice(choices)
}


/**
 * E.g., "earning a muffled gasp from you"
 * @param {setup.Unit} unit 
 * @param {setup.SexInstance} sex 
 * @return {string}
 */
setup.SexText.postThought = function(unit, sex) {
  const pace = sex.getPace(unit)

  const moan = setup.SexText.moan(unit, sex)

  /**
   * @type {string[]}
   */
  let choice

  if (pace == setup.sexpace.mindbroken) {
    choice = [
      'eliciting no response from the mindbroken slave',
      'earning no response from the mindbroken slave',
    ]
  } else if (pace == setup.sexpace.forced || pace == setup.sexpace.resist) {
    choice = [
      `eliciting an involuntary ${moan} from a|rep`,
      `earning a helpless ${moan} from a|rep`,
    ]
  } else if (pace == setup.sexpace.sub) {
    choice = [
      `eliciting a submissive ${moan} from a|rep`,
      `earning an approving ${moan} from a|rep`,
    ]
  } else {
    choice = [
      `making a|rep a|let out a|a_moan from the pleasure`,
      `making a|rep a|let out a|a_moan back in pleasure`,
    ]
  }
  return setup.SexUtil.convert(choice, {a: unit}, sex)
}


