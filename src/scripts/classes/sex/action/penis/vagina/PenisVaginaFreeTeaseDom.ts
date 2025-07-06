// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
penisVagina.TEASE_TAIL_OVER_VAGINA
*/

import { PenisHoleFreeBaseTeaseDom } from "../hole/PenisHoleFreeBase"

setup.SexActionClass.PenisVaginaFreeTeaseDom = class PenisVaginaFreeTeaseDom extends PenisHoleFreeBaseTeaseDom {
  getTags() { return super.getTags().concat(['dom']) }
  desc() { return 'Tease dick over vagina' }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return 'Dick-tease'
  }

  rawDescription(sex) {
    return `Slide your a|dick around b|reps b|labia.`
  }
}
