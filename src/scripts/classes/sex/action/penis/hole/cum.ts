// @ts-nocheck

/**
 * Half sentence for eating cum. E.g., "which is lapped clean by b"
 * 
 * @param {setup.Unit} me 
 * @param {setup.Unit} them 
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
export function eatCum(me, them, sex) {
  const mypace = sex.getPace(me)
  const mypose = sex.getPose(me)
  const myposition = sex.getPosition(me)
  const theirpace = sex.getPace(them)
  const theirpose = sex.getPose(them)
  const theirposition = sex.getPosition(them)

  let t
  if (theirpace == setup.sexpace.dom) {
    t = [
      ` which b|rep b|eat clean despite the constant protesting.`,
      ` which is lapped clean protestingly by b|rep.`,
      ` and b|rep b|let b|their protest known as a|they a|eat it all up.`,
    ]
  } else if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
    t = [
      ` which was then b|eagerly licked clean by b|rep.`,
      ` and every single drop was licked clean by b|rep.`,
      ` which was b|eagerly lapped up by b|rep.`,
    ]
  } else if (theirpace == setup.sexpace.forced) {
    const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
    t = [
      ` and b|rep b|force b|themself to lap it all up, lest b|they b|face even more punishment.`,
      ` and b|rep fearfully lick it all clean, while hoping the punishment would end soon.`,
      ` and b|rep is on the edge of tears as b|they ${h} lap it all clean.`,
    ]
  } else if (theirpace == setup.sexpace.resist) {
    t = [
      ` and a|rep a|proceed to force the crying b|rep to lick it all clean, without missing a single drop.`,
      ` and b|rep tearfully licked it all clean under the stern supervision of a|rep.`,
      ` and with a disgusted look in b|their b|face, b|rep b|is forced to b|lap every single drop clean.`,
    ]
  } else if (theirpace == setup.sexpace.mindbroken) {
    t = [
      ` garnering no response from the mindbroken toy.`,
      ` to no reaction from the mindbroken slave.`,
      ` some dribbling down the mindbroken slave's mouth and nose.`,
    ]
  }
  return setup.SexUtil.convert(t, { a: me, b: them }, sex)
}

