/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailVagina.TEASE_TAIL_OVER_VAGINA

and also from FCdev's "Kiss" interaction
*/

import { PhallusHoleFreeBaseDom } from "./PhallusHoleFreeBase"

export class PhallusHoleFreeBaseTeaseDom extends PhallusHoleFreeBaseDom {
  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        paces: [setup.sexpace.dom, setup.sexpace.normal],
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

    const dick = this.getPenetratorBodypart().rep(me, sex)
    const tip = this.getPenetratorBodypart().repTip(me, sex)
    const fuck = this.getPenetratorBodypart().repFuck(me, sex)

    const hole = this.getPenetrationTarget().rep(them, sex)
    const labia = this.getPenetrationTarget().repLabia(them, sex)
    const vaginal = this.getPenetrationTarget().repVaginal(them, sex)

    let t
    if (mypace == setup.sexpace.normal) {
      t = [
        `Snaking a|their ${dick} up to b|reps ${hole}, a|rep a|start slowly
        teasing the ${tip} up and down between b|their ${labia}, ready to penetrate b|them at any moment.`,

        `With a soft moan, a|rep a|snake a|their ${dick} up to b|reps ${hole}, before starting
        to gently slide the ${tip} up and down between b|their ${labia}.`,

        `Gently sliding the ${tip} of a|their ${dick} up and down over b|reps ${hole}, a|rep a|let out a soft moan at the thought of being able to penetrate b|them whenever a|they a|feel like it.`,
      ]
    } else if (mypace == setup.sexpace.sub) {
      t = [
        `Snaking a|their ${dick} up to b|reps ${hole}, a|rep a|start eagerly sliding the ${tip} up and down between b|their ${labia}, ready to penetrate b|them at any moment.`,

        `With a|a_moan, a|rep a|snake a|their ${dick} up to b|reps ${hole}, before starting to eagerly slide the ${tip} up and down between b|their ${labia}.`,

        `Eagerly sliding the ${tip} of a|their ${dick} up and down over b|reps ${hole}, a|rep a|let out a|a_moan at the thought of being able to penetrate b|them whenever a|they a|feel like it.`
      ]
    } else if (mypace == setup.sexpace.dom) {
      t = [
        `Grinding a|their ${dick} up against b|reps ${hole}, a|rep a|pull back a little before starting to slide the ${tip} up and down between b|their ${labia}, ready to start fucking b|them at any moment.`,

        `With a|a_moan, a|rep a|line a|their ${dick} up to b|reps ${hole}, before starting to roughly b|grind the ${tip} up and down between b|their ${labia}.`,

        `Roughly grinding the ${tip} of a|their ${dick} up and down over b|reps ${hole}, a|rep a|let out a|a_moan at the thought of being able to start fucking b|them whenever a|they a|feel like it.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    if (theirpace == setup.sexpace.normal) {
      t = [
        ` A soft moan drifts out from between b|reps lips as b|they feels b|their ${hole} being stimulated, and b|they gently b|push b|their ${hole} out against a|reps ${dick}.`,

        ` b|Rep b|let out a soft moan, before gently pushing b|their ${hole} out against a|reps ${dick}.`,

        ` b|Rep b|moan in delight as b|they b|feel a|reps ${dick} stimulating a|their ${hole}, and gently b|push b|their hips out in response.`
      ]
    } else if (theirpace == setup.sexpace.sub) {
      t = [
        ` b|A_moan bursts out from between b|reps lips as b|they feels b|their ${hole} being stimulated, and b|they eagerly b|push b|their ${labia} out against a|reps ${dick}.`,

        ` b|Rep b|let out a desperate moan, before eagerly thrusting b|their ${hole} out against a|reps ${dick}.`,

        ` b|Rep b|moan in delight as b|they b|feel a|reps ${dick} stimulating a|their ${hole}, and desperately b|buck b|their hips out in response.`
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|A_moan bursts out from between b|reps lips as b|they feels b|their ${hole} being stimulated, and b|they forcefully b|thrust b|their ${labia} out against a|reps ${dick}.`,

        ` b|Rep b|let out a desperate moan, before roughly thrusting b|their ${hole} out against a|reps ${dick}.`,

        ` b|Rep b|moan in delight as b|they b|feel a|reps ${dick} stimulating a|their ${hole}, and violently b|buck b|their hips out in response.`
      ]
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|A_moan bursts out from between b|reps lips as b|they feels b|their ${hole} being involuntarily stimulated.`,

        ` b|Rep b|let out a moan, before ${h} thrust b|their ${hole} out against a|reps ${dick}.`,

        ` b|Rep b|moan as b|they b|feel a|reps ${dick} giving unwanted stimulation over a|their ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        setup.SexUtil.repResistGeneric(them, me, sex, [
          `pull b|their ${hole} away from a|reps ${dick}`,
          `avoid a|reps ${dick} from going near b|their ${hole}`,
          `prevent the incoming penetration`,
        ])
      ]
    } else {
      t = [
        setup.SexUtil.mindbrokenReactionDespite(them, sex, [
          `Despite the masterful teasing on b|their ${hole}`,
          `Despite the sensation of a|reps ${dick} sliding up and down b|their ${labia}`,
          `Even with the pleasant sensation of having a|reps ${dick} slide up and down b|their ${labia}`,
        ])
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    return story
  }
}
