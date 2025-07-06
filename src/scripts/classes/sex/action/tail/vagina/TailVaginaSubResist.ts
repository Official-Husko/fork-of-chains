// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailVagina.TAIL_FUCKING_SUB_RESIST
*/

import { TailVaginaSubBaseResist } from "./TailVaginaBase"

setup.SexActionClass.TailVaginaSubResist = class TailVaginaSubResist extends TailVaginaSubBaseResist {
  getTags() { return super.getTags().concat(['normal', ]) }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return `Resist tail-fucked`;
  }

  rawDescription(sex) {
    return `Try and pull your a|vagina away from b|reps b|tail.`
  }
}
