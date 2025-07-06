// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA: SUCKS_BALLS */

import { PenisBreastsSubBase } from "./PenisBreastsBase"

setup.SexActionClass.PenisBreastsSubTitfuckIntoBreasts = class PenisBreastsSubTitfuckIntoBreasts extends PenisBreastsSubBase {
  getTags() { return super.getTags().concat(['sub', 'mouth',]) }
  desc() { return 'Titfuck / Pecjob into mouth' }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_titfuck_mouth'),
      setup.qres.SexCanTitfuckIntoMouth('b', 'a'),
    ])
  }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALLMEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
        discomfort: setup.Sex.DISCOMFORT_TINY,
        paces: [setup.sexpace.normal, setup.sexpace.sub],
        restrictions: [
          setup.qres.SexCanUseBodypart(setup.sexbodypart.mouth),
        ],
      },
      {
        energy: setup.Sex.ENERGY_SMALLMEDIUM,
        arousal: setup.Sex.AROUSAL_SMALLMEDIUM,
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
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')
    const titfuck = setup.sexbodypart.breasts.repTitfuck(me, them)
    return `${setup.capitalize(titfuck)} into a|mouth`
  }

  /**
   * Short description of this action. E.g., "Put your breasts in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Push your head forwards and take the cock head of b|reps b|dick into your a|mouth.`
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

    const titfuck = setup.sexbodypart.breasts.getTitfuck(them, me)
    let push = setup.sexbodypart.breasts.repPush(them, me)

    let story = ''

    let t

    if (me.getMainTraining().getTags().includes('troral')) {
      t = [
        `The cockhead presented in from of a|rep is just too much for the cumslut,
         and a|they hungrily push a|their face towards it and a|lap its cockhead up.`,

        `The oral-fixated slave a|rep can't resist having a cockhead right in front of a|their face,
         and a|proceed to crane a|their a|neck and take the dick into a|their a|mouth.`,

        `The dick in front of the slave is far too tempting for the cum-fixated a|rep,
         and a|they hungrily a|reach into the shaft and a|gobble its head into a|their a|mouth.`,
      ]
    } else {
      t = [
        `Pushing a|their face towards b|reps b|dick as it slides up
          between a|their a|breasts, a|rep a|eagerly a|part a|their lips and
          a|take the cock head into a|their a|mouth.`,

        `Pushing a|their a|face forwards, a|rep a|eagerly a|take the cock head of
          b|reps b|dick into a|their a|mouth as b|they b|thrust up between
          a|their a|breasts.`,

        `The cockhead in front of a|them prove too tempting for a|rep and a|they
          a|part a|their lips to a|eagerly gobble down on the presented cockhead.`,
      ]
    }


    story += setup.rng.choice(t) + ' '

    if (theirpace == setup.sexpace.normal || theirpace == setup.sexpace.sub) {
      t = [
        ` b|Rep b|smile at a|their enthusiasm, and, b|eagerly pushing b|their
        b|dick into a|their a|mouth, b|they b|let a|them suck and kiss the cock
        head for a moment, before pulling back and continuing to fuck a|their
        a|breasts.`,
        ` b|Rep a|eagerly b|push b|their b|dick into a|their a|mouth, allowing
        a|them to give the cock head a hot, wet suck before drawing back and
        continuing to fuck a|their a|breasts.`,
        ` While a|rep a|is busy gobbling down on the cockhead, b|rep b|eagerly b|${push}
          a|their a|breasts together, stimulating the length of the shaft.`,
      ]
    } else if (theirpace == setup.sexpace.dom) {
      t = [
        ` b|Rep b|adv b|grin at b|their enthusiasm, and, roughly forcing b|their
        b|dick deeper into a|reps a|mouth, b|they b|allow a|them to suck and
        kiss the cock head for a moment, before pulling back and continuing
        to aggressively fuck a|their a|breasts.`,

        ` b|Rep roughly b|force b|their b|dick into a|their a|mouth, allowing
        a|them to give the cock head a hot, wet suck before drawing back and
        continuing to aggressively fuck a|reps a|breasts.`,

        ` While a|rep a|is busy gobbling down on the cockhead, b|rep forcefully b|${push}
          a|their a|breasts together, giving a much-needed stimulation on the length of the shaft.`,
      ]
    } else if (theirpace == setup.sexpace.forced) {
      const h = setup.SexUtil.hesitatesBeforeForcingThemselfTo(them, sex)
      t = [
        ` b|Rep ${h} just enjoy the rare opportunity of being able to receive a blowjob.`,
        ` b|Rep ${h} thrust tentatively forwards, hoping this pleases a|rep.`,
      ]
    } else if (theirpace == setup.sexpace.resist) {
      t = [
        setup.SexUtil.repResist(
          them,
          me,
          sex,
          [
            `try to pull b|their b|dick away from b|reps b|mouth`,
            `try to pull b|their hips back`,
            `try to pull away`,
          ],
          [
            `a|they a|continue sucking on the cockhead`,
            `a|they a|carry on kissing on the cockhead`,
            `a|they a|carry on playing with the cockhead`,
          ])
      ]
    } else if (theirpace == setup.sexpace.mindbroken) {
      t = [
        setup.SexUtil.mindbrokenReactionDespite(
          them, sex, [
          `Despite the stimulation showered on b|their b|dick`,
          `Despite the wet tongue slathering b|their cockhead`,
          `Despite the pleasurable sensation of a simultaneous ${titfuck} and blowjob`,
        ]
        )
      ]
    }

    story += setup.rng.choice(t) + ' '

    return story
  }
}
