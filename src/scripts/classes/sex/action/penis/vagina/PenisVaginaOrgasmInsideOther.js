/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
GenericOrgasms
*/

import { PenisVaginaOrgasmBaseOther } from "./PenisVaginaOrgasmBase"

setup.SexActionClass.PenisVaginaOrgasmInsideOther = class PenisVaginaOrgasmInsideOther extends PenisVaginaOrgasmBaseOther {
  getTags() { return super.getTags().concat(['normal',]) }
  desc() { return 'Climax while being fucked' }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return `Climax with b|rep inside of you`
  }
}
