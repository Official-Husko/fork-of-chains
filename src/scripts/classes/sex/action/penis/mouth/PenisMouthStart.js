/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA : BLOWJOB_START */

import { PenisHoleStart } from "../hole/PenisHoleStart"

setup.SexActionClass.PenisMouthStart = class PenisMouthStart extends PenisHoleStart {
  getTags() { return super.getTags().concat(['dom', ]) }
  desc() { return 'Begin receiving blowjob' }

  /**
   * @returns {setup.SexBodypart}
   */
  getPenetrationTarget() {
    return setup.sexbodypart.mouth
  }

  rawTitle(sex) {
    return `Begin receiving blowjob`
  }

  rawDescription(sex) {
    return `Slide your a|dick into b|reps mouth and get b|them to give you a blowjob.`
  }

  rawStory(sex) {
    const me = this.getActorUnit('a')
    const mypace = sex.getPace(me)
    const mypose = sex.getPose(me)
    const myposition = sex.getPosition(me)
    const them = this.getActorUnit('b')
    const theirpace = sex.getPace(them)

    let story = ''

    let t
    if (mypose.getFacingHeight(setup.sexbodypart.penis, myposition, sex).facing.isUpDown()) {
      // facing up or down
      if (mypace == setup.sexpace.dom) {
        t = [
          `Shuffling back a little, a|rep roughly a|grind a|their a|dick down against b|reps mouth, before forcefully pushing the cock head past b|their lips and collapsing down onto b|their b|face.`,

          `Roughly grinding a|their a|dick down against b|reps mouth, a|rep a|allow a|their a|legs to give out from under a|them as a|they forces the cock head past b|their lips.`,

          `a|Rep a|push a|their a|dick down b|reps throat, tentatively measuring how far a|they can give
           b|them a good hard throat fuck.`,
        ]
      } else {
        t = [
          `Shuffling back a little, a|rep a|eagerly a|lower a|their a|dick down to b|reps mouth,
           before a|eagerly pushing the cock head past b|their lips and collapsing down onto b|their b|face.`,

          `a|Eagerly lowering a|their a|dick down to b|reps mouth, a|rep a|eagerly a|allow a|their a|legs to give out from under a|them as a|they forces the cock head past b|their lips.`
        ]
      }
    } else {
      // facing forward
      if (mypace == setup.sexpace.dom) {
        t = [
          `Reaching down to grab b|reps head, a|rep a|line the cock head of a|their a|dick up to b|their lips, before roughly slamming a|their hips forwards and forcing a|their a|dick into b|their mouth.`,

          `Reaching down to take hold of b|reps head, a|rep a|push the cock head of a|their a|dick against b|reps lips, before roughly slamming a|their hips into b|their b|face and forcing a|their a|dick into b|their mouth.`
        ]
      } else {
        t = [
          `Reaching down to grab b|reps head, a|rep a|line the cock head of a|their a|dick up to b|their lips, before a|eagerly pushing a|their hips forwards and sliding a|their a|dick into b|their mouth.`,

          `Reaching down to take hold of b|reps head, a|rep a|push the cock head of a|their a|dick against b|reps lips, before a|eagerly bucking a|their hips into b|their b|face and a|eagerly sliding a|their a|dick into b|their mouth.`
        ]
      }
    }

    story += setup.rng.choice(t)

    if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep b|let out a muffled moan, b|eagerly sliding b|their head forwards as b|they b|start b|eagerly sucking a|reps a|dick.`,

        ` With a soft, muffled moan, b|rep b|start b|eagerly sliding b|their head forwards, wrapping b|their lips around a|reps a|dick as b|they b|start giving a|them a blowjob.`,

        ` Getting in position, b|rep b|eagerly takes a|rep into b|their b|mouth and start giving b|their partner a loving blowjob.`,
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep b|let out b|a_moan, roughly slamming b|their head forwards as b|they b|start forcing a|reps a|dick deep down b|their throat.`,

        ` With an eager, and very muffled moan, b|rep forcefully b|push b|their head forwards, wrapping b|their lips around a|reps a|dick as b|they b|start giving a|them a rough blowjob.`
      ]
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|Rep b|let out b|a_moan and ${h} slide b|their head a little forwards as b|they
      b|struggle to suck on a|reps a|dick.`,
        ` With a muffled moan, b|rep uncomfortably b|start sliding b|their head a little forwards,
      wrapping b|their lips around a|reps a|dick as b|they b|start giving a|them a blowjob trying b|their best not to think too much about it.`
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        ` b|Rep b|let out a muffled sob, gargling and choking on a|reps a|dick as b|they frantically b|try to pull b|their head away from a|their groin.`,
        ` With a muffled sob, b|rep frantically b|try to pull away from a|reps a|dick, gargling and choking as b|they b|squirm and b|struggle against a|them.`
      ]
    } else if (theirpace == setup.sexpace.mindbroken) {
      t = [
        setup.SexUtil.mindbrokenReactionNoun(them, sex, [
          `the intruder shoved down b|their b|mouth`,
          `the member shoved down b|their b|mouth`,
        ])
      ]
    }

    story += ' '
    story += setup.rng.choice(t)

    return story
  }
}
