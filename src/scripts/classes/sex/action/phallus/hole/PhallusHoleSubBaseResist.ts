// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
tailVagina.RIDING_TAIL_SUB_RESIST
.*/

import { PhallusHoleSubBase } from "./PhallusHoleSubBase"

export class PhallusHoleSubBaseResist extends PhallusHoleSubBase {
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
    let odir = 'for'
    if (myfacingheight.facing.isDown()) {
      dir = 'down'
      odir = 'up'
    } else if (myfacingheight.facing.isUp()) {
      dir = 'up'
      odir = 'down'
    }

    let t
    if (theirpace == setup.sexpace.sub || theirpace == setup.sexpace.normal) {
      t = [
        `a|Rep a|feel tears a|start to well up in a|their a|eyes, and, not being able to hold back any longer, a|they suddenly a|let out a|a_sob, before weakly trying to pull b|reps ${dick} out of a|their ${hole}.`,
        `a|A_sob bursts out from a|reps mouth as a|they frantically a|try to pull a|their ${hole} away from b|reps unwanted penetration, struggling in desperation as b|their ${dick} b|continue b|eagerly pumping in and out of a|their ${hole}.`,
        `Trying desperately to pull a|their hips away, a|rep a|let out a distressed a|sob as b|reps ${dick} b|continue b|eagerly thrusting deep into a|their ${hole}.`
      ]
    } else {
      t = [
        `a|Rep a|feel tears a|start to well up in a|their a|eyes, and, not being able to hold back any longer, a|they suddenly a|let out a|a_sob, before weakly trying to pull b|reps ${dick} out of a|their ${hole}.`,
        `a|A_sob bursts out from a|reps mouth as a|they frantically a|try to pull a|their ${hole} away from b|reps unwanted penetration, struggling in desperation as b|their ${dick} b|continue roughly slamming in and out of a|their ${hole}.`,
        `Trying desperately to pull a|their hips away, a|rep a|let out a distressed a|sob as b|reps ${dick} b|continue violently thrusting deep into a|their ${hole}.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    return story
  }

}
