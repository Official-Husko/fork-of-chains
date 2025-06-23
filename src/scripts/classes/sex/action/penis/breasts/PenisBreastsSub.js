/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
PenisBreasts.FUCKED_DOM_GENTLE
PenisBreasts.FUCKED_DOM_NORMAL
PenisBreasts.FUCKED_DOM_ROUGH
PenisBreasts.FUCKED_SUB_EAGER
PenisBreasts.FUCKED_SUB_NORMAL
*/

import { PenisBreastsSubBase } from "./PenisBreastsBase"
import { getDickPokeOutSentence } from "./util"

setup.SexActionClass.PenisBreastsSub = class PenisBreastsSub extends PenisBreastsSubBase {
  getTags() { return super.getTags().concat(['sub',]) }
  desc() { return 'Perform titfuck / pecjob' }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALLMEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced],
      },
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
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
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')
    const titfuck = setup.sexbodypart.breasts.repTitfuck(them, me)
    return `Perform ${titfuck}`;
  }

  /**
   * Short description of this action. E.g., "Put your breasts in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Pleasure b|reps b|dick with your a|breasts.`
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
    const theirpose = sex.getPose(them)
    const theirpace = sex.getPace(them)
    const theirposition = sex.getPosition(them)

    const myfacingheight = mypose.getFacingHeight(this.getPenetratorBodypart(), myposition, sex)
    const theirfacingheight = theirpose.getFacingHeight(this.getPenetrationTarget(), theirposition, sex)

    let dir = 'for'
    let odir = 'back'
    if (myfacingheight.facing.isDown()) {
      dir = 'down'
      odir = 'up'
    } else if (myfacingheight.facing.isUp()) {
      dir = 'up'
      odir = 'down'
    }

    let story = ''

    const titfuck = setup.sexbodypart.breasts.getTitfuck(them, me)
    let push = setup.sexbodypart.breasts.repPush(them, me)

    let t
    if (mypace == setup.sexpace.normal || mypace == setup.sexpace.sub) {
      t = [
        `Reaching up to ${push} a|their a|breasts together around b|reps b|dick,
         a|rep a|eagerly a|raise and a|lower a|their torso, a|eagerly moaning as
         a|they a|use a|their a|cleavage.`,

        `a|Eagerly squeezing a|their a|breasts around b|reps b|dick, a|rep a|eagerly
         a|lift them up and down, letting out a moan as a|they a|eagerly
         a|give b|them a ${titfuck}.`,

        `Letting out a moan, a|rep a|${push} a|their a|breasts together,
         enveloping b|reps b|dick in a|their a|breasts as a|they a|give
         b|them a ${titfuck}.`,
      ]
    } else if (mypace == setup.sexpace.dom) {
      t = [
        `Reaching up to roughly force a|their a|breasts together around
         b|reps b|dick, a|rep rapidly a|raise and a|lower a|their torso,
         moaning as a|they a|use a|their cleavage to give b|them a dominant
         ${titfuck}.`,

        `Forcefully squeezing a|their a|breasts around b|reps b|dick, a|rep
         roughly a|bounce them up and down, letting out a|a_moan as a|they
         a|give b|them a forceful and borderline painful ${titfuck}.`,

        `Letting out a|a_moan, a|rep forcefully a|${push} a|their a|breasts
         together, enveloping b|reps b|dick in a|their a|breasts and crushing
         the dick inside.`,
      ]
    } else {
      t = [
        `Fearing punishment, a|rep a|${push} a|their a|breasts together and
         a|try a|their best to stimulate the dick trapped within.`,
        `Not wanting to anger b|rep, a|rep mechanically a|move a|their a|body
         up and down, stroking the dick trapped inside a|their a|cleavage.`,
        `a|Rep a|force a|themself to a|${push} a|their a|breasts together,
         trying to give a ${titfuck} to a|their betters.`,
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    push = setup.sexbodypart.breasts.repPush(them, me)
    const pokeout = getDickPokeOutSentence(them, me, sex)

    if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep b|eagerly b|thrust b|their b|dick in and out between a|reps
          a|breasts, letting out b|a_moan as b|they b|eagerly b|fuck
          a|their a|cleavage.`,

        ` b|A_moan bursts out from b|reps b|mouth, before b|they b|start
          thrusting b|their b|dick all the way in the a|cleavage between a|reps a|breasts. ${pokeout}`,

        ` Moaning in delight, b|rep b|eagerly b|drive b|their b|dick in and out
          between a|reps a|breasts.`,

        ` b|Rep b|pause for a moment, before b|eagerly driving the entire length of b|their b|dick into the inviting b|cleavage. ${pokeout}`,
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep violently b|thrust b|their b|dick in and out between a|reps
          a|breasts, letting out b|a_moan as b|they roughly b|fuck a|their a|cleavage.`,

        ` b|Rep b|let out a grunt, before b|they b|start
          roughly slamming b|their b|dick all the way in a|reps a|cleavage. ${pokeout}`,

        ` Moaning in delight, b|rep roughly b|slam b|their b|dick back and forth between a|reps a|breasts.`,

        ` Without warning, b|rep b|eagerly b|drive the entire length of
          b|their b|dick into the vulnerable b|cleavage. ${pokeout}`,
      ]
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|Rep ${h} just enjoy the rare occassion of having someone else service b|their b|dick.`,
        ` b|Rep ${h} slide b|their b|dick a little between the a|breasts.`,
        ` b|Rep ${h} buck b|their b|hips, mechanically fucking the a|breasts.`,
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        ` Failing to pull b|their b|dick away from a|reps a|breasts, b|rep
          b|let out b|a_sob as b|they weakly b|try to struggle free.`,

        ` b|Rep b|try to pull b|their b|dick away, but this only makes a|rep
        tigthen the squeezing of a|their a|breasts, locking the dick securely within the a|cleavage.`,

        ` Sobbing in distress, b|rep b|try to pull b|their b|dick
        away from a|reps a|breasts, but it was in vain as a|reps a|breasts grip it too strongly.`,
      ]
    } else if (theirpace == setup.sexpace.mindbroken) {
      t = [
        setup.SexUtil.mindbrokenReactionNoun(them, sex, [
          `the stimulation on a|their a|dick`,
          `the b|breasts stimulating a|their a|dick`,
          `the ongoing ${titfuck}`,
        ])
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    return story
  }
}
