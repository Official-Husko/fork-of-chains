// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.RECEIVING_CUNNILINGUS_DOM_GENTLE
tongueVagina.RECEIVING_CUNNILINGUS_DOM_NORMAL
tongueVagina.RECEIVING_CUNNILINGUS_DOM_ROUGH
tongueVagina.RECEIVING_CUNNILINGUS_SUB_NORMAL
tongueVagina.RECEIVING_CUNNILINGUS_SUB_EAGER
*/

import { MouthHoleSubBase } from "./MouthHoleBase"

export class MouthHoleSub extends MouthHoleSubBase {
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
        paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.dom, setup.sexpace.forced],
        restrictions: [],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_TINY,
        discomfort: setup.Sex.DISCOMFORT_TINY,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [],
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

    const hole = this.getPenetrationTarget().rep(me, sex)
    const labia = this.getPenetrationTarget().repLabia(me, sex)
    const vaginal = this.getPenetrationTarget().repVaginal(me, sex)
    const cunn = this.getPenetrationTarget().repCunnilingus(me, sex)

    let t
    if (mypace == setup.sexpace.sub) {
      t = [
        `Eagerly pressing a|their ${labia} down over b|reps b|face, a|rep a|let out a|a_moan as a|they firmly a|plant a|their ${hole} down over b|their lips.`,

        `With a|a_moan, a|rep eagerly a|press a|their ${labia} against b|reps b|face, before greedily grinding a|their ${hole} against b|their lips.`,

        `Letting out a|a_moan, a|rep eagerly a|grind a|their ${hole} down against b|reps lips.`
      ]
    } else if (mypace == setup.sexpace.normal) {
      t = [
        `Gently pressing a|their ${labia} down over b|reps b|face, a|rep a|let out a soft moan as a|they firmly a|plant a|their ${hole} down over b|their lips.`,

        `With a soft moan, a|rep a|press a|their ${labia} against b|reps b|face, before gently grinding a|their ${hole} against b|their lips.`,

        `Letting out a soft moan, a|rep gently a|grind a|their ${hole} down against b|reps lips.`
      ]
    } else if (mypace == setup.sexpace.dom) {
      t = [
        `Roughly pressing a|their ${labia} down over b|reps b|face, a|rep a|let out a|a_moan as a|they violently a|slam a|their ${hole} down over b|their lips.`,

        `With a|a_moan, a|rep roughly a|slam a|their ${labia} against b|reps b|face, before forcefully grinding a|their ${hole} against b|their lips.`,

        `Letting out a|a_moan, a|rep roughly a|grind a|their ${hole} down against b|reps lips.`
      ]
    } else {
      t = [
        `Pressing a|their ${labia} down over b|reps b|face, a|rep a|let out a|a_moan as a|they confusedlly a|plant a|their ${hole} down over b|their lips, enjoying the rare attention.`,

        `With a|a_moan, a|rep a|press a|their ${labia} against b|reps b|face, before grinding a|their ${hole} against b|their lips.`,

        `Letting out a|a_moan, a|rep obediently a|grind a|their ${hole} down against b|reps lips.`

      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    if (theirpace == setup.sexpace.resist) {
      t = [
        ` Failing to pull b|their b|face away from a|reps ${labia}, b|rep b|let out b|a_sob as b|they weakly b|try to struggle free.`,

        ` b|A_sob bursts out from between b|reps lips as b|they weakly b|try to push a|rep away, squirming and protesting as a|they a|continue to force a|their ${labia} down against b|their b|face.`,

        ` Sobbing in distress, b|rep b|try, in vain, to recoil away from a|reps ${labia}, struggling against a|them as a|they a|continue to press a|their ${hole} against b|their lips.`
      ]
    } else if (theirpace == setup.sexpace.normal) {
      t = [
        ` b|Rep gently b|slide b|their tongue deep into a|reps ${hole}, letting out a soft, muffled moan as b|they b|press b|their lips against a|reps ${labia}.`,

        ` A muffled moan drifts out from b|reps mouth, and, gently pressing b|their lips against a|reps ${labia}, b|they b|start slowly sliding b|their tongue deep into a|reps ${hole}.`,

        ` Moaning in delight, b|rep gently b|press b|their lips against a|reps ${labia}, before gently sliding b|their tongue as deep as possible into a|their ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep violently b|thrust b|their tongue deep into a|reps ${hole}, letting out a muffled moan as b|they b|press b|their lips against a|reps ${labia}.`,

        ` A muffled moan drifts out from b|reps mouth, and, roughly grinding b|their lips against a|reps ${labia}, b|they b|start violently thrusting b|their tongue deep into a|reps ${hole}.`,

        ` Moaning in delight, b|rep forcefully b|press b|their lips against a|reps ${labia}, before aggressively thrusting b|their tongue as deep as possible into a|their ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep greedily b|thrust b|their tongue deep into a|reps ${hole}, letting out a muffled moan as b|they b|press b|their lips against a|reps ${labia}.`,

        ` A muffled moan bursts out from b|reps mouth, and, eagerly pressing b|their lips against a|reps ${labia}, b|they b|start thrusting b|their tongue deep into a|reps ${hole}.`,

        ` Moaning in delight, b|rep eagerly b|grind b|their lips against a|reps ${labia}, before eagerly driving b|their tongue as deep as possible into a|their ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.mindbroken) {
      t = [
        setup.SexUtil.mindbrokenReactionDespite(them, sex, [
          `But the mindbroken slave is unresponsive, b|their tongue completely still.`,
          `But no intelligence inhabit the b|body that is currently b|rep, and what is left of b|their
          mind is unable to process commands such as "stick your tongue in".`,
        ]),
        `As b|rep b|is mindbroken, a|rep a|have no choice but to grab b|them
         and press b|their ${hole} on b|their crying b|body,
         so your ${labia} is hard against b|their mouth.
         b|They mechanically b|eats a|them out, more out of breathing reflex than eagerness.
         a|Rep a|grind down, taking pleasure from a|their b|adjphys toy.`,
      ]

    } else {
      t = [
        `Fearing punishment, b|Rep b|thrust b|their tongue deep into a|reps ${hole}, letting out a muffled moan as b|they b|force b|themself to press b|their lips against a|reps ${labia}.`,

        ` A muffled moan bursts out from b|reps mouth, and, pressing b|their lips against a|reps ${labia}, b|they distressedly b|start thrusting b|their tongue deep into a|reps ${hole}.`,

        ` Hoping to avoid punishment, b|rep b|grind b|their lips against a|reps ${labia}, before driving b|their tongue as deep as possible into a|their ${hole}.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    return story
  }
}
