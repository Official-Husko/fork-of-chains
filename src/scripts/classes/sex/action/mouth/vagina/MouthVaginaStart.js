/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TongueVagina.CUNNILINGUS_START
*/

import { MouthHoleStart } from "../hole/MouthHoleStart"

setup.SexActionClass.MouthVaginaStart = class MouthVaginaStart extends MouthHoleStart {
  getTags() { return super.getTags().concat(['sub']) }
  desc() { return 'Start performing cunnilingus' }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return 'Start cunnilingus'
  }

  rawDescription(sex) {
    return `Slide your a|tongue into b|reps b|vagina and start performing cunnilingus.`
  }
}
