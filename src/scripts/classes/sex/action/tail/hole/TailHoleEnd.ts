// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.TAIL_FUCKING_STOP
*/

import { PhallusHoleEnd } from "../../phallus/hole/PhallusHoleEnd"

export class TailHoleEnd extends PhallusHoleEnd {
  getPenetratorBodypart() {
    return setup.sexbodypart.tail
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_tail'),
    ])
  }
}
