/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
FingerPenis.PARTNER_FONDLE_BALLS 
*/

import { ArmsPenisFreeBaseDom } from "./ArmsPenisFreeBase"

setup.SexActionClass.ArmsPenisFreeDomGropeBalls = class ArmsPenisFreeDomGropeBalls extends ArmsPenisFreeBaseDom {
  getTags() { return super.getTags().concat(['normal']) }
  desc() { return 'Fondle balls' }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        discomfort: setup.Sex.DISCOMFORT_SMALLMEDIUM,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [
          setup.qres.Trait('balls_tiny'),
        ],
      },
    ]
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_grope'),
    ])
  }

  rawTitle(sex) {
    return `Fondle balls`;
  }

  rawDescription(sex) {
    return `Fondle and play with b|reps b|balls.`
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
    if (mypace == setup.sexpace.dom) {
      t = [
        `a|Rep a|reach between b|reps b|legs with one a|hand, before violently yanking b|reps b|balls,
        drawing a pained moan from b|them.`,

        `b|Rep b|find b|themself letting out b|a_moan of both pleasure and pain as a|rep a|reach across with one a|hand and squeeze b|their b|balls hard.`,

        `Running a|their fingers over b|reps b|balls, a|rep a|start to stroke and cup them,
         before violently slapping them as b|reps b|dick twitches and starting to leak pre in response.`,

        `Guiding a|their a|hands over b|reps b|balls, a|rep suddenly a|yank hard the base of the a|balls and squeezing
         it down, eliciting a pained moan from b|rep.`,
      ]

      if (!them.isHasTrait('balls_huge')) {
        t = t.concat([
          `Putting b|their b|balls inside the palms of a|their a|hands, a|rep shuffle the balls around before
           crushing them inside a|their a|hands, drawing a pained moan from b|them.`,
        ])
      } else {
        t = t.concat([
          `a|Rep a|feel the skin off b|reps huge balls, before punching the oversized ballsack hard, drawing
           a pained moan from b|them.`,
        ])
      }
    } else {
      t = [
        `a|Rep a|reach between b|reps b|legs with one a|hand and a|start to a|eagerly stroke and
         squeeze b|their b|balls, secretly hoping to get filled by its produce.`,

        `b|Rep b|find b|themself letting out b|a_moan as a|rep a|reach across with one a|hand a|eagerly stroke and service b|their b|balls.`,
 
        `Running a|their fingers over b|reps b|balls, a|rep a|start to a|eagerly stroke and cup them,
         letting out a|a_moan from both as b|reps b|dick twitches in response while leaking a generous amount of pre.`,
      ]

      if (!them.isHasTrait('balls_huge')) {
        t = t.concat([
          `Putting a|their a|balls inside the palms of a|their a|hands, a|rep shuffle the balls around before
           a|eagerly massage the balls inside a|their a|hands.`,
        ])
      } else {
        t = t.concat([
          `a|Rep a|feel the skin off b|reps huge balls, before
           a|eagerly massage the oversized ballsack from the outside.`,
        ])
      }
    }

    story += setup.rng.choice(t) + ' '

    if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep b|let out an approving moan at a|reps handling of b|their b|balls,
          while b|eagerly encouraging a|them to continue.`,

        ` b|Rep b|let out a series of moans as b|they can b|feel the cum shaking inside b|their b|balls.`,

        ` b|Eagerly moaning at a|reps touch, b|rep b|eagerly b|encourage a|them to carry on playing with b|their b|balls.`,

        ` b|Rep b|let out a moan at the feeling of having b|their b|balls being used as a toy.`,
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep b|let out a moan at a|reps handling of b|their b|balls,
          while talking dirty to a|rep and promise to given a|them an imminent penetration.`,

        ` b|Rep b|growl at a|rep, making sure that a|they know b|they b|is still in control and this is just a priviledge.`,

        ` Moaning at a|reps ministrations on b|their balls, b|rep b|order a|rep to service b|their b|balls better.`,

        ` b|Rep b|let out a frustrated growl at having b|their b|balls toyed by a|them, no doubt planning a way to get even with a|them.`,
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        setup.SexUtil.repResist(
          them,
          me,
          sex,
          [
            `shield b|their b|balls away`,
            `knock a|their a|hands away from b|their b|balls`,
            `struggle against a|them`,
            `withdraw b|their b|balls from a|their a|hands`,
          ],
          [
            `a|they a|continue a|eagerly playing with b|reps b|balls`,
            `a|they a|carry on playing with b|reps b|balls`,
            `a|they a|continue fondling b|reps b|balls`,
            `a|they a|continue a|eagerly using b|reps b|balls as nothing but toys`,
          ])
      ]
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|Rep b|try to remain as still as possible during the unwanted molestation upon their b|balls.`,

        ` b|Rep b|let out a series of uncontrolled moans as b|they can b|feel the cum shaking inside b|their b|balls.`,

        ` Moaning at a|reps touch, b|rep b|remain quiet as b|rep b|carry on playing with b|their b|balls to a|their heart's content.`,
      ]
    } else {
      t = [
        setup.SexUtil.mindbrokenReactionNoun(them, sex, [
          `the abuse on b|their b|balls`,
          `the use of b|their b|balls`,
          `a|reps handling of b|their balls`,
          `the stimulation from b|their b|balls`,
        ])
      ]
    }

    story += setup.rng.choice(t) + ' '

    return story
  }
}
