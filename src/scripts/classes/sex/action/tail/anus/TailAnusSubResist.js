/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailAnus.TAIL_FUCKING_SUB_RESIST
*/

import { TailAnusSubBaseResist } from "./TailAnusBase"

setup.SexActionClass.TailAnusSubResist = class TailAnusSubResist extends TailAnusSubBaseResist {
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
    return `Resist tail-fucked`;
  }

  rawDescription(sex) {
    return `Try and pull your a|anus away from b|reps b|tail.`
  }
}
