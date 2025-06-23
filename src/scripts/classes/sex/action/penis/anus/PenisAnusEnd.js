/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
PenisVagina.TAIL_FUCKING_STOP
*/

import { PenisHoleEnd } from "../hole/PenisHoleEnd"

setup.SexActionClass.PenisAnusEnd = class PenisAnusEnd extends PenisHoleEnd {
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
    return 'Stop anal'
  }

  rawDescription(sex) {
    return `Pull your a|dick out of b|reps b|anus and stop fucking b|them.`
  }
}
