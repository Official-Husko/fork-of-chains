/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
penisVagina.TEASE_TAIL_OVER_VAGINA
*/

import { PenisHoleFreeBaseTeaseDom } from "../hole/PenisHoleFreeBase"

setup.SexActionClass.PenisAnusFreeTeaseDom = class PenisAnusFreeTeaseDom extends PenisHoleFreeBaseTeaseDom {
  getTags() { return super.getTags().concat(['dom']) }
  desc() { return 'Anal dick-tease' }

  getPenetrationTarget() {
    return setup.sexbodypart.anus
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }

  rawTitle(sex) {
    return 'Anal dick-tease'
  }

  rawDescription(sex) {
    return `Slide your a|dick up and down b|reps b|ass.`
  }
}
