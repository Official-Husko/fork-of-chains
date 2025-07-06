// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
FingerNipples.PINCH_NIPPLES
*/

import { ArmsBreastsFreeBaseDom } from "./ArmsBreastsFreeBase"

setup.SexActionClass.ArmsBreastsFreeDomNipplePinch = class ArmsBreastsFreeDomNipplePinch extends ArmsBreastsFreeBaseDom {
  getTags() { return super.getTags().concat(['normal']) }
  desc() { return 'Pinch nipples' }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_SMALL,
        paces: [setup.sexpace.dom, setup.sexpace.normal],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
        discomfort: setup.Sex.DISCOMFORT_MEDIUMLARGE,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [
          setup.qres.SexIsBodypartUncovered(setup.sexbodypart.breasts),
        ],
      },
    ]
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_nipple_pinch'),
    ])
  }

  rawTitle(sex) {
    return `Pinch nipples`
  }

  rawDescription(sex) {
    return `Pinch b|reps b|nipples.`;
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

    const nippleclothes = them.getEquipmentAt(setup.equipmentslot.nipple)

    let story = ''

    let t
    if (nippleclothes) {
      const nrep = nippleclothes.rep()
      if (mypace == setup.sexpace.dom) {
        t = [
          `yank and violently pull the ${nrep} on b|their b|nipples`,
          `grab and strongly pull the ${nrep} on b|their b|nipples`,
          `give the ${nrep} on b|their b|nipples a strong pull and twist`,
          `hang a|reps a|hand on the ${nrep} on b|their b|nipples before yanking it violently down`,
        ]
      } else {
        t = [
          `tug on the ${nrep} on b|their b|nipples`,
          `hold and flick the ${nrep} on b|their b|nipples`,
          `give the ${nrep} on b|their b|nipples a tentative tug`,
          `slowly pull the ${nrep} attached to b|their b|nipples`,
          `flick the tip of to b|their b|nipples hard in different directions`,
        ]
      }
    } else {
      if (mypace == setup.sexpace.dom) {
        t = [
          `pinch and squeeze b|their b|nipples`,
          `squeeze and twist b|their b|nipples`,
          `twist and pinch b|their b|nipples`,
          `firmly squeeze the tips of b|their b|nipples with a|their thumbs and fingers, before tweaking them in a|their fingertips`,
          `softly flick b|their nipples up and down`,
        ]
      } else {
        t = [
          `pinch and rub at b|their b|nipples`,
          `tug and pinch b|their b|nipples`,
          `press and twist b|their b|nipples`,
          `slowly squeeze the tips of b|their b|nipples with a|their thumbs and fingers, before tweaking them in a|their fingertips`,
        ]
      }
    }
    let verb = setup.rng.choice(t)

    if (mypace == setup.sexpace.dom) {
      t = [
        `Reaching up to b|reps b|breasts, a|rep a|let out a|a_moan as a|they a|start roughly groping b|reps chest, before moving up to forcefully ${verb}.`,
        `b|Reps b|breasts, fully on display, prove to be too tempting a target for a|rep to ignore, and with a|a_moan, a|they a|start to roughly ${verb}.`,
        `Sinking a|their fingers into b|reps  b|breasts, a|rep a|let out a|a_moan before starting to roughly
        ${verb}.`
      ]
    } else {
      t = [
        `Reaching up to b|reps b|breasts, a|rep a|let out a|a_moan as a|they a|start to a|eagerly ${verb}.`,
        `b|Reps b|breasts, fully on display, prove to be too tempting a target for a|rep to ignore, and with a|a_moan, a|they a|start to a|eagerly ${verb}.`,
        `Teasing a|their fingers over b|reps  b|breasts, a|rep a|start to a|eagerly ${verb}.`,
      ]
    }

    story += setup.rng.choice(t) + ' '

    if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep b|let out a moan at a|reps touch, before b|eagerly encouraging a|them to continue giving b|their b|nipples a|their full attention.`,

        ` With a moan, b|rep slowly b|push b|their chest out, imploring a|rep to continue as b|they b|carry on making lewd little noises.`,

        ` b|Eagerly moaning at a|their touch, b|rep gently b|encourage a|rep to carry on stimulating b|their b|nipples.`
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep b|let out a threatening growl at the treatment, making sure a|rep know that a|their turn will come next.`,

        ` With b|a_moan, b|rep b|push b|their chest out, and in a firm tone, b|they b|order a|rep to continue giving b|their b|nipples a|their full undivided attention.`,

        ` Letting out b|a_moan at a|their touch, b|rep b|demand that a|they be prepared to offer a|their a|nipples in return later.`
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        setup.SexUtil.repResist(
          them,
          me,
          sex,
          [
            `knock a|their fingers away from b|their b|nipples`,
            `struggle against a|them`,
            `hide b|their b|nipples from a|reps touch`
          ],
          [
            `a|they a|continue playing with b|reps b|nipples`,
            `a|they a|carry on playing with b|reps b|nipples`,
            `a|they a|continue fondling b|reps b|nipples`,
            `a|they a|continue to ${verb}`,
          ])
      ]
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|Rep b|let out b|a_moan at a|reps touch, the experience giving b|them slight amount of pain.`,

        ` With b|a_moan, b|rep ${h} push b|their chest out, providing access for b|their owner to continue as a|they please.`,

        ` Moaning at a|their touch, b|rep b|is helpless to do anything but to b|let a|rep carry on playing with b|their b|nipples.`
      ]
    } else {
      t = [
        setup.SexUtil.mindbrokenReactionNoun(them, sex, [
          `the abuse on b|their b|nipples`,
          `a|rep playing with b|their b|nipples`,
          `b|their hardening b|nipples`,
        ])
      ]
    }

    story += setup.rng.choice(t) + ' '

    return story
  }
}
