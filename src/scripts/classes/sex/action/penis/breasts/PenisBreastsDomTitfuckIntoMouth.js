/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
PenisBreasts.FORCE_COCK_INTO_MOUTH
*/

import { PenisBreastsDomBase } from "./PenisBreastsBase"

setup.SexActionClass.PenisBreastsDomBallsFocus = class PenisBreastsDomBallsFocus extends PenisBreastsDomBase {
  getTags() { return super.getTags().concat(['dom', 'mouth',]) }
  desc() { return 'Receive titfuck / pecjob into mouth' }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_titfuck_mouth'),
      setup.qres.SexCanTitfuckIntoMouth('a', 'b'),
    ])
  }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
        paces: [setup.sexpace.dom, setup.sexpace.normal],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_TINY,
        discomfort: setup.Sex.DISCOMFORT_SMALLMEDIUM,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [
          setup.qres.SexCanUseBodypart(setup.sexbodypart.mouth),
        ],
      },
    ]
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return 'Thrust into b|reps b|mouth'
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Thrust your hips forwards and force the cock head of your a|dick into b|reps b|mouth.`
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

    const titfuck = setup.sexbodypart.breasts.getTitfuck(me, them)
    let push = setup.sexbodypart.breasts.repPush(me, them)

    let story = ''

    let t
    if (mypace == setup.sexpace.dom) {
      t = [
        `Roughly thrusting forwards between b|reps b|breasts, a|rep slams
        a|their a|dick up against b|their b|mouth and forces the cock head past
        b|their lips.`,

        `Violently slamming a|their hips forwards, a|rep a|thrust a|their
        a|dick between b|reps b|breasts, pushing all the way until the cock
        head rams past b|their lips.`,
      ]
    } else {
      t = [
        `a|Eagerly thrusting forwards between b|reps b|breasts, a|rep a|push
        a|their a|dick all the way up to b|their b|mouth and forces the cock
        head past b|their lips.`,

        `a|Eagerly pushing a|their hips forwards, a|rep forces a|their a|dick
        between b|reps b|breasts, pushing all the way until the cock head
        pushes past b|their lips.`
      ]
    }

    story += setup.rng.choice(t) + ' '

    if (them.getMainTraining().getTags().includes('troral')) {
      if (me.isHasTrait('dick_titanic')) {
        t = [
          `Despite the size of the cockhead, b|reps complete fixation on oral means that the b|race b|do not care, and happily gobble down the massive cockhead.`,
          `b|Rep b|is so completely fixated on oral, and not even the massive cockhead in front of b|them can diminish b|their enthusiasm.`,
        ]
      } else {
        t = [
          `The cumslut relishes b|their favorite activity of gobbling down cock.`,
          `The obedient oral slut b|love being offered a suprise cock in the middle of the ${titfuck}.`
        ]
      }
    } else {
      if (me.isHasTrait('dick_titanic')) {
        t = [
          `Despite only the cockhead, it is large enough that b|rep b|have some trouble fitting it inside b|their b|mouth.`,
          `The dick is so massive that even the cockhead is difficult to fit inside b|reps b|mouth.`,
        ]
      } else {
        t = [
          `The cockhead slides easily into b|reps b|mouth.`,
          `The cockhead of the b|dick is easily gobbled by b|rep.`,
        ]
      }
    }

    if (t.length) {
      story += setup.rng.choice(t) + ' '
    }

    if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep b|grin at a|their enthusiasm, before b|eagerly opening b|their b|mouth to
        give the cock head of a|their a|dick a loving suck. After a while, b|rep b|draw
        back, but not before planting a kiss on its very tip.`,
        ` b|Rep b|eagerly b|open b|their b|mouth to accept a|their a|dick,
        giving the cock head a hot, wet suck before drawing back to deliver a
        soft kiss to the very tip.`,
        ` b|Rep b|eagerly b|open b|their b|mouth to gobble the cockhead, while
        squeezing b|their b|breasts together to stimulate the a|dick from multiple angles
        at the same time.`,
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep b|let out b|a_moan, before opening b|their b|mouth to
        give the cock head of a|their a|dick a quick, forceful suck. b|Rep then
        b|draw back, but not before a|adv biting on its very tip.`,

        ` b|Rep quickly b|open b|their b|mouth to gobble a|their a|dick,
        giving the cock head a forceful suck before drawing back and a|adv
        biting it on its the very tip.`,

        ` b|Rep b|eagerly b|open b|their b|mouth to forcefully suck on the cockhead, while
        powerfully squeezing b|their b|breasts together to crush the a|dick from multiple angles
        at the same time.`,
      ]
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|Rep ${h} open b|their b|mouth and lifelessly suck on the dickhead.`,
        ` b|Rep ${h} gobble the cockhead without thinking too much about it.`,
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        setup.SexUtil.repResist(
          them,
          me,
          sex,
          [
            `try to pull b|their b|mouth away from the cockhead of a|their a|dick`,
            `try to push a|their a|dick away from b|their b|mouth`,
            `jerk b|their b|head back to avoid the cock head like a plague`,
          ],
          [
            `a|they a|force a|their cockhead past b|their lips`,
            `a|they a|continue thrusting a|their a|dick past b|their b|cleavage and into b|their lips`,
            `a|they a|carry on thrusting a|their a|dick past b|their defenseless lips`,
          ])
      ]
    } else if (theirpace == setup.sexpace.mindbroken) {
      t = [
        setup.SexUtil.mindbrokenReactionNoun(
          them, sex, [
          `the cockhead in front of b|them`,
          `the a|dick that forced itself all the way past b|their b|cleavage`,
          `the smell of a cockhead in front of b|them`,
        ]
        )
      ]
    }

    story += setup.rng.choice(t) + ' '

    return story
  }
}
