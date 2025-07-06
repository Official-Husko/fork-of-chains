// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailVagina.TEASE_TAIL_OVER_VAGINA
*/

import { TailHoleFreeBaseTeaseDom } from "../hole/TailHoleFreeBase"

setup.SexActionClass.TailAnusFreeTeaseDom = class TailAnusFreeTeaseDom extends TailHoleFreeBaseTeaseDom {
  getTags() { return super.getTags().concat(['dom']) }
  desc() { return 'Anal tail-tease' }

  getPenetrationTarget() {
    return setup.sexbodypart.anus
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }

  rawTitle(sex) {
    return 'Anal tail-tease'
  }

  rawDescription(sex) {
    return `Slide your a|tail up and down b|reps b|ass.`
  }
}
