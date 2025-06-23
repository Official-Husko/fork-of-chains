/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.USING_TAIL_START
*/

import { PhallusHoleStartOther } from "../../phallus/hole/PhallusHoleStartOther"

export class TailHoleStartOther extends PhallusHoleStartOther {
  getPenetratorBodypart() {
    return setup.sexbodypart.tail
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_tail'),
    ])
  }

}
