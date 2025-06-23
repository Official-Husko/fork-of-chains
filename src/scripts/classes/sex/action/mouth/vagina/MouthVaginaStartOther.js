/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TongueVagina.RECEIVING_CUNNILINGUS_START
*/

import { MouthHoleStartOther } from "../hole/MouthHoleStartOther"

setup.SexActionClass.MouthVaginaStartOther = class MouthVaginaStartOther extends MouthHoleStartOther {
  getTags() { return super.getTags().concat(['dom']) }
  desc() { return 'Start receiving cunnilingus' }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return `Receive cunnilingus`
  }

  rawDescription(sex) {
    return `Get b|rep to start licking a|reps a|vagina.`
  }
}
