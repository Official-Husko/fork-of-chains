// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.TAIL_FUCKING_START
*/

import { TailHoleStart } from "../hole/TailHoleStart"
import { analEnjoymentDescription } from "../../hole/util"

setup.SexActionClass.TailAnusStart = class TailAnusStart extends TailHoleStart {
  getTags() { return super.getTags().concat(['dom']) }
  desc() { return 'Start anal tail-fucking' }

  getPenetrationTarget() {
    return setup.sexbodypart.anus
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }

  rawTitle(sex) {
    return 'Start anal tail-fucking'
  }

  rawDescription(sex) {
    return `Sink your a|tail into b|reps b|anus and start tail-fucking b|them.`;
  }

  /**
   * @param {setup.SexInstance} sex 
   * @returns {string}
   */
  getExtraDescription(sex) {
    let desc = super.getExtraDescription(sex)
    desc += ' '
    desc += analEnjoymentDescription(this.getActorUnit('b'), sex)
    return desc
  }
}
