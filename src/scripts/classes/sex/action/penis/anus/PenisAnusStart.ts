// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
PenisVagina.TAIL_FUCKING_START
*/

import { PenisHoleStart } from "../hole/PenisHoleStart"
import { analEnjoymentDescription } from "../../hole/util"

setup.SexActionClass.PenisAnusStart = class PenisAnusStart extends PenisHoleStart {
  getTags() { return super.getTags().concat(['dom']) }
  desc() { return 'Start anal' }

  getPenetrationTarget() {
    return setup.sexbodypart.anus
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }

  rawTitle(sex) {
    return 'Start anal'
  }

  rawDescription(sex) {
    return `Sink your a|dick into b|reps b|anus and start fucking b|them.`
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
