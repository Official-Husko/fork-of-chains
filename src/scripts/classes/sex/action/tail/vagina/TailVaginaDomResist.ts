// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailVagina.TAIL_FUCKING_SUB_RESIST
*/

import { TailVaginaDomBaseResist } from "./TailVaginaBase"

setup.SexActionClass.TailVaginaDomResist = class TailVaginaDomResist extends TailVaginaDomBaseResist {
  getTags() { return super.getTags().concat(['normal', ]) }

  rawTitle(sex) {
    return 'Resist tail-fucking'
  }

  rawDescription(sex) {
    return `Try to pull your a|tail out of b|reps b|vagina.`
  }
}
