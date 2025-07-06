// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
PenisVagina.TAIL_FUCKING_STOP
*/

import { PenisHoleEnd } from "../hole/PenisHoleEnd"

setup.SexActionClass.PenisVaginaEnd = class PenisVaginaEnd extends PenisHoleEnd {
  getTags() { return super.getTags().concat(['normal']) }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return 'Stop fucking'
  }

  rawDescription(sex) {
    return `Pull your a|dick out of b|reps b|vagina and stop fucking b|them.`
  }
}
