// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA: EAR_PULL */

import { PenisMouthDomBase } from "./PenisMouthBase"

import { penisMouthSizeDifferenceDeep } from "./util"

setup.SexActionClass.PenisMouthDomEarsPull = class PenisMouthDomEarsPull extends PenisMouthDomBase {
  getTags() { return super.getTags().concat(['dom', 'discomfort', ]) }
  desc() { return 'Pull ears/horns and receive deep-throating' }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: setup.Sex.AROUSAL_MEDIUMLARGE,
        paces: [setup.sexpace.dom, setup.sexpace.normal], 
        restrictions: [
          setup.qres.SexCanUseBodypart(setup.sexbodypart.arms),
        ],
      },
      {
        energy: setup.Sex.ENERGY_HIGH,
        arousal: setup.Sex.AROUSAL_MEDIUM,
        discomfort: setup.Sex.DISCOMFORT_MEDIUMLARGE,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [
          setup.qres.AnyTrait([
            setup.trait.ears_werewolf,
            setup.trait.ears_neko,
            setup.trait.ears_demon,
            setup.trait.ears_foxkin,
          ], true),
        ],
      },
    ]
  }

  getEars() {
    return this.getActorUnit('b').getTraitWithTag('ears')
  }

  isHorns() {
    return this.getEars().getTags().includes('horns')
  }

  repEars() {
    if (this.isHorns()) {
      return `b|horns`
    } else {
      return `b|ears`
    }
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_earsblowjob'),
    ])
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return `Pull ${this.isHorns() ? 'horns' : 'ears'}`
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Grab b|reps ${this.repEars()} and pull b|their b|mouth all the way onto the base of your a|dick.`;
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
    const ears = this.repEars()

    let st
    const knotbase = `${me.isHasTrait('dick_werewolf') ? 'a|their knot' : me.isHasTrait('dick_foxkin') ? 'the small knot at the base of a|their dick' : 'the base of a|their dick'}`
    if (mypace == setup.sexpace.dom) {
      st = [
        `Roughly grasping b|reps ${ears}, a|rep violently a|jerk b|their head forwards,
         forcing b|them to swallow a|their a|dick all the way down to the base.`,
        `Reaching down to grab b|reps ${ears}, a|rep mercilessly a|yank b|their head into a|their groin,
         letting out a|a_moan as a|they a|force b|them to deepthroat a|their a|dick.`,
        `With a|a_moan, a|rep a|reach down to grab b|reps ${ears}, before violently yanking b|them forwards,  hilting a|their a|dick down b|their throat so that b|their lips are pressed up against ${knotbase}.`,
        `With a sadistic grin, a|rep a|eagerly a|grab b|reps ${ears}, before using them as handles to
         force a|their a|dick all the way down b|their throat -- b|their lips now pressed against ${knotbase}.`,
        `Seeing the conveniently located natural handles, a|rep a|smile an evil grin before a|eagerly
         taking hold of b|reps ${ears} and use the natural handlebars to a|thrust a|their a|dick all the way
         inside b|reps throat.`,
      ]
      if (me.isHasTrait('dick_foxkin')) {
        st.push(`With a|a_moan, a|rep a|grab b|reps ${ears}, yanking b|them forward until b|their lips are pressed against the small knot at the base of a|their slim, sensitive cock. The knot swells quickly, locking them together in a gentle, needy embrace, making b|rep shudder and moan around it.`)
      }
    } else {
      st = [
        `Taking hold of b|reps ${ears}, a|rep a|eagerly a|pull b|their head forwards, forcing b|them to swallow a|their a|dick all the way down to the base.`,
        `Reaching down to take a grip on each of b|reps ${ears}, a|rep a|eagerly a|pull b|them into b|their groin, letting out a|a_moan as a|they a|force b|them to deepthroat a|their a|dick.`,
        `With a|a_moan, a|rep a|reach down to take hold of b|reps ${ears}, before a|eagerly pulling b|them forwards, hilting a|their a|dick down b|their throat so that b|their lips are pressed up against ${knotbase}.`,
        `Using b|reps ${ears} as handles, a|rep a|eagerly thrust a|their a|dick forward and forward until
         b|reps lips are pressing against ${knotbase}.`,
      ]
      if (me.isHasTrait('dick_foxkin')) {
        st.push(`With a|a_moan, a|rep a|grab b|reps ${ears}, pulling b|them forward until b|their lips are pressed against the small knot at the base of a|their slim, sensitive cock. The knot swells quickly, locking them together in a gentle, needy embrace, making b|rep shudder and moan around it.`)
      }
    }

    story += setup.rng.choice(st)

    story += ' '
    story += penisMouthSizeDifferenceDeep(me, them, sex) + ' '

    let dt = []
    if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      dt = [
        ` With tears welling up in b|their b|eyes, b|rep b|spend a moment b|eagerly caressing the underside of a|reps a|dick with b|their tongue, before finally being able to gasp for air as a|they momentarily a|withdraw a|their a|dick from b|their throat.`,
        ` b|Eagerly humming and moaning in delight, b|rep b|use b|their tongue to b|eagerly caress the underside of a|reps a|dick, obediently holding b|their breath until a|their a|dick is eventually pulled free from b|their throat.`,
      ]

      if (them.isHasTrait('training_oral_advanced')) {
        dt.push(`As an experienced oral slut, b|rep b|have no problem at all swallowing the entire length of a|reps a|dick, comfortably sliding it up and down b|their throat.`)
      } else if (them.isSlave()) {
        dt.push(`Despite the eagerness, the slave inexperience in oral sex draws chokes and uncomfortable moans from the b|race.`)
      }

      if (them.isSlaver()) {
        dt.push(`The rough treatment causes the slaver to b|eagerly moan in slight embarrassment, muffled by the a|dick still lodged inside b|their throat.`)
      }
    } else if (theirpace == setup.sexpace.dom) {
      dt = [
        ` Narrowing b|their b|eyes, b|rep b|put up with a|reps daring move for just a moment, before jerking b|their head back and pointedly reminding a|them who's in charge.`,
        ` The rumbling vibrations of b|reps threatening growls, while serving to provide some extra pleasure,
         nonetheless intimidate a|rep into quickly letting go of b|their hair and sliding a|their a|dick free from b|their throat.`,
        ` In response to the rough treatment, b|rep bare b|their b|teeth at a|rep, intimidating a|them into sliding a|their a|dick out of b|their throat.`,
      ]
    } else if (theirpace == setup.sexpace.resist || theirpace == setup.sexpace.forced) {
      dt = [
        ` Scrunching b|their b|eyes shut, b|rep b|beat against their tormentor's thighs in a futile gesture of resistance, before finally being able to cry and gasp for air as a|rep momentarily a|withdraw a|their a|dick from b|their throat, which does not last long.`,
        ` The vibrations of b|reps muffled cries and sobs only serve to give ${me.isYou() ? 'you' : 'their tormentor'} some extra pleasure, but, after spending several seconds punching and pushing against a|reps thighs, b|they finally b|achieve a small victory as b|their ${ears} are released and a|reps a|dick is momentarily slid free from b|their throat, which does not last long.`,
        ` b|Reps cries for mercy fall on deaf ears as a|rep tightens a|their grip of b|their ${ears},
          deriving much pleasure from the sensation of b|rep gagging, choking, and struggling through
          the a|dick lodged securely down in b|their b|throat.`,
      ]
    } else if (theirpace == setup.sexpace.mindbroken) {
      dt = [
        ` b|Reps b|eyes remain unfocused throughout the relentless facefuck, b|their mind already completely gone.`,
        ` b|Rep occasionally jerked in pain from the forced deepthroat, although it is merely an automatic response from the mindbroken sex toy.`,
        ` The forced deepthroat draws no response from the mindbroken sex toy, other than occassional struggle
          for air as b|their body responds automatically to the foreign intrusion of their throat.`,
      ]
    }

    story += setup.rng.choice(dt)
    return story
  }

}