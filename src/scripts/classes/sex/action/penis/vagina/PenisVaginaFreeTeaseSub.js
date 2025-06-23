/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
penisVagina.FORCE_TAIL_OVER_VAGINA
*/

import { PenisHoleFreeBaseTeaseSub } from "../hole/PenisHoleFreeBase"

setup.SexActionClass.PenisVaginaFreeTeaseSub = class PenisVaginaFreeTeaseSub extends PenisHoleFreeBaseTeaseSub {
  getTags() { return super.getTags().concat(['sub']) }
  desc() { return 'Tease dick with vagina' }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return 'Tease b|reps b|dick with your a|vagina'
  }

  rawDescription(sex) {
    return `Slide the b|dickhead of b|reps b|dick over your a|vagina.`
  }
}
