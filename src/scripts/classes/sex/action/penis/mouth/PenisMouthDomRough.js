/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA: BLOWJOB_DOM_ROUGH */

import { PenisMouthDomBase } from "./PenisMouthBase"
import { giveBlowjobReaction, penisMouthSizeDifferenceDeep } from "./util"

setup.SexActionClass.PenisMouthDomRough = class PenisMouthDomRough extends PenisMouthDomBase {
  getTags() { return super.getTags().concat(['dom', 'discomfort', ]) }
  desc() { return 'Face-fuck' }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
        paces: [setup.sexpace.dom], 
      },
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_SMALL,
        discomfort: setup.Sex.DISCOMFORT_MEDIUMLARGE,
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
    return 'Face-fuck'
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Roughly thrust your a|dick down b|reps throat and give b|them a good face-fucking.`
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
    const myposition = sex.getPosition(me)
    const them = this.getActorUnit('b')
    const theirpace = sex.getPace(them)

    let story = ''

    let t

    if (mypose.getFacingHeight(setup.sexbodypart.penis, myposition, sex).facing.isUpDown()) {
      t = [
        `a|Rep a|spread a|their knees out on either side of b|reps head, and before b|they b|know what's happening, a|rep a|is roughly slamming a|their a|dick in and out of b|their facial fuck-hole.`,

				`Letting out a|a_moan, a|rep a|slam a|their a|dick all the way down b|reps throat. As b|they b|blink back tears, a|rep a|start rapidly slamming a|their hips up and down, letting out more a|moans as a|they ruthlessly fucks b|their b|face.`,

				`Dropping down onto b|reps face, a|rep roughly slams a|their a|dick deep down b|their throat, letting out a|a_moan before starting to violently slam a|their hips up and down as a|they ruthlessly fucks b|their face.`,

        `With a forceful thrust, a|rep a|hilt a|their a|dick deep down b|reps throat. As a slimy stream of
         ${me.isHasDick() ? 'cummy' : ''}
         saliva drools from the corners of b|their mouth, a|rep lifts a|themself up, letting b|rep gasp for air for a brief moment before sinking down once more and starting to aggressively fuck b|their face.`
      ]

      if (me.isHasTrait('dick_demon')) {
        t.push(`Spreading a|their knees out on either side of b|reps head, a|rep violently a|thrust downwards, burying a|their a|dick deep down b|reps throat. Grinding the base against b|their lips for moment, a|they then a|proceed to start roughly fucking b|their face, causing b|rep to let out a muffled moan as b|they b|struggle to breathe, and, squirming about beneath a|rep, b|they b|feel b|their throat being raked by the series of barbs that line the sides of a|their a|dick.`)
      } else if (me.isHasTrait('dick_werewolf')) {
        t.push(`Spreading a|their knees out on either side of b|reps head, a|rep violently a|thrust downwards, burying a|their a|dick deep down b|reps throat. Grinding the base against b|their lips for moment, a|they then a|proceed to start roughly fucking b|their face, causing b|rep to let out a muffled moan as b|they b|struggle to breathe, and, squirming about beneath a|rep, b|they b|feel b|their lips being repeatedly battered by the fat knot at the base of a|their a|dick.`);
      }

    } else {
      t = [
        `a|Rep a|grab the sides of b|reps head, and before b|they b|know what's happening, a|rep a|is roughly slamming a|their a|dick in and out of b|their facial fuck-hole.`,

        `Letting out a|a_moan, a|rep a|slam a|their a|dick all the way down b|reps throat. As b|they b|blink back tears, a|rep a|start rapidly bucking a|their hips back and forth, holding b|reps head in place with both a|hands as a|they ruthlessly fucks b|their b|face.`,

        `Grabbing the sides of b|reps head, a|rep roughly b|pull b|their face into a|their groin, sinking a|their a|dick deep down b|their throat before starting to ruthlessly fuck b|their b|face.`,

        `With a forceful thrust, a|rep a|hilt a|their a|dick deep down b|reps throat. As a slimy stream of saliva
        ${me.isHasDick() ? 'and precum' : ''} drools from the corners of b|their mouth, a|rep bucks back, letting b|rep gasp for air for a brief moment before starting to aggressively fuck b|their b|face.`,

        `a|Rep roughly a|slam a|their a|dick past b|reps lips, letting out a|a_moan as a|they violently a|thrust a|their hips into b|their b|face.`,

        `a|Rep violently a|slam a|their hips into b|reps b|face, letting out a|a_moan as a|they roughly a|fuck b|their throat.`,

        `Aggressively bucking a|their hips into b|reps b|face, a|rep a|let out a|a_moan as a|they a|continue roughly fucking b|their face.`,
      ]

      if (me.isHasTrait('dick_demon')) {
        t.push(`With a sudden, violent thrust forwards, a|rep a|bury a|their a|dick deep down b|reps throat. Holding b|their head in place with both a|hands, a|they then a|proceed to start roughly fucking b|their b|face, causing tears to start streaming from b|their b|eyes as the barbs lining a|reps demonic shaft repeatedly rake up the sides of b|their throat.`)
      } else if (me.isHasTrait('dick_werewolf')) {
        t.push(`With a sudden, violent thrust forwards, a|rep a|bury a|their a|dick deep down b|reps throat. Holding b|their head in place with both a|hands, a|they then proceeds to start roughly fucking b|their b|face, causing tears to start streaming from b|their b|eyes as a|reps a|slam a|their knot repeatedly against b|their lips.`)
			}
    }

    story += setup.rng.choice(t)
    story += ' '

    story += penisMouthSizeDifferenceDeep(me, them, sex)
    story += ' '

    story += giveBlowjobReaction(me, them, sex)
    return story
  }
}