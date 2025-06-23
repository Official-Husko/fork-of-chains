/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.CUNNILINGUS_SUB_RESIST
*/

import { MouthVaginaDomBaseResist } from "./MouthVaginaBase"

setup.SexActionClass.MouthVaginaDomResist = class MouthVaginaDomResist extends MouthVaginaDomBaseResist {
  getTags() { return super.getTags().concat(['normal']) }

  rawTitle(sex) {
    return 'Resist Cunnilingus'
  }

  rawDescription(sex) {
    return `Try to pull your tongue out of b|reps b|vagina.`
  }
}
