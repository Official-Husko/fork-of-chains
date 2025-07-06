// @ts-nocheck

/**
 * Them's reaction to being spitroasted by me's dick.
 * 
 * @param {setup.Unit} me 
 * @param {string} dick
 * @param {setup.Unit} them 
 * @param {string} hole
 * @param {string[]} actions 
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
export function spitroastReaction(me, dick, them, hole, actions, sex) {
  const mypace = sex.getPace(me)
  const mypose = sex.getPose(me)
  const myposition = sex.getPosition(me)
  const theirpace = sex.getPace(them)
  const theirpose = sex.getPose(them)
  const theirposition = sex.getPosition(them)
  const action = '###action###'

  let t
  if (theirpace == setup.sexpace.dom) {
    t = [
      ` Despite the stimulation from both sides, b|rep b|manage to let out a menacing b|growl at a|rep,
        before starting to ${action}.`,
      ` In between b|reps attempt to ${action}, b|they b|let out a menacing growl to let a|rep know
        who is actually in charge.`,
      ` b|rep dominance protests are soon muffled as b|they b|is forced to ${action}.`,
    ]
  } else if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
    t = [
      ` With stimulation from both sides, b|rep can't help but b|let out b|a_moan as b|they b|eagerly 
        ${action}, while feeling a|reps ${dick} gushing inside of them.`,
      ` b|rep b|eagerly ${action}, all the while a|reps ${dick} gush inside and out of b|their ${hole}.`,
      ` b|rep b|eagerly ${action} as a|rep a|continue to a|eagerly pound a|their ${dick} inside of b|them.`,
    ]
  } else if (theirpace == setup.sexpace.forced) {
    const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
    t = [
      ` With stimulation from both sides, b|rep b|is helpless to do anything but b|let out a pained moan
        as b|they b|is forced to ${action}, all while feeling a|reps unwanted ${dick} gushing inside of them.`,
      ` As a|rep a|continue to pound away on b|their ${dick}, b|rep b|is forced to ${action} if b|they b|want to
        breathe.`,
      ` b|Rep b|have no choice but to ${action} while being very aware that b|their ${hole} is simultaneously penetrated by a|reps ${dick}`,
    ]
  } else if (theirpace == setup.sexpace.resist) {
    t = [
      ` b|Rep b|let out a muffled sob as both b|their ${hole} and b|their b|mouth are violated at the same time.`,
      ` Sandwiched between b|their violators, b|rep b|have no choice but to ${action} to continue breathing,
        with tears coming out from b|their eyes.`,
      ` With a muffled sob, b|rep b|is forced to ${action}, all while being very aware of the
        ${dick} a|eagerly penetrating b|their ${hole}.`,
    ]
  } else if (theirpace == setup.sexpace.mindbroken) {
    t = [
      setup.SexUtil.mindbrokenReactionDespite(them, sex, [
        `Despite the violation on b|their b|body from both sides`,
        `Even with the two-pronged forced stimulations`,
        `Even with phalluses inserted into both of b|their holes`
      ])
    ]
  }

  const basetext = setup.SexUtil.convert(t, {a: me, b: them}, sex)
  return basetext.replaceAll(/###action###/g, setup.rng.choice(actions))
}
