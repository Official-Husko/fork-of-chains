/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailVagina.FORCE_TAIL_OVER_VAGINA 

and also from FCdev's "Kiss" interaction
*/

import { PhallusHoleFreeBaseSub } from "./PhallusHoleFreeBase"

export class PhallusHoleFreeBaseTeaseSub extends PhallusHoleFreeBaseSub {
  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        paces: [setup.sexpace.normal, setup.sexpace.sub],
        restrictions: [],
      },
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_SMALL,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [],
      },
    ]
  }

  /**
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_tease'),
    ])
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawStory(sex) {

    const me = this.getActorUnit('a')
    const mypace = sex.getPace(me)
    const them = this.getActorUnit('b')
    const theirpace = sex.getPace(them)

    let story = ''

    const dick = this.getPenetratorBodypart().rep(them, sex)
    const tip = this.getPenetratorBodypart().repTip(them, sex)
    const fuck = this.getPenetratorBodypart().repFuck(them, sex)

    const hole = this.getPenetrationTarget().rep(me, sex)
    const labia = this.getPenetrationTarget().repLabia(me, sex)
    const vaginal = this.getPenetrationTarget().repVaginal(me, sex)

    let t
    if (mypace == setup.sexpace.normal) {
      t = [
        `a|Rep a|grab b|reps ${dick}, before guiding it up to a|their ${hole}. Slowly pushing the ${tip} up and down between a|their ${labia}, a|they a|tease b|rep with the promise of penetration at any moment.`,

        `With a soft moan, a|rep a|grab b|reps ${dick} and a|guide it up to a|their ${hole}, before starting to gently slide the ${tip} up and down between a|their ${labia}.`,

        `Grabbing b|reps ${dick}, a|rep gently a|slide the ${tip} over a|their ${hole}, letting out a soft moan as a|they a|tease b|them with the promise of penetration.`
      ]
    } else if (mypace == setup.sexpace.sub) {
      t = [
        `a|Rep a|grab b|reps ${dick}, before guiding it up to a|their ${hole}. Eagerly pushing the ${tip} up and down between a|their ${labia}, a|they a|tease b|rep with the promise of penetration at any moment.`,

        `With a|a_moan, a|rep a|grab b|reps ${dick} and a|guide it up to a|their ${hole}, before starting to eagerly slide the ${tip} up and down between a|their ${labia}.`,

        `Grabbing b|reps ${dick}, a|rep eagerly a|slide the ${tip} over a|their ${hole}, letting out a|a_moan as a|they a|tease b|them with the promise of penetration.`
      ]
    } else if (mypace == setup.sexpace.dom) {
      t = [
        `a|Rep a|grab b|reps ${dick}, before yanking it up to a|their ${hole}. Roughly forcing the ${tip} up and down between a|their ${labia}, a|they a|tease b|rep with the promise of penetration at any moment.`,

        `With a|a_moan, a|rep a|grab b|reps ${dick} and yank it up to a|their ${hole}, before starting to roughly a|force the ${tip} up and down between a|their ${labia}.`,

        `Grabbing b|reps ${dick}, a|rep roughly a|grind the ${tip} over a|their ${hole}, letting out a|a_moan as a|they a|tease b|them with the promise of penetration.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    if (theirpace == setup.sexpace.normal) {
      t = [
        ` A soft moan drifts out from between b|reps lips, and b|they b|start gently rubbing b|their b|their ${dick} up and down over a|reps ${hole}.`,

        ` b|Rep b|let out a soft moan, before gently sliding b|their ${dick} back and forth over a|reps ${hole}.`,

        ` b|Rep b|moan in delight as b|they b|feel b|their ${dick} being stimulated, and, needing no further encouragement, b|they b|start gently sliding b|their b|their ${dick} up and down over a|reps ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.sub) {
      t = [
        ` b|A_moan bursts out from between b|reps lips, and b|they b|start enthusiastically rubbing b|their b|their ${dick} up and down over a|reps ${hole}.`,

        ` b|Rep b|let out a desperate moan, before eagerly sliding b|their ${dick} back and forth over a|reps ${hole}.`,

        ` b|Rep b|moan in delight as b|they b|feel b|their ${dick} being stimulated, and, needing no further encouragement, b|they b|start eagerly sliding b|their b|their ${dick} up and down over a|reps ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|A_moan bursts out from between b|reps lips, and b|they b|start roughly grinding b|their b|their ${dick} up and down over a|reps ${hole}.`,

        ` b|Rep b|let out b|a_moan, before forcefully grinding b|their ${dick} back and forth over a|reps ${hole}.`,

        ` b|Rep b|moan in delight as b|they b|feel b|their ${dick} being stimulated, and, seeking to remind a|rep who's in charge, b|they b|start roughly grinding b|their b|their ${dick} up and down over a|their ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|A_moan bursts out from between b|reps lips, and b|they ${h} start rubbing b|their b|their ${dick} up and down over a|reps ${hole}.`,

        ` b|Rep b|let out an involuntary moan, before ${h} slide b|their ${dick} back and forth over a|reps ${hole}.`,

        ` b|Rep b|gasp involuntarily as b|they b|feel b|their ${dick} being stimulated, and, 
        ${h} start sliding b|their b|their ${dick} up and down over a|reps ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        setup.SexUtil.repResistGeneric(them, me, sex, [
          `pull b|their ${dick} away from a|reps ${hole}`,
          `avoid a|reps ${hole} from going near b|their ${dick}`,
          `beg a|rep to let go of b|their ${dick}`,
        ])
      ]
    } else {
      t = [
        setup.SexUtil.mindbrokenReactionDespite(them, sex, [
          `Despite the masterful teasing on b|their ${dick}`,
          `Despite the sensation of b|their ${dick} sliding up and down a|reps ${labia}`,
          `Even with the pleasant sensation of having b|their ${dick} slide up and down a|reps ${labia}`,
        ])
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    return story
  }
}
