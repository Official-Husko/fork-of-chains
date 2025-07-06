// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
tailVagina.RIDING_TAIL_DOM_GENTLE
tailVagina.RIDING_TAIL_DOM_NORMAL
tailVagina.RIDING_TAIL_DOM_ROUGH
tailVagina.RIDING_TAIL_SUB_NORMAL
tailVagina.RIDING_TAIL_SUB_EAGER
universal/Cowgirl.java
.*/

import { SexActionOnOngoingSub } from "../../SexActionOnOngoing"
import { phallusHoleSizeDifferenceOngoingSub } from "../util"

export class PhallusHoleSubBase extends SexActionOnOngoingSub {
  /**
   * Multiply discomfort from size difference
   * @param {string} actor_name 
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} sex 
   * @returns {number}
   */
  getDiscomfortMultiplier(actor_name, unit, sex) {
    const my_size = this.getPenetratorBodypart().getSize(this.getActorUnit('b'), sex)
    const their_size = (this.getPenetrationTarget().getSize(this.getActorUnit('a'), sex) +
      this.getPenetrationTarget().getTraitSizeModifier(this.getActorUnit('a'), sex))

    const size_diff = my_size - their_size
    const idx = size_diff + setup.Sex.BODYPART_MAX_SIZE

    const base = super.getDiscomfortMultiplier(actor_name, unit, sex)

    if (actor_name == 'a') {
      return base * setup.Sex.BODYPART_SIZE_DIFFERENCE_DISCOMFORT_MULTIPLIER_RECEIVER[idx]
    } else {
      return base * setup.Sex.BODYPART_SIZE_DIFFERENCE_DISCOMFORT_MULTIPLIER_GIVER[idx]
    }
  }

