// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailVagina.FORCE_TAIL_OVER_VAGINA 
*/

import { TailHoleFreeBaseTeaseSub } from "../hole/TailHoleFreeBase"

setup.SexActionClass.TailAnusFreeTeaseSub = class TailAnusFreeTeaseSub extends TailHoleFreeBaseTeaseSub {
  getTags() { return super.getTags().concat(['sub']) }
  desc() { return 'Tease tail with anus' }

  getPenetrationTarget() {
    return setup.sexbodypart.anus
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }

  rawTitle(sex) {
    return 'Tease b|reps b|tail with your a|anus'
  }

  rawDescription(sex) {
    return `Slide the b|tailtip of b|reps b|tail over your a|anus.`;
  }
}
