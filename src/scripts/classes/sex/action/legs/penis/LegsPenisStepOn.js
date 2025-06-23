/**
 * darko original
 */

import { LegsPenisFreeBaseDom } from "./LegsPenisFreeBase"

setup.SexActionClass.LegsPenisStepOn = class LegsPenisStepOn extends LegsPenisFreeBaseDom {
  getTags() { return super.getTags().concat(['dom', 'discomfort',]) }
  desc() { return 'Step-on-dick' }

  /**
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_step_on_dick'),
    ])
  }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
        paces: [setup.sexpace.dom, setup.sexpace.normal],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: -setup.Sex.AROUSAL_MEDIUM,
        discomfort: setup.Sex.DISCOMFORT_LARGE,
        paces: setup.SexPace.getAllPaces(),
      },
    ]
  }

  rawTitle(sex) {
    return `Step on dick`
  }

  rawDescription(sex) {
    return `Step on b|reps useless dick.`
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

    const mypose = sex.getPose(me)
    const theirpose = sex.getPose(them)

    let story = ''

    let t
    t = [
      `With a cruel smirk, a|rep a|move a|their a|cfeet closer to b|reps exposed dick and a|eagerly a|crush it under a|their a|cfeet.`,
      `a|Rep a|shift a|their a|cfeet over so that they are hovering just above b|reps exposed dick before bringing them down and a|eagerly stepping on the member.`,
      `a|Rep a|press a|their a|cfeet on b|reps exposed dick, exerting more and more pressure on the defenseless dick.`,
    ]

    story += setup.rng.choice(t) + ' '

    if (them.isMasochistic()) {
      t = setup.SexUtil.masochistReaction(me, them, [
        `having b|their dick abused`,
        `being stepped on`,
        `having b|their dick tortured`,
      ], sex)
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        `b|Rep b|let out a pained grunt at having b|their dick abused, internally promising to return the favor later.`,
        `b|Rep b|let out a yelp at the sudden pain on b|their dick.`,
      ]
    } else if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      t = [
        `b|Rep b|let out a pained moan from having b|their dick abused, and the sudden pain ruined a part of b|their arousal.`,
        `b|Rep b|let out a yelp at the sudden pain on b|their dick, reducing b|their arousal.`,
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = setup.SexUtil.repResist(me, them, sex,
        [
          `push a|reps a|feet away`,
          `lessen the pain`,
          `withdraw b|their dick away`,
        ],
        [
          `a|rep a|continue to press on b|their worthless dick`,
          `a|rep a|grin, having received exactly the reaction a|they a|was hoping for`,
        ])
    } else if (theirpace == setup.sexpace.forced) {
      t = [
        `A helpless cry of pain came out of b|reps mouth -- the pleading for mercy apparent in b|their eyes.`,
        `b|Rep b|let out a pained moan, but completely helpless to do anything but endure the pain.`,
      ]
    } else {
      t = setup.SexUtil.mindbrokenReactionNoun(them, sex, [
        `the cock abuse`,
        `the abuse`,
        `having b|their dick crushed`,
      ])
    }

    story += setup.rng.choice(t) + ' '

    return story
  }
}
