// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.TAIL_FUCKING_STOP
*/

import { TailHoleEnd } from "../hole/TailHoleEnd"

setup.SexActionClass.TailAnusEnd = class TailAnusEnd extends TailHoleEnd {
  getTags() { return super.getTags().concat(['normal']) }

  getPenetrationTarget() {
    return setup.sexbodypart.anus
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }

  rawTitle(sex) {
    return 'Stop tail-fucking anally'
  }

  rawDescription(sex) {
    return `Pull your a|tail out of b|reps b|anus and stop tail-fucking b|them.`
  }
}
