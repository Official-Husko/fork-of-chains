/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailVagina.TAIL_FUCKING_SUB_RESIST
*/

import { PenisVaginaDomBaseResist } from "./PenisVaginaBase"

setup.SexActionClass.PenisVaginaDomResist = class PenisVaginaDomResist extends PenisVaginaDomBaseResist {
  getTags() { return super.getTags().concat(['normal']) }

  rawTitle(sex) {
    return 'Resist fucking'
  }

  rawDescription(sex) {
    return `Try to pull your a|dick out of b|reps b|vagina.`
  }
}
