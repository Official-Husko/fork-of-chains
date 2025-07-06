// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.TAIL_FUCKING_STOP
*/

import { TailHoleEnd } from "../hole/TailHoleEnd"

setup.SexActionClass.TailVaginaEnd = class TailVaginaEnd extends TailHoleEnd {
  getTags() { return super.getTags().concat(['normal', ]) }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return 'Stop tail-fucking vaginally'
  }

  rawDescription(sex) {
    return `Pull your a|tail out of b|reps b|vagina and stop tail-fucking b|them.`
  }
}
