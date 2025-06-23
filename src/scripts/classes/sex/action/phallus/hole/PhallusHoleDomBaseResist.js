/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
tailVagina.TAIL_FUCKING_SUB_RESIST
.*/

import { PhallusHoleDomBase } from "./PhallusHoleDomBase"

export class PhallusHoleDomBaseResist extends PhallusHoleDomBase {
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

    const dick = this.getPenetratorBodypart().rep(me, sex)
    const tip = this.getPenetratorBodypart().repTip(me, sex)
    const fuck = this.getPenetratorBodypart().repFuck(me, sex)

    const hole = this.getPenetrationTarget().rep(them, sex)
    const labia = this.getPenetrationTarget().repLabia(them, sex)
    const vaginal = this.getPenetrationTarget().repVaginal(them, sex)

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

    let t
    if (theirpace == setup.sexpace.sub || theirpace == setup.sexpace.normal) {
      t = [
        `a|Rep a|try to pull a|their ${dick} out of b|reps ${hole}, but a|their efforts prove to be in vain as b|rep quickly b|reach back and b|take a firm hold of it, before b|eagerly forcing it back into b|their ${hole}.`,

        `With a|a_sob, a|rep a|try to pull a|their ${dick} away from b|rep, but b|they quickly b|grab it, before b|eagerly forcing it back inside b|their ${hole}.`,

        `Tears start to well up in a|reps a|eyes, and with a|a_sob, a|they a|try to pull a|their ${dick} away from b|reps ${hole}, but b|rep quickly b|shift position, ignoring a|their protests as b|they b|eagerly b|force b|their ${hole} down onto a|their ${dick}.`
      ]
    } else {
      t = [
        `a|Rep a|try to pull a|their ${dick} out of b|reps ${hole}, but a|their efforts prove to be in vain as b|rep quickly b|reach back and b|take a rough hold of it, before aggressively forcing it back into b|their ${hole}.`,

        `With a|a_sob, a|rep a|try to pull a|their ${dick} away from b|rep, but b|they quickly b|grab it, before roughly forcing it back inside b|their ${hole}.`,

        `Tears start to well up in a|reps a|eyes, and with a|a_sob, a|they a|try to pull a|their ${dick} away from b|reps ${hole}, but b|rep quickly b|shift position, ignoring a|their protests as b|they roughly b|force b|their ${hole} down onto a|their ${dick}.`
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    return story
  }

}
