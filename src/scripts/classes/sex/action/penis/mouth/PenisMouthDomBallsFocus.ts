// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA: FORCE_BALLS_FOCUS */

import { PenisMouthDomBase } from "./PenisMouthBase"

setup.SexActionClass.PenisMouthDomBallsFocus = class PenisMouthDomBallsFocus extends PenisMouthDomBase {
  getTags() { return super.getTags().concat(['normal', ]) }
  desc() { return 'Focus balls' }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_balls'),
    ])
  }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
        paces: [setup.sexpace.dom, setup.sexpace.normal], 
        restrictions: [
          setup.qres.Trait('balls_tiny'),
        ],
      },
      {
        energy: setup.Sex.ENERGY_MEDIUMLARGE,
        arousal: setup.Sex.AROUSAL_TINY,
        discomfort: setup.Sex.DISCOMFORT_MEDIUM,
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
    return 'Focus balls'
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return "Force b|rep to give a|their a|balls some needed attention."
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
    story += setup.rng.choice([
      "Drawing a|their hips back, a|rep a|allow a|their a|dick to slide out of b|reps mouth,",
      "a|Eagerly sliding a|their a|dick out of b|reps mouth,",
      "a|Rep a|slide a|their a|dick out of b|reps mouth,",
      "Quickly sliding a|their a|dick out of b|reps mouth,",
      "a|Eagerly withdrawing a|their a|dick from within b|reps mouth,",
    ])
    story += ' '

    let mid
    if (mypace == setup.sexpace.dom) {
      mid = [
        " before shuffling about until a|their a|balls are roughly grinding against b|their lips.",
        " a|rep a|reposition a|themself so that a|their a|balls are roughly grinding against b|their lips.",
        " before repositioning a|themself so that b|their lips are roughly grinding against a|their a|balls.",
        " a|rep a|reposition a|themself until a|they a|is roughly forcing a|their a|balls against b|reps lips.", 
        " a|rep a|slap b|reps b|face with a|their a|balls and a|keep them positioned right next to b|their lips.`",
      ]
    } else {
      mid = [
        " before shuffling about until a|their a|balls are pressing down against b|their lips.",
        " a|rep a|reposition a|themself so that a|their a|balls are pressing against b|their lips.",
        " before repositioning a|themself so that b|their lips are pressed against a|their a|balls.",
        " a|rep a|reposition a|themself until a|they a|is forcing a|their a|balls against b|reps lips.",
      ]
    }

    story += setup.rng.choice(mid)

    story += setup.SexUtil.traitSelectArray(me, {
      balls_titanic: [
        `The titanic pair of balls fully cover b|reps entire b|face, and almost blocked b|them from breathing.`,
        `The gigantic pair of balls entirely cover b|reps b|face.`,
        `b|Reps face is squished under the gigantic pair of balls.`,
      ],
      balls_huge: [
        `The huge pair of balls rest on b|reps cheeks, one ball on each cheek.`,
        `The huge pair of balls obscures b|reps entire b|face.`,
        `The huge pair of balls weighes down heavily on b|reps b|face.`,
      ],
      default: [
        ``
      ],
    })

    let fin
    if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      fin = [
        " b|Eagerly darting b|their tongue out, b|rep b|eagerly b|start to lick and kiss a|reps a|balls, causing a|a_moan to drift out from between a|their lips.",
        " b|Rep b|eagerly b|start to kiss and lick a|reps a|balls, drawing a|a_moan from out of a|their mouth.",
        " b|Rep b|eagerly a|stick b|their tongue out, slathering the a|balls in front of b|them with attention from b|their tongue.",
      ]
    } else if (theirpace == setup.sexpace.dom) {
      fin = [
        " Sliding b|their tongue out, b|rep b|start to roughly lick and kiss a|reps a|balls, causing a|a_moan to drift out from between a|their lips.",
        " b|Rep roughly b|start kissing and licking a|reps a|balls, drawing a|a_moan from out of a|their mouth.",
        " With a protesting growl, b|rep b|give the a|balls a tentative lick before softly chomping on it, drawing a pained moan from a|rep.",
      ]
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      fin = [
        ` b|They ${h} stick b|their tongue out and b|start to lick and kiss a|reps a|balls, causing a|a_moan to drift out from between a|their lips.`,
        ` Fearing punishment, b|rep b|start to kiss and lick a|reps a|balls, drawing a|a_moan from out of a|their mouth.`,
        ` Seeing no other way out, b|rep ${h} stick b|their tongue out and lick the a|balls.`,
      ]
    } else if (theirpace == setup.sexpace.resist) {
      fin = [
        setup.SexUtil.repResist(
          them,
          me,
          sex,
          [
            `try to pull away`,
            `push the balls away from b|their face`,
            `avoid smelling the balls`,
            `pull away from a|reps a|balls`,
          ],
          [
            `a|they a|continue grinding a|their balls against b|their b|lips`,
            `a|they a|carry on pressing a|their balls against b|their face`,
            `a|they a|continue pressiing down a|their balls against b|their face`,
          ])
      ]
    } else if (theirpace == setup.sexpace.mindbroken) {
      fin = [
        setup.SexUtil.mindbrokenReactionNoun(
          them, sex, [
            `the a|balls hanging before b|their b|eyes`,
            `the dangling a|balls in front of b|their face`,
            `the a|balls pressing against b|their face`,
          ]
        )
      ]
    }

    story += setup.rng.choice(fin)

    story += setup.rng.choice([
      ` Once finished, a|rep a|push a|their a|dick back into b|reps b|mouth.`,
      ` After a while, a|rep a|resume thrusting a|their a|dick back into b|reps b|mouth.`,
      ` Satisfied, a|rep a|slide a|their a|dick back into b|reps b|mouth.`,
      ` After getting a|their a|balls worshipped, a|rep a|resume thrusting a|their a|dick down b|reps b|mouth.`,
    ])

    return story
  }
}
