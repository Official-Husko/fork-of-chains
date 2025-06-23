/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
GenericOrgasms
*/

import { MouthVaginaOrgasmBase } from "./MouthVaginaOrgasmBase"

setup.SexActionClass.MouthVaginaOrgasmInside = class MouthVaginaOrgasmInside extends MouthVaginaOrgasmBase {
  getTags() { return super.getTags().concat(['normal',]) }
  desc() { return 'Climax during cunnilingus' }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return `Climax during cunnilingus`
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
    if (their_pace == setup.sexpace.resist) {
      story += ` b|Rep panickedly licked and kiss a|their clit,`
    } else if (their_pace == setup.sexpace.mindbroken) {
      story += ` b|Rep remains unresponsive, but by getting a|their vagina very close to b|their face, a|they a|is able to elicit some kind of response from the mindbroken slave,`
    } else {
      story += ` b|Rep carries on licking and kissing at a|their clit while a|rep a|orgasm,`
    }

    story += ` causing a|them to let out a series of high-pitched moans as a|they a|feel your vaginal muscles quiver and contract at the overwhelming sensation.`

    return story
  }
}
