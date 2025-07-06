// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA : PenisBreast.USING_COCK_START */

import { PenisHoleStartOther } from "../hole/PenisHoleStartOther"

setup.SexActionClass.PenisBreastsStartOther = class PenisBreastsStartOther extends PenisHoleStartOther {
  getTags() { return super.getTags().concat(['sub',]) }
  desc() { return 'Begin performing titfuck / pecjob' }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_penetration_penisbreasts'),
      setup.qres.SexCanTitfuck('b', 'a'),
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
    return `Perform ${setup.sexbodypart.breasts.repTitfuck(them, me)}`
  }

  rawDescription(sex) {
    return `Use b|reps b|dick to fuck a|reps a|breasts.`
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

    let story = ''

    let t

    const titfuck = setup.sexbodypart.breasts.repTitfuck(them, me)
    let push = setup.sexbodypart.breasts.repPush(them, me)

    if (mypace == setup.sexpace.normal || mypace == setup.sexpace.sub) {
      t = [
        `Taking hold of b|reps b|dick, a|rep a|eagerly a|guide it up to a|their
         a|cleavage, and, sliding forwards, a|they a|${push} a|their a|breasts
         together and a|start giving b|them a ${titfuck}.`,
        `a|Rep a|position a|their a|breasts next to b|reps b|dick, before letting the dick
         slide along a|their a|cleavage and then squeezing a|their a|breasts together.`,
        `a|Rep a|eagerly a|guide b|reps b|dick towards a|their a|cleavage, before sliding it along
         the ridge trapping it securely between a|their a|breasts for a ${titfuck}.`,
      ]
    } else {
      t = [
        `Grabbing hold of b|reps b|dick, a|rep a|eagerly a|pull it to
         a|their a|cleavage, and, sliding forwards, a|they a|${push} a|their
         a|breasts together and a|start giving b|them a forceful ${titfuck}.`,
        `a|Rep a|position a|their a|breasts next to b|reps b|dick, before forcing the dick
         to slide along a|their a|cleavage and then roughly squeezing a|their a|breasts together, crushing the dick inside.`,
        `a|Rep a|eagerly a|yank b|reps b|dick into a|their a|cleavage, before sliding it along
         the ridge and trapping it securely between a|their a|breasts for a rough ${titfuck}.`,
      ]
    }

    story += setup.rng.choice(t)
    push = setup.sexbodypart.breasts.repPush(them, me)

    if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep b|eagerly b|let out a little moan in response, before helping to ${push}
          a|reps a|breasts together as b|they b|encourage a|them to keep going.`,
        ` b|Rep b|let out a moan at the stimulation, shuddering in delight as b|they b|feel
          b|their b|dick being squeezed tight and stimulated.`,
        ` b|Rep b|let out an approving moan, before b|eagerly helping ${push} a|reps a|breasts together
          tighter and encourage a|them to continue.`,
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep b|let out an approving moan in response, before roughly squeezing a|reps
          a|breasts together as b|they b|demand that a|they keep on going.`,
        ` b|Rep b|let out a dominant grunt as b|they b|feel b|their b|dick being stimulated
          between the a|breasts.`,
        ` b|Rep b|let out an approving moan at the dick stimulation, before ordering a|rep
          to not let up the pleasant stimulation.`,
      ]
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|Rep ${h} just enjoy the rare stimulation lavished on b|their member.`,
        ` b|Rep ${h} give as much pleasure back to b|their better.`,
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        ` b|Rep b|let out b|a_moan, weakly trying to push a|rep away as b|they b|beg for a|them to stop.`,
        ` b|Rep weakly b|try to pull b|their b|dick away, but a|reps grip on the member is too strong, and the dick remains trapped between the a|breasts.`,
      ]
    } else if (theirpace == setup.sexpace.mindbroken) {
      t = [
        setup.SexUtil.mindbrokenReactionNoun(them, sex, [
          `the stimulation on b|their b|dick`,
          `the a|breasts squeezing b|their b|dick`,
          `the pleasant sensation of ${titfuck}`,
        ])
      ]
    }

    story += ' '
    story += setup.rng.choice(t)
    return story
  }
}

