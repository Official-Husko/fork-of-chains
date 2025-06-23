/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
GenericOrgasms
*/

import { VaginaOrgasm } from "./VaginaOrgasm"

export class VaginaOrgasmOngoing extends VaginaOrgasm {
  getTags() { return super.getTags().concat([this.getPenetratorBodypart().getTag(), ]) }

  /**
   * @returns {setup.SexBodypart} 
   */
  getPenetratorBodypart() {
    return setup.sexbodypart.penis
  }

  /**
   * @returns {setup.SexBodypart} 
   */
  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  /**
   * Get additional restrictions with this sex actions
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return [
      setup.qres.SexIsOngoing('b', this.getPenetratorBodypart(), 'a', this.getPenetrationTarget())
    ]
  }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    const desc = super.getActorDescriptions()

    // add the target as an actor for convenience
    desc.push({
      paces: setup.SexPace.getAllPaces(),
      restrictions: [],
    })

    return desc
  }

  /**
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  describeOrgasm(sex) {
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')

    let story = ''

    const their_pace = sex.getPace(them)

    const dick = this.getPenetratorBodypart().rep(them, sex)
    const tip = this.getPenetratorBodypart().repTip(them, sex)
    const fuck = this.getPenetratorBodypart().repFuck(them, sex)

    let t
    if (their_pace == setup.sexpace.resist) {
      t = [
        ` b|Rep panickedly b|try to pull b|their ${dick} from inside your a|vagina, which only elicit
          pleasurable sensation of having it graze through a|reps vaginal muscles, `,
        ` Seeing the incoming orgasm, b|rep panickedly b|quiver in fear with b|their ${dick} still inside
          a|their a|vagina, which only gives pleasurable sensation, `,
      ]
    } else if (their_pace == setup.sexpace.mindbroken) {
      t = [
        ` Since b|rep is mindbroken, a|rep a|have to work the ${dick} a|themself, `,
        ` As b|rep is completely unresponsve, a|rep a|work the ${dick} a|themself by moving a|themself up and down, `,
      ]
    } else {
      story += ` b|Rep carries on ${fuck}ing a|reps vagina through a|their orgasm, `
    }
    story += ` causing a|them to let out a series of high-pitched moans as a|their vaginal muscles grip and squeeze around the intruding ${dick}.`

    return story
  }
}
