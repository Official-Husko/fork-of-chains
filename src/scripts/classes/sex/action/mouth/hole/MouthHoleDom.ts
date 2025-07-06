// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.CUNNILINGUS_DOM_GENTLE
tongueVagina.CUNNILINGUS_DOM_NORMAL
tongueVagina.CUNNILINGUS_DOM_ROUGH
tongueVagina.CUNNILINGUS_SUB_NORMAL
tongueVagina.CUNNILINGUS_SUB_EAGER
*/

import { MouthHoleDomBase } from "./MouthHoleBase"

export class MouthHoleDom extends MouthHoleDomBase {
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_TINY,
        discomfort: setup.Sex.DISCOMFORT_TINY,
        paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.dom, setup.sexpace.forced],
      },
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_SMALL,
        paces: setup.SexPace.getAllPaces(),
      },
    ]
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

    const hole = this.getPenetrationTarget().rep(them, sex)
    const labia = this.getPenetrationTarget().repLabia(them, sex)
    const vaginal = this.getPenetrationTarget().repVaginal(them, sex)
    const cunn = this.getPenetrationTarget().repCunnilingus(them, sex)

    let t
    if (mypace == setup.sexpace.sub) {
      t = [
        `Eagerly driving a|their tongue as deep as possible into b|reps ${labia}, a|rep a|press a|their lips up against b|their ${labia} and a|let out a muffled moan.`,

        `Withdrawing a|their tongue from b|reps ${hole}, a|rep a|start to eagerly kiss and lick b|reps ${labia}, before pressing forwards and greedily sliding a|their tongue into b|their ${hole} once more.`,

        `Drawing a|their tongue out from b|reps ${hole}, a|rep a|start happily kissing and nuzzling against b|reps ${labia}, before leaning forwards and enthusiastically thrusting a|their tongue deep into b|their ${hole}.`
      ]
    } else if (mypace == setup.sexpace.normal) {
      t = [
        `Gently driving a|their tongue as deep as possible into b|reps ${hole}, a|rep a|press a|their lips up against b|their ${labia} and a|let out a muffled moan.`,

        `Withdrawing a|their tongue from b|reps ${hole}, a|rep a|start to gently kiss and lick b|reps ${labia}, before pressing forwards and slowly sliding a|their tongue into b|their ${hole} once more.`,

        `Drawing a|their tongue out from b|reps ${hole}, a|rep a|start slowly kissing and nuzzling against b|reps ${labia}, before leaning forwards and gently thrusting a|their tongue deep into b|their ${hole}.`
      ]
    } else if (mypace == setup.sexpace.dom) {
      t = [
        `Roughly thrusting a|their tongue as deep as possible into b|reps ${hole}, a|rep a|grind a|their lips up against b|their ${labia} and a|let out a muffled moan.`,

        `Withdrawing a|their tongue from b|reps ${hole}, a|rep a|start to roughly kiss and lick b|reps ${labia}, before pressing forwards and violently thrusting a|their tongue into b|their ${hole} once more.`,

        `Drawing a|their tongue out from b|reps ${hole}, a|rep a|start forcefully kissing and licking b|reps ${labia}, before leaning forwards and roughly thrusting a|their tongue deep into b|their ${hole}.`
      ]
    } else {
      t = [
        `Forcing a|their tongue deep into b|reps ${hole}, a|rep a|shut a|their a|eyes as a|they a|press a|their lips up against b|their ${labia} and a|let out a muffled moan.`,

        `Hoping to please b|their owner and avoid more pain, a|rep a|start to kiss and lick b|reps ${labia}, before pressing forwards and sliding a|their tongue into b|their ${hole} once more.`,

        `Drawing a|their tongue out from b|reps ${hole}, a|rep a|start kissing and nuzzling against b|reps ${labia} out of fear, before leaning forwards and thrusting a|their tongue deep into b|their ${hole}.`,
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    if (theirpace == setup.sexpace.resist) {
      t = [
        ` Failing to recoil b|their ${labia} away from a|reps unwelcome tongue, b|rep b|let out b|a_sob as b|they weakly b|try to struggle free.`,

        ` b|A_sob bursts out from between b|reps lips as b|they weakly b|try to push a|rep away, squirming and protesting as a|they a|continue to lick and kiss b|their ${hole}.`,

        ` Sobbing in distress, b|rep b|try, in vain, to recoil away from a|reps tongue, struggling against a|them as a|they a|continue to orally service b|their ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.normal) {
      t = [
        ` b|Rep gently b|buck b|their hips back in response, letting out a soft moan as b|they b|press b|their ${hole} against a|reps lips.`,

        ` A soft moan drifts out from between b|reps lips, and, gently bucking b|their hips back into a|reps a|face, b|they b|beg for a|rep to continue servicing b|their ${labia}.`,

        ` Moaning in delight, b|rep gently b|press b|their ${labia} down against a|reps a|face, before eagerly begging a|them to drive a|their tongue as deep as possible into b|their ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep violently b|thrust b|their hips back in response, letting out b|a_moan as b|they b|grind b|their ${hole} against a|reps lips.`,

        ` b|A_moan bursts out from between b|reps lips, and, roughly slamming b|their hips back into a|reps a|face, b|they b|order a|rep to continue servicing b|their ${labia}.`,

        ` Moaning in delight, b|rep forcefully b|press b|their ${labia} down against a|reps a|face, before aggressively commanding a|them to drive a|their tongue as deep as possible into b|their ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep eagerly b|buck b|their hips back in response, letting out b|a_moan as b|they b|press b|their ${hole} against a|reps lips.`,

        ` b|A_moan bursts out from between b|reps lips, and, eagerly bucking b|their hips back into a|reps a|face, b|they b|beg for a|rep to continue servicing b|their ${labia}.`,

        ` Moaning in delight, b|rep eagerly b|grind b|their ${labia} down against a|reps a|face, before eagerly begging a|them to drive a|their tongue as deep as possible into b|their ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.mindbroken) {
      t = [
        setup.SexUtil.mindbrokenReactionDespite(them, sex, [
          `Despite the stimulations showered on b|their ${hole}`,
          `However, even with the tongue stimulating b|their ${hole}`,
        ])
      ]
    } else {
      t = [
        ` b|Rep meekly b|buck b|their hips back, letting out b|a_moan as b|they b|try to press b|their ${hole} against a|reps lips, hoping to please.`,

        ` b|A_moan drifts out from between b|reps lips, and, bucking b|their hips back into a|reps a|face, b|they secretly b|wish tha a|rep will continue giving a rare service to b|their ${labia}.`,

        ` Hoping this is what b|their owner wanted, b|rep b|grind b|their ${labia} down against a|reps a|face, before begging a|them to drive a|their tongue as deep as possible into b|their ${hole}.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    return story
  }
}
