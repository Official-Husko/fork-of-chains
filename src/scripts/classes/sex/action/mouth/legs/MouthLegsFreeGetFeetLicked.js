/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
The entirety of FootMouth.java
*/

import { MouthLegsFreeBaseSub } from "./MouthLegsFreeBase"

setup.SexActionClass.MouthLegsFreeGetFeetLicked = class MouthLegsFreeGetFeetLicked extends MouthLegsFreeBaseSub {
  getTags() { return super.getTags().concat(['dom']) }
  desc() { return 'Get feet licked' }

  /**
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_lick_feet'),
    ])
  }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALL,
        arousal: setup.Sex.AROUSAL_SMALL,
        paces: [setup.sexpace.dom],
      },
      {
        energy: setup.Sex.ENERGY_SMALLMEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        discomfort: setup.Sex.DISCOMFORT_SMALL,
        // not applicable to doms
        paces: [setup.sexpace.sub, setup.sexpace.normal, setup.sexpace.resist, setup.sexpace.forced, setup.sexpace.mindbroken]
      },
    ]
  }

  rawTitle(sex) {
    return `Get your dirty feet licked`
  }

  rawDescription(sex) {
    return `Force b|rep to clean your dirty a|cfeet with b|their tongue.`
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

    t = [
      `With a dominant smirk, a|rep a|eagerly a|push b|reps head into a|their dirty a|cfeet, forcing b|them to kiss and worship them.`,
      `Pushing b|reps head into a|their a|cfeet, a|rep a|eagerly a|command b|rep to start giving them the attention they deserve or else.`,
      `a|Rep a|eagerly a|press b|reps b|face against a|their a|cfeet, making sure b|rep b|understand b|their standing compared to a|their a|cfeet before commanding b|them to get started worshipping the a|cfeet.`,
      `With a menacing growl, a|rep a|push a|their a|cfeet against b|reps lips and b|mouth, giving b|them no option but to lick and worshipping them.`,
      `a|Rep roughly a|press a|their a|cfeet on b|reps b|mouth, giving b|them a taste of the dirty a|cfeet.`,
    ]

    story += setup.rng.choice(t) + ' '

    const rearwag = setup.Text.Pet.rearwag(them)

    if (theirpace == setup.sexpace.sub || theirpace == setup.sexpace.normal || theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep b|let out b|a_moan as b|they b|eagerly b|plant a series of kisses and licks on a|reps a|cfeet.`,
        ` With b|a_moan, b|rep b|eagerly b|start kissing and licking a|reps a|cfeet.`,
        ` b|Rep b|eagerly b|lick and b|suck on a|reps toes, letting out b|a_moan as b|they b|eagerly b|worship a|their a|cfeet.`,
        ` b|A_moan bursts out from b|reps mouth as b|they b|continue b|eagerly licking and kissing a|reps a|cfeet.`,
        ` Moaning in delight, b|rep b|eagerly b|worship a|reps a|cfeet by planting a series of submissive kisses on them.`,
      ]

      if (them.isHasTrait('training_pet_advanced')) {
        t = t.concat([
          `Being treated like a dog excites the properly trained slave, and b|rep eagerly b|suck on the b|cfeet presented to them while ${rearwag}.`,
          `Having completed b|their training, b|rep eagerly b|lap on the b|cfeet, worshipping it like b|their life depends on it, all while ${rearwag}.`,
        ])
      }
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        ` b|Rep b|let out b|a_sob as a|rep a|eagerly a|push a|their a|cfeet against b|their b|mouth, and desperately b|try to pull away.`,
        ` With b|a_sob, b|rep b|struggle against a|rep as a|they a|eagerly a|press a|their a|cfeet against b|their mouth.`,
      ]

      // combine t2 with a random t3 to form a sentence for t
      let t2 = [
        ` b|Rep desperately b|try, and b|fail, to pull b|their b|face away from a|reps a|cfeet,
          letting out b|a_sob in the process.`,
        ` b|A_sob bursts out from between b|reps lips as b|they weakly b|try to push a|reps a|cfeet away from   b|their b|face.`,
        ` Sobbing in distress, b|rep weakly b|struggle against a|rep as b|they b|plead for a|them to take a|their a|cfeet away from b|their b|face.`,
      ]

      let t3 = [
        ` Completely ignoring b|reps protests, a|rep a|push a|their a|cfeet harder against b|their mouth,   forcing b|them to worship a|their a|cfeet if b|they b|want to breathe.`,
				` Delighted at b|reps struggles, a|rep a|ignore the protests and a|continue to roughly grind a|their a|cfeet b|reps b|face.`,
				` Not paying any attention to b|reps struggles, a|rep a|let out growl as a|they forcefully a|push a|their a|cfeet against b|reps b|mouth.`,
      ]

      for (const s of t2) {
        t.push(`${s} ${setup.rng.choice(t3)}`)
      }
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|Rep ${h} start planting a series of mechanical licks on a|reps a|cfeet.`,
        ` b|Rep ${h} lick and suck on a|reps dirty toes, feeling disgusted and yet powerless to resist.`,
        ` b|Rep b|shut b|their b|eyes as b|they b|force b|themself to lick the a|cfeet presented in front of them.`,
      ]
    } else {
      t = [
        setup.SexUtil.mindbrokenReactionNoun(them, sex, [
          `the a|cfeet planted on b|their b|face`,
          `the smell of a|reps a|cfeet`,
          `the taste of a|reps a|cfeet on b|their b|mouth`,
        ])
      ]
    }

    story += setup.rng.choice(t) + ' '

    t = [
      `After roughly pushing a|their a|cfeet into b|reps b|face one last time, a|rep a|pull them away and a|put an end to b|their feet worshipping.`,
      `a|Rep a|grind a|their a|cfeet into b|reps face one last time, before letting out an amused moan and suddenly pulling them away from b|their b|mouth.`,
      ``,
    ]

    story += setup.rng.choice(t) + ' '

    return story
  }
}
