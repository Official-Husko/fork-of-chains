/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TongueVagina.CUNNILINGUS_STOP
*/

import { MouthHoleEnd } from "../hole/MouthHoleEnd"

setup.SexActionClass.MouthVaginaEnd = class MouthVaginaEnd extends MouthHoleEnd {
  getTags() { return super.getTags().concat(['normal']) }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return 'End cunnilingus'
  }

  rawDescription(sex) {
    return `Pull your tongue out of b|reps b|vagina and stop performing cunnilingus.`;
  }
}
