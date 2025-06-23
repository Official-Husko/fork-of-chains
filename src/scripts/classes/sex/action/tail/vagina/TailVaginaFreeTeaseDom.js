/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailVagina.TEASE_TAIL_OVER_VAGINA
*/

import { TailHoleFreeBaseTeaseDom } from "../hole/TailHoleFreeBase"

setup.SexActionClass.TailVaginaFreeTeaseDom = class TailVaginaFreeTeaseDom extends TailHoleFreeBaseTeaseDom {
  getTags() { return super.getTags().concat(['dom']) }
  desc() { return 'Tease tail over vagina' }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return 'Tail-tease'
  }

  rawDescription(sex) {
    return `Slide your a|tail around b|reps b|labia.`
  }
}
