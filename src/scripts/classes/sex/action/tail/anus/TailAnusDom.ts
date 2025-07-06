// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailAnus.TAIL_FUCKING_DOM_GENTLE
tailAnus.TAIL_FUCKING_DOM_NORMAL
tailAnus.TAIL_FUCKING_DOM_ROUGH
tailAnus.TAIL_FUCKING_SUB_NORMAL
tailAnus.TAIL_FUCKING_SUB_EAGER
*/

import { TailAnusDomBase } from "./TailAnusBase"

setup.SexActionClass.TailAnusDom = class TailAnusDom extends TailAnusDomBase {
  getTags() { return super.getTags().concat(['dom', 'discomfort']) }
  desc() { return 'Anal tail-fucking' }

  rawTitle(sex) {
    return 'Tail-fucking'
  }

  rawDescription(sex) {
    return `Continue thrusting your a|tail in and out of b|reps b|anus.`
  }
}
