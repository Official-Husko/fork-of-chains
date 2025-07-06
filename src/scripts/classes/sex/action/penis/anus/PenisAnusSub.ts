// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailAnus.RIDING_TAIL_DOM_GENTLE
tailAnus.RIDING_TAIL_DOM_NORMAL
tailAnus.RIDING_TAIL_DOM_ROUGH
tailAnus.RIDING_TAIL_SUB_NORMAL
tailAnus.RIDING_TAIL_SUB_EAGER
*/

import { PenisAnusSubBase } from "./PenisAnusBase"

setup.SexActionClass.PenisAnusSub = class PenisAnusSub extends PenisAnusSubBase {
  getTags() { return super.getTags().concat(['sub']) }
  desc() { return 'Receive anal' }

  rawTitle(sex) {
    return `Receive anal`;
  }

  rawDescription(sex) {
    return `Fuck your a|anus on b|reps b|dick`
  }
}
