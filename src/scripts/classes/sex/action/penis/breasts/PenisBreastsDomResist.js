/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
PenisBreasts.FUCKING_SUB_RESIST
*/

import { PenisBreastsDomBaseResist } from "./PenisBreastsBase"

setup.SexActionClass.PenisBreastsDomResist = class PenisBreastsDomResist extends PenisBreastsDomBaseResist {
  getTags() { return super.getTags().concat(['normal',]) }

  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_SMALLMEDIUM,
        arousal: -setup.Sex.AROUSAL_SMALL,
        discomfort: -setup.Sex.DISCOMFORT_SMALL,
        paces: [setup.sexpace.resist],
        restrictions: [
          setup.qres.SexPaceIn([setup.sexpace.resist])
        ],
      },
      {
        energy: setup.Sex.ENERGY_SMALLMEDIUM,
        arousal: setup.Sex.AROUSAL_SMALL,
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
    return `Resist receiving ${titfuck}`
  }

  /**
   * Short description of this action. E.g., "Put your breasts in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Try to pull your dick away from b|reps b|breasts.`
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
    const them = this.getActorUnit('b')
    const theirpace = sex.getPace(them)

    let story = ''

    let t

    if (theirpace == setup.sexpace.dom) {
      t = [
        `a|Rep desperately a|try to pull a|their a|dick out of b|reps
        b|cleavage, but b|they firmly b|squeeze b|their b|breasts together and b|hold
        the dick in place, while reasserting to a|them that b|they'll do whatever b|they
        b|want to a|them.`,

        `a|Rep frantically a|try to pull a|their a|dick away from b|reps b|breasts, but
         b|their b|breasts are gripping a|them in place. b|Rep b|moan as b|they b|ignore
        a|reps futile protests.`,

        `Tears start to well up in a|reps a|eyes as a|they a|try to pull out
        of b|reps b|cleavage, but it is simply stuck between the b|breasts, and b|they
        b|continue moaning as b|they firmly b|force a|their a|dick between
        b|their b|breasts.`,
      ]
    } else {
      t = [
        `a|Rep desperately a|try to pull a|their a|dick out of b|reps
        b|cleavage, but b|they firmly b|squeeze b|their b|breasts together and
        b|hold the dick in place, gently reminding a|them that b|they'll do
        whatever b|they b|want to a|them.`,

        `a|Rep frantically a|try to pull a|their a|dick away from b|reps b|breasts, but
        b|their b|breasts are gripping a|them in place. b|Rep moan b|eagerly as b|they
        b|ignore a|their desperate protests.`,

        `Tears start to well up in a|reps a|eyes as a|they a|try to pull out
        of b|reps b|cleavage, but it is simply stuck between the b|breasts, and b|they
        b|continue moaning as b|they eagerly b|force a|their a|dick
        between b|their b|breasts.`,
      ]
    }

    return t
  }
}