/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
PenisVagina.TAIL_FUCKING_START
*/

import { PenisHoleStart } from "../hole/PenisHoleStart"

setup.SexActionClass.PenisVaginaStart = class PenisVaginaStart extends PenisHoleStart {
  getTags() { return super.getTags().concat(['dom',]) }
  desc() { return 'Start fucking' }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return 'Start fucking b|rep'
  }

  rawDescription(sex) {
    return `Sink your a|dick into b|reps b|vagina and start fucking b|them.`
  }
}
