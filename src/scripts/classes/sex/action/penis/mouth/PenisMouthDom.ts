// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA: BLOWJOB_DOM_GENTLE, BLOWJOB_DOM_NORMAL, BLOWJOB_SUB_NORMAL, BLOWJOB_SUB_EAGER */

import { PenisMouthDomBase } from "./PenisMouthBase"
import { giveBlowjobReaction, penisMouthSizeDifferenceRegular } from "./util"

setup.SexActionClass.PenisMouthDom = class PenisMouthDom extends PenisMouthDomBase {
  getTags() { return super.getTags().concat(['dom',]) }
  desc() { return 'Receive blowjob' }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALLMEDIUM,
        arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
        paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        discomfort: setup.Sex.DISCOMFORT_SMALL,
        paces: setup.SexPace.getAllPaces(),
      },
    ]
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return 'Receive blowjob'
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Push your a|dick into b|reps face to encourage b|them to continue giving you a blowjob.`;
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

    let t
    if (mypace == setup.sexpace.forced) {
      t = [
        `Unsure what to do to please a|their owners, a|rep a|decide to thrust a|their a|dick past b|reps lips, letting out a|a_moan as a|they a|pump a|their hips into b|their b|face.`,
        `a|Rep a|buck a|their hips into b|reps b|face in an attempt to please a|their owner, letting out a|a_moan as a|they a|fuck b|their throat.`,
        `Bucking a|their hips into b|reps b|face, a|rep a|let out a|a_moan as a|they a|continue receiving a|their blowjob, hoping that this is what a|their owner wanted to see.`
      ]
    } else {
      t = [
        `a|Rep a|eagerly a|slide a|their a|dick past b|reps lips, letting out a soft moan as a|they
         a|eagerly a|pump a|their hips into b|their b|face.`,
        `a|Rep a|eagerly a|push a|their hips into b|reps b|face, letting out a soft moan as a|they
         a|eagerly a|fuck b|their throat.`,
        `a|Eagerly bucking a|their hips into b|reps b|face,
         a|rep a|let out a soft moan as a|they a|continue receiving a|their blowjob.`,
        `a|Rep a|eagerly a|thrust a|their hips closer to b|reps b|face, while letting out a moan as a|they
         a|feel a|their a|dick touching the inner walls of b|reps b|mouth.`,
        `a|Eagerly, a|rep a|begin to press a|their a|dick further and further, inserting
         a|their a|dick deep and filling b|reps b|mouth cavity.`,
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    story += penisMouthSizeDifferenceRegular(me, them, sex)
    story += ' '

    story += giveBlowjobReaction(me, them, sex)
    return story
  }
}
