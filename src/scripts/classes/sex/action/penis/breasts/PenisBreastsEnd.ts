// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA : PenisBreasts.FUCKING_STOP */

import { PenisHoleEnd } from "../hole/PenisHoleEnd"

setup.SexActionClass.PenisBreastsEnd = class PenisBreastsEnd extends PenisHoleEnd {
  getTags() { return super.getTags().concat(['normal',]) }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_penetration_penisbreasts'),
      setup.qres.SexCanTitfuck('a', 'b'),
    ])
  }

  /**
   * @returns {setup.SexBodypart}
   */
  getPenetrationTarget() {
    return setup.sexbodypart.breasts
  }

  rawTitle(sex) {
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')
    const titfuck = setup.sexbodypart.breasts.repTitfuck(me, them)
    return `Stop receiving ${titfuck}`
  }

  rawDescription(sex) {
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')
    const titfuck = setup.sexbodypart.breasts.repTitfuck(me, them)
    return `Slide your a|dick out of b|reps b|cleavage and stop receiving a ${titfuck} from b|them.`
  }

  rawStory(sex) {
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')
    const mypace = sex.getPace(me)
    const mypose = sex.getPose(me)
    const myposition = sex.getPosition(me)
    const theirpace = sex.getPace(them)
    const theirpose = sex.getPose(them)
    const theirposition = sex.getPosition(them)

    let story = ''

    let t

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

    const titfuck = setup.sexbodypart.breasts.getTitfuck(me, them)
    let push = setup.sexbodypart.breasts.repPush(me, them)

    if (mypace == setup.sexpace.dom) {
      t = [
        `Roughly pushing b|rep away, a|rep a|pull a|their a|dick out from
        b|their b|cleavage and a|tell b|them that b|they had enough of
        fucking b|their b|breasts.`,
        `Roughly pulling a|their a|dick out from b|reps b|cleavage, a|rep
        a|tell b|them that b|they had enough of fucking b|their
        b|breasts.`,
      ]
    } else {
      t = [
        `a|Rep a|pull a|their a|dick out from b|reps b|cleavage and a|tell
        b|rep that b|they had enough of fucking b|their b|breasts.`,
        `Pulling a|their a|dick out from b|reps b|cleavage, a|rep a|tell
        b|rep that b|they had enough of fucking b|their b|breasts.`,
      ]
    }

    story += setup.rng.choice(t)
    story += ' '

    story += setup.SexUtil.afterPenetrationReactionSub(me, them, [
      `a|rep a|slide away of b|reps b|cleavage`,
      `a|reps a|dick retreated from b|reps b|cleavage`,
      `the ${titfuck} seemingly ends`,
      `a|rep a|pull a|their a|dick away from b|reps b|cleavage`,
      `b|they b|pull b|their b|breasts away from a|rep`,
    ], [
      `continue using b|them`,
      `continue the ${titfuck}ing action`,
      `continue having a|their a|dick trapped between b|their b|breasts`,
      `continue the feeling of squeezing a|their a|dick between b|their b|breasts`,
      `have a|them use b|their b|breasts more`,
    ], sex)

    return story
  }
}

