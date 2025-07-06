// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.TAIL_FUCKING_START
*/

import { TailHoleStart } from "../hole/TailHoleStart"

setup.SexActionClass.TailVaginaStart = class TailVaginaStart extends TailHoleStart {
  getTags() { return super.getTags().concat(['dom', ]) }
  desc() { return 'Start tail-fucking' }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return 'Start vaginal tail-fucking'
  }

  rawDescription(sex) {
    return `Sink your a|tail into b|reps b|vagina and start tail-fucking b|them.`;
  }
}
