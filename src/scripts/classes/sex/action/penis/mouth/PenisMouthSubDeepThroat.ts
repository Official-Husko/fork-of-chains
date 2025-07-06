// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA : GIVING_BLOWJOB_DEEP_THROAT */

import { PenisMouthSubBase } from "./PenisMouthBase"

import { penisMouthSizeDifferenceDeep } from "./util"

setup.SexActionClass.PenisMouthSubDeepThroat = class PenisMouthSubDeepThroat extends PenisMouthSubBase {
  getTags() { return super.getTags().concat(['sub', 'discomfort',]) }
  desc() { return 'Deep-throat' }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_deepthroat'),
    ])
  }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        discomfort: setup.Sex.DISCOMFORT_MEDIUM,
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_LARGE,
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
    return 'Deep-throat'
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Take b|reps b|dick as deep as possible down your throat.`
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
    if (mypace == setup.sexpace.normal || mypace == setup.sexpace.sub) {
      t = [
        `a|Eagerly wrapping a|their lips around the b|dick in a|their mouth, a|rep a|adv a|push a|their
        head forwards, a|eagerly taking b|reps b|dick as deep down a|their throat as a|they possibly can.`,
        `With a muffled moan a|rep a|eagerly a|lean forwards, parting a|their lips as a|they a|eagerly a|take as much of b|reps b|dick down a|their throat as a|they can.`,
        `a|Eagerly sliding a|their head forwards, a|rep readily a|part a|their lips as a|they a|take b|reps b|dick deep down a|their throat.`,
        `After taking a deep breath, a|rep a|eagerly a|press a|their head deep into b|reps groin, swallowing
        the entire length of b|their b|dick reaching down a|their throat.`,
      ]
    } else if (mypace == setup.sexpace.dom) {
      t = [
        `Forcefully wrapping a|their lips around the b|dick in a|their mouth, a|rep roughly a|slam a|their head forwards, forcing b|reps b|dick as deep down a|their throat as a|they possibly can.`,
        `With a muffled moan a|rep quickly a|lean forwards, parting a|their lips as a|they roughly a|force as much of b|reps b|dick down a|their throat as a|they can.`,
        `Aggressively pushing a|their head forwards, a|rep a|part a|their lips as a|they a|force b|reps b|dick deep down a|their throat.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    story += penisMouthSizeDifferenceDeep(them, me, sex)

    return story
  }
}
