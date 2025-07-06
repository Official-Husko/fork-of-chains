// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA: BLOWJOB_DOM_RESISTING */

import { PenisMouthDomBaseResist } from "./PenisMouthBase"

setup.SexActionClass.PenisMouthDomResist = class PenisMouthDomResist extends PenisMouthDomBaseResist {
  getTags() { return super.getTags().concat(['normal', ]) }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALLMEDIUM,
        arousal: -setup.Sex.AROUSAL_SMALLMEDIUM,
        discomfort: -setup.Sex.DISCOMFORT_SMALL,
        paces: [setup.sexpace.resist],
        restrictions: [
          setup.qres.SexPaceIn([setup.sexpace.resist])
        ],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
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
    return `Resist blowjob`
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Try to pull away from b|reps b|dick.`;
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawStory(sex) {
    const me = this.getActorUnit('a')
    const mypace = sex.getPace(me)
    const mypose = sex.getPose(me)
    const them = this.getActorUnit('b')
    const theirpace = sex.getPace(them)

    let story = ''

    let t

    if (theirpace == setup.sexpace.dom) {
      t = [
        `Letting out a|a_sob, a|rep frantically a|try to pull a|their lips away from b|reps face, but a|their efforts prove to be in vain as b|they roughly b|hold a|them in place, growling in a threatening manner as b|they forcefully b|slide b|their lips up and down the length of a|their a|dick.`,

        `Tears start to well up in a|reps a|eyes, and with a|a_sob, a|they a|try to pull a|their a|dick out of b|reps mouth. b|Their grip proves to be far too strong, however, and b|rep b|let out a threatening growl as b|rep b|continue to suck a|their a|dick.`,

        `Sobbing, a|rep a|try to pull a|their a|dick out of b|reps mouth, but b|their grip is too strong for a|them, and a|their struggles prove to be in vain as b|rep b|continue giving a|them a rough, forceful blowjob.`
      ]
    } else {
      t = [
        `Letting out a|a_sob, a|rep frantically a|try to pull a|their hips away from b|reps face, but a|their efforts prove to be in vain as b|they b|eagerly, but firmly, b|hold a|them in place, b|eagerly sliding b|their lips up and down the length of a|their a|dick as b|they b|continue giving a|them an unwanted blowjob.`,

        `Tears start to well up in a|reps a|eyes, and with a|a_sob, a|they a|try to pull a|their a|dick out of b|reps mouth. b|Their grip proves to be too strong, however, and b|rep b|eagerly, but firmly, a|continue to suck a|their a|dick as a|they weakly struggles against b|them.`,

        `Sobbing, a|rep a|try to pull a|their a|dick out of b|reps mouth, but b|their grip is too strong for a|them, and a|their struggles prove to be in vain as b|rep b|continue giving a|them a ${theirpace == setup.sexpace.normal ? `slow, gentle` : `frantic and enthusiastic`} blowjob.`
      ]
    }

    return t
  }
}