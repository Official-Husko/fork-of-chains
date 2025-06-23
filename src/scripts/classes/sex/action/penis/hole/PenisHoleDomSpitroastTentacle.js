/* ORIGINAL TEXT FROM darko */

import { eatCum } from "./cum"
import { PenisHoleDomBase } from "./PenisHoleBase"
import { spitroastReaction } from "./spitroast"

export class PenisHoleDomSpitroastTentacle extends PenisHoleDomBase {
  getTags() { return super.getTags().concat(['mouth',]) }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_tentacle_spitroast'),
    ])
  }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_LARGE,
        arousal: setup.Sex.AROUSAL_HUGE,
        paces: [setup.sexpace.dom, setup.sexpace.normal],
        restrictions: [
          setup.qres.Trait(setup.trait.magic_earth_master),
        ],
      },
      {
        energy: setup.Sex.ENERGY_LARGE,
        arousal: setup.Sex.AROUSAL_MEDIUM,
        discomfort: setup.Sex.DISCOMFORT_LARGE,
        paces: [setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.resist, setup.sexpace.mindbroken, setup.sexpace.forced],
        restrictions: [
          setup.qres.SexCanUseBodypart(setup.sexbodypart.mouth),
        ],
      },
    ]
  }

  rawTitle(sex) {
    return `Summon a tentacle and use it for a spitroast`
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')

    const dick = this.getPenetratorBodypart().rep(me, sex)
    const hole = this.getPenetrationTarget().rep(them, sex)

    return `With your ${dick} still in b|reps ${hole}, summon a tentacle and shove it inside b|their b|mouth.`
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
    const theirpace = sex.getPace(them)
    const theirpose = sex.getPose(them)
    const theirposition = sex.getPosition(them)

    let story = ''

    const dick = this.getPenetratorBodypart().rep(me, sex)
    const tip = this.getPenetratorBodypart().repTip(me, sex)
    const fuck = this.getPenetratorBodypart().repFuck(me, sex)

    const hole = this.getPenetrationTarget().rep(them, sex)
    const labia = this.getPenetrationTarget().repLabia(them, sex)
    const vaginal = this.getPenetrationTarget().repVaginal(them, sex)

    const myfacingheight = mypose.getFacingHeight(this.getPenetratorBodypart(), myposition, sex)
    const theirfacingheight = theirpose.getFacingHeight(this.getPenetrationTarget(), theirposition, sex)

    const floor = sex.getLocation().repSurface(sex)

    let dir = 'for'
    let odir = 'back'
    if (myfacingheight.facing.isDown()) {
      dir = 'down'
      odir = 'up'
    } else if (myfacingheight.facing.isUp()) {
      dir = 'up'
      odir = 'down'
    }

    let t = [
      `Closing a|their a|eyes, a|rep a|concentrate as an earthly tentacle suddenly sprout from the ${floor}.`,
      `Focusing a|their magic, a|rep momentarily a|glow before an earthly tentacle violently sprout from the ${floor}.`,
    ]

    story += setup.rng.choice(t) + ' '

    const mouthfacingheight = theirpose.getFacingHeight(setup.sexbodypart.mouth, theirposition, sex)
    const height = mouthfacingheight.height.repHeightLevel()

    t = [
      `With a|their ${dick} still deep inside b|reps ${hole},
       the tentacle wiggles, moving to the ${height} level before pointing the tip of its huge appendage right in front of b|reps b|mouth.`,
      `The tentacle squirm and wiggle before a|rep a|control its movement, move it to the ${height} level, and then position the wet
       tip of the tentacle right in front of b|reps b|mouth.`,
    ]

    story += setup.rng.choice(t) + ' '

    if (mypace == setup.sexpace.dom) {
      t = [
        `With an evil grin, a|rep grins maliciously as a|they a|use another of a|their magic to grow the tentacle even larger,`,
        `Without even the slightest warning, a|rep a|focus a|their energy as the tentacle suddenly grows even larger,`,
      ]
    } else {
      t = [
        `Hushing gently to b|rep, a|rep a|focus a|their energy on the tentacle to make it grow larger and bigger,`,
        `With a gentle hush, a|rep slowly a|grow the tentacle bigger and larger,`
      ]
    }

    story += setup.rng.choice(t) + ' '

    t = [
      ` before a|eagerly impaling its tip right inside b|reps b|mouth.`,
      ` before a|eagerly thrusting it right inside b|reps b|mouth.`,
      ` before a|eagerly choking it down b|reps throat.`,
    ]

    story += setup.rng.choice(t) + ' '

    let action = [
      `swallow the vine tentacle`,
      `choke on the wet tentacle`,
      `suck the magical tentacle`,
    ]
    story += spitroastReaction(me, dick, them, hole, action, sex) + ' '

    t = [
      `The tentacle eventually gushed down salty juice down b|reps throat,`,
      `After a long moment, the tentacle shrinks before squirting a large amount of salty plant cum which lands on b|reps tongue before going into b|their stomach,`,
    ]

    story += setup.rng.choice(t) + ' '

    story += eatCum(me, them, sex) + ' '

    story += setup.rng.choice([
      ` With a flick of a|their finger, the vine withdraws from b|reps b|mouth before vanishing into nothingness, and a|rep a|resume putting a|their ${dick} in b|reps ${hole}.`,
      ` With the plant juice all licked up, the vine disintegrates into nothingness as a|rep a|resume the fucking.`,
    ])

    return story
  }
}
