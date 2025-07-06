// @ts-nocheck

/**
 * @param {setup.Unit} unit 
 * @param {setup.SexBodypart} bodypart 
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
export function orgasmPositionPreparation(unit, bodypart, sex) {
  const other = sex.getBodypartOther(unit, bodypart)
  let pretext
  if (other) {
    const verb = bodypart.verbPenetrate(unit, other.unit, other.bodypart, sex)
    const preverb = setup.rng.choice([
      `With a|their a|dick `,
      `Given that a|their a|dick is `,
      `Having a|their a|dick `,
      `Still with a|their a|dick `,
    ])
    pretext = `${preverb} ${verb}`
  } else {
    pretext = sex.getLocation().describePosition(unit, sex)
  }

  const pace = sex.getPace(unit)
  let fin = ''
  if (pace == setup.sexpace.dom) {
    fin = setup.rng.choice([
      ` a|rep a|grins in delight as `,
      ` a|rep a|smiles as `,
      ` a|rep a|let out a menacing grin at b|rep as `,
      ` a|rep a|smile a|adv as `,
    ])
  } else if (pace == setup.sexpace.resist) {
    fin = setup.rng.choice([
      ` a|rep a|is mortified by the fact that `,
      ` a|rep a|grimace as `,
      ` a|rep a|is horrified by the fact that `,
      ` a|rep a|grimace at the fact that `,
    ])
  } else if (pace == setup.sexpace.mindbroken) {
    fin = setup.rng.choice([
      ` a|rep a|is dazed even as `,
      ` a|rep a|remain unfocused even as `,
      ` a|rep a|star blankly as `,
      ` a|rep a|twitch reflexively as `,
    ])
  } else if (pace == setup.sexpace.forced) {
    fin = setup.rng.choice([
      ` a|rep a|steel a|themself as `,
      ` a|rep a|close a|their a|eyes as `,
      ` a|rep a|try to divert a|their thoughts as `,
      ` a|rep a|shut a|their a|eyes as `,
    ])
  } else {
    fin = setup.rng.choice([
      ` a|rep a|lose control as `,
      ` a|rep a|let out a moan as `,
      ` a|rep a|cry out in pleasure as `,
      ` a|rep a|groan in pleasure as `,
    ])
  }

  const postverb = setup.rng.choice([
    ` a|they a|can feel a|their climax coming.`,
    ` a|they a|get as ready as a|they can for the upcoming climax.`,
    ` a|they a|prepare for an incoming climax.`,
    ` a|they a|get ready for the imminent climax.`,
  ])
  return `${pretext}, ${fin} ${postverb}`
}


/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA: getCumQuantityDescription */
export function getCumQuantityDescription(unit, sex) {
  const cum = setup.SexUtil.traitSelectArray(unit, {
    balls_tiny: [
      `a small trickle of cum squirts`,
      `a tiny trickle of cum squirts`,
    ],
    balls_small: [
      `a small amount of cum squirts`,
      `a modest amount of cum squirts`,
    ],
    balls_medium: [
      `a|their cum squirts`,
      `a|their cum splatters`,
    ],
    balls_large: [
      `a|their cum shoots out`,
    ],
    balls_huge: [
      `a|their cum spurts out`,
    ],
    balls_titanic: [
      `a|their cum blasts out`,
    ],
    default: [
      `not even a single drop of cum is produced...`,
    ],
  })
  return setup.SexUtil.convert(cum, { a: unit }, sex)
}
