// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
GenericOrgasms
*/

import { TailVaginaOrgasmBase } from "./TailVaginaOrgasmBase"

setup.SexActionClass.TailVaginaOrgasmInside = class TailVaginaOrgasmInside extends TailVaginaOrgasmBase {
  getTags() { return super.getTags().concat(['normal',]) }
  desc() { return 'Climax while being tail-fucked' }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return `Climax with b|reps b|tail inside of you`
  }
}
