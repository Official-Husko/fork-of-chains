/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA : GIVING_BLOWJOB_DEEP_THROAT */

import { PenisMouthSubBase } from "./PenisMouthBase"
import { penisMouthSizeDifferenceDeep } from "./util"
import { blowjobReaction } from "./util"

setup.SexActionClass.PenisMouthSubNormal = class PenisMouthSubNormal extends PenisMouthSubBase {
  getTags() { return super.getTags().concat(['sub',]) }
  desc() { return 'Perform blowjob' }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced],
      },
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_MEDIUM,
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
    return `Perform blowjob`;
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Continue sucking b|reps b|dick.`;
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
        `a|Eagerly wrapping a|their lips around b|reps b|dick,
         a|rep a|start bobbing a|their head up and down as a|they a|give b|them a loving blowjob.`,
        `With a muffled moan, a|rep a|eagerly a|start bobbing a|their head up and down,
         wrapping a|their lips around b|reps b|dick as a|they a|give b|them head.`,
        `a|Eagerly bobbing a|their head up and down,
         a|rep a|eagerly a|wrap a|their lips around b|reps b|dick as a|they a|give b|them a blowjob.`,
      ]
    } else if (mypace == setup.sexpace.dom) {
      t = [
        `Forcefully gripping a|their lips down around b|reps b|dick, a|rep a|start aggressively bobbing a|their head up and down as a|they a|give b|them a rough blowjob.`,
        `With a muffled moan a|rep violently a|start bobbing a|their head up and down, roughly wrapping a|their lips around b|reps b|dick as a|they a|give b|them head.`,
        `Roughly bobbing a|their head up and down, a|rep dominantly a|wrap a|their lips around b|reps b|dick as a|they a|give b|them a forceful blowjob.`
      ]
    } else {
      t = [
        `Fearing punishment, a|rep a|wrap a|their lips around b|reps b|dick and a|start rapidly bobbing a|their head up and down as a|they a|give b|them a blowjob.`,
        `With a muffled moan, a|rep quickly a|start bobbing a|their head up and down, wrapping a|their lips around b|reps b|dick as a|they a|give b|them head out of fear.`,
        `Rapidly bobbing a|their head up and down, a|rep a|wrap a|their lips around b|reps b|dick as a|they a|give b|them a blowjob hoping to please a|their owner.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    story += blowjobReaction(me, them, sex)

    return story
  }
}