  /**
   * Multiply arousal from size difference.
   * @param {string} actor_name 
   * @param {setup.Unit} unit
   * @param {setup.SexInstance} sex 
   * @returns {number}
   */
  getArousalMultiplier(actor_name, unit, sex) {
    // arousal disregard training multipliers. They will be taken into account via bodypart giver/receiver.
    const my_size = this.getPenetratorBodypart().getSize(this.getActorUnit('b'), sex)
    const their_size = this.getPenetrationTarget().getSize(this.getActorUnit('a'), sex)

    const size_diff = my_size - their_size
    const idx = size_diff + setup.Sex.BODYPART_MAX_SIZE

    const base = super.getDiscomfortMultiplier(actor_name, unit, sex)

    if (actor_name == 'a') {
      return base * setup.Sex.BODYPART_SIZE_DIFFERENCE_AROUSAL_MULTIPLIER_RECEIVER[idx]
    } else {
      return base * setup.Sex.BODYPART_SIZE_DIFFERENCE_AROUSAL_MULTIPLIER_GIVER[idx]
    }
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
    const theirpose = sex.getPose(them)
    const theirposition = sex.getPosition(them)

    let story = ''

    const dick = this.getPenetratorBodypart().rep(them, sex)
    const tip = this.getPenetratorBodypart().repTip(them, sex)
    const fuck = this.getPenetratorBodypart().repFuck(them, sex)

    const hole = this.getPenetrationTarget().rep(me, sex)
    const labia = this.getPenetrationTarget().repLabia(me, sex)
    const vaginal = this.getPenetrationTarget().repVaginal(me, sex)

    const myfacingheight = mypose.getFacingHeight(this.getPenetrationTarget(), myposition, sex)
    const theirfacingheight = theirpose.getFacingHeight(this.getPenetratorBodypart(), theirposition, sex)

    let dir = 'back'
    let odir = 'forward'
    if (myfacingheight.facing.isDown()) {
      dir = 'down'
      odir = 'up'
    } else if (myfacingheight.facing.isUp()) {
      dir = 'up'
      odir = 'down'
    }

    let t
    if (mypace == setup.sexpace.sub || mypace == setup.sexpace.normal) {
      t = [
        `a|Eagerly pushing a|their hips ${dir}, a|rep a|let out a|a_moan as a|they a|help sink b|reps ${dick} deep into a|their ${hole}.`,

        `With a|a_moan, a|rep a|eagerly a|start thrusting a|their hips ${dir}, forcing b|reps ${dick} ever deeper into a|their ${hole}.`,

        `a|Eagerly thrusting a|reps hips ${dir}, a|a_moan bursts out from between a|reps lips as a|their movements force b|reps ${dick} deep into a|their ${hole}.`,

        `a|Rep a|eagerly a|move a|themself up before sliding back ${dir}, letting out a soft moan as a|they a|spear a|their ${hole} on b|reps b|dick.`,
      ]

      if (myfacingheight.facing.isDown() && theirfacingheight.facing.isUp()) {
        t = t.concat([
          `Using a|their legs, a|rep a|eagerly a|lift a|themself up and down, sliding b|reps b|dick in and out of a|their ${hole} as a|they a|groan out loud.`,
          `Leaning forwards, a|rep uses a|their a|hands to support some of a|their weight as a|they a|eagerly a|slide up and down on b|reps b|dick. As a|they a|lower a|their a|face towards b|rep, a|they gets a waft of b|reps b|scent, and a|they bites a|their lips as a|they breathes in the intoxicating aroma.`,
          `Lowering a|their a|hands to a|their knees, a|rep uses a|their a|legs to a|eagerly slide a|themself up and down, letting out soft a|moans as a|they a|impale a|themself on b|reps b|dick.`,
        ])
      }

    } else if (mypace == setup.sexpace.dom) {
      t = [
        `Violently slamming a|their hips ${dir}, a|rep a|let out a|a_moan as a|they a|force b|reps ${dick} deep into a|their ${hole}.`,

        `With a|a_moan, a|rep roughly a|start slamming a|their hips ${dir}, forcing b|reps ${dick} ever deeper into a|their ${hole}.`,

        `Forcefully thrusting a|reps hips ${dir}, a|a_moan bursts out from between a|reps lips as a|their movements roughly force b|reps ${dick} deep into a|their ${hole}.`
      ]

      if (myfacingheight.facing.isDown() && theirfacingheight.facing.isUp()) {
        t = t.concat([
          `Using a|their legs, a|rep rapidly bounces a|themself up and down, slamming b|reps b|dick in and out of a|their ${hole} as a|they a|groan out loud.`,
          `Leaning forwards, a|rep uses a|their a|hands to support some of a|their weight as a|they starts rapidly bucking up and down on b|reps b|dick. As a|they a|lower a|their a|face towards b|rep, a|they gets a waft of b|reps b|scent, and a|they bites a|their lips as a|they breathes in the intoxicating aroma.`,
          `Placing a|their a|hands down on the floor behind a|them for support, a|rep starts rapidly bouncing a|themself up and down, letting out shuddering, a|moans as a|they a|impale a|themself on b|reps b|dick.`,
          `Grinning down at b|rep, a|rep starts enthusiastically bouncing up and down, letting out a|a_moan as a|they a|spear a|their ${hole} on b|reps b|dick.`,
        ])
      }

    } else {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        `Pushing a|their hips ${dir}, a|rep a|let out a|a_moan as a|they ${h} sink b|reps ${dick} deep into a|their ${hole}.`,

        `a|Rep ${h} start thrusting a|their hips ${dir}, forcing b|reps ${dick} ever deeper into a|their ${hole} in the hopes of avoiding more punishment.`,

        `a|Rep ${h} thrust a|their hips ${dir}. a|A_moan then bursts out from between a|reps lips as a|their movements force b|reps ${dick} deep into a|their ${hole}.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    if (theirpace == setup.sexpace.resist) {
      t = [
        ` Failing to pull b|their ${dick} away from a|reps ${hole}, b|rep b|let out b|a_sob as b|they weakly b|try to struggle free.`,

        ` b|A_sob bursts out from between b|reps lips as b|they weakly b|try to push a|rep away, squirming and protesting as a|rep a|continue to force b|their ${dick} deep into a|their ${hole}.`,

        ` Sobbing in distress, b|rep b|try, in vain, to pull b|their ${dick} away from a|reps ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep b|eagerly b|thrust b|their ${dick} deep into a|reps ${hole}, letting out a muffled moan as b|they b|eagerly b|penetrate b|their ${hole}.`,

        ` A muffled moan bursts out from b|reps mouth, before b|they b|start thrusting b|their ${dick} deep into a|reps ${hole}.`,

        ` Moaning in delight, b|rep b|eagerly b|drive b|their ${dick} as deep as possible into a|reps ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep violently b|thrust b|their ${dick} deep into a|reps ${hole}, letting out a muffled moan as b|they roughly b|penetrate b|their ${hole}.`,

        ` A muffled moan drifts out from b|reps mouth, before b|they b|start violently thrusting b|their ${dick} deep into a|reps ${hole}.`,

        ` Moaning in delight, b|rep roughly b|slam b|their ${dick} as deep as possible into a|reps ${hole}.`
      ]
    } else if (theirpace == setup.sexpace.mindbroken) {
      t = [
        setup.SexUtil.mindbrokenReactionNoun(them, sex, [
          `the ${hole} retreating`,
        ])
      ]
    } else {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|Rep ${h} decide to just enjoy the rare reward and b|thrust b|their ${dick} deep into a|reps ${hole}, letting out a muffled moan as b|they b|penetrate b|their ${hole}.`,

        ` A muffled moan bursts out from b|reps mouth, before b|they ${h} start thrusting b|their ${dick} deep into a|reps ${hole}.`,

        ` b|rep ${h} slide b|their ${dick} into a|reps ${hole}.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '
    story += phallusHoleSizeDifferenceOngoingSub(
      them,
      this.getPenetratorBodypart(),
      me,
      this.getPenetrationTarget(),
      sex
    )
    story += ' '
    story += this.getPenetratorBodypart().repPenetrateFlavorSentence(them, me, this.getPenetrationTarget(), sex)
    story += ' '

    return story
  }
}
