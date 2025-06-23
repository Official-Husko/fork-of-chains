/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.RECEIVING_CUNNILINGUS_SUB_RESIST
*/

import { MouthVaginaSubBaseResist } from "./MouthVaginaBase"

setup.SexActionClass.MouthVaginaSubResist = class MouthVaginaSubResist extends MouthVaginaSubBaseResist {
  getTags() { return super.getTags().concat(['normal']) }

  rawTitle(sex) {
    return 'Resist receiving cunnilingus'
  }

  rawDescription(sex) {
    return `Try and pull your a|vagina away from b|reps tongue.`
  }
}
