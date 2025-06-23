/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA : PenisBreasts.FUCKING_START */

import { PenisHoleStart } from "../hole/PenisHoleStart"

setup.SexActionClass.PenisBreastsStart = class PenisBreastsStart extends PenisHoleStart {
  getTags() { return super.getTags().concat(['dom',]) }
  desc() { return 'Begin titfuck / pecjob' }

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
    return `Begin ${titfuck}`
  }

  rawDescription(sex) {
    return `Slide your a|dick between b|reps b|breasts and start fucking them.`
  }

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

    const titfuck = setup.sexbodypart.breasts.getTitfuck(me, them)
    let push = setup.sexbodypart.breasts.repPush(me, them)

    let t
    if (mypace == setup.sexpace.dom) {
      t = [
        `Reaching to roughly sink a|their fingers into b|reps b|breasts,
         a|rep forcefully a|${push} them together, lining a|their a|dick up to
         b|their b|cleavage before slamming forwards and starting to rapidly
         fuck b|their b|breasts.`,
        `Reaching to take hold of b|reps b|breasts, a|rep roughly a|${push}
         them together, lining a|their a|dick up to b|their b|cleavage before
         forcefully sliding forwards and starting to fuck b|their b|breasts mercilessly.`,
        `a|Rep a|line a|their a|dick up to b|reps b|cleavage before roughly squeezing
         b|reps b|breasts and forcing a|their a|dick forwards, enjoying the feeling of
         it sliding between the b|breasts.`,
      ]
    } else {
      t = [
        `Reaching to take hold of b|reps b|breasts, a|rep a|eagerly a|${push}
         them together, lining a|their a|dick up to b|their b|cleavage before
         sliding forwards and starting to fuck b|their b|breasts.`,
        `Reaching to a|eagerly sink a|their fingers into b|reps
         b|breasts, a|rep eagerly a|${push} them together, lining a|their a|dick
         up to b|their b|cleavage before sliding forwards and starting to
         a|eagerly fuck b|their b|breasts.`,
        `a|Rep a|line a|their a|dick up to b|reps b|cleavage before squeezing
         b|reps b|breasts and then a|eagerly pushing a|their a|dick forwards,
         sliding deliciously between the b|breasts.`,
      ]
    }

    push = setup.sexbodypart.breasts.repPush(me, them)
    story += setup.rng.choice(t)

    if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep b|eagerly b|let out a moan in response, reaching to
          help ${push} b|their b|breasts together as b|they b|encourage a|them to
          keep going.`,
        ` b|Rep b|let out b|a_moan in response, a|eagerly reaching to help
          ${push} b|their b|breasts together as b|they happily b|encourage a|them
          to keep going.`,
        ` In response, b|rep b|eagerly b|push b|their chest forwards and b|${push} b|their b|breasts
          even tighter together, squeezing the cock trapped within.`,
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep b|let out b|a_moan in response, reaching to forcefully
          press b|their b|breasts together as b|they dominantly b|order a|them
          to keep going.`,
        ` b|Rep b|eagerly b|push b|their chest forwards, before forcefully squeezing b|their b|breasts
          even tighter together, squeezing the cock trapped within.`,
        ` In response, b|rep b|${push} b|their b|breasts even tigheter, showing a|rep that b|they
          will be in control of the ensuing sex.`,
      ]
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|Rep ${h} squeeze b|their b|breasts together to stimulate the cock of b|their owner trapped within.`,
        ` b|Rep ${h} stimulate the cock trapped in b|their b|cleavage by pressing b|their b|breasts together.`,
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        ` b|Rep b|let out an involuntary moan in response, before reaching to weakly try and
          push a|them away from b|their b|breasts as b|they b|beg for a|them to
          stop.`,
        ` With b|a_sob, b|rep b|try, in vain, to pull the dick away from b|their b|cleavage,
          tears running down b|their b|face as a|reps unwelcome
          a|dick grinds against the b|cleavage.`,
      ]
    } else if (theirpace == setup.sexpace.mindbroken) {
      t = [
        setup.SexUtil.mindbrokenReactionNoun(them, sex, [
          `the a|dick grinding down b|their b|breasts`,
          `the a|dick sliding along b|their b|cleavage`,
        ])
      ]
    }

    story += ' '
    story += setup.rng.choice(t)

    return story
  }
}
